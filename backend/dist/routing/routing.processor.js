"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RoutingProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const prisma_service_1 = require("../prisma/prisma.service");
const orders_gateway_1 = require("../orders/orders.gateway");
const common_1 = require("@nestjs/common");
let RoutingProcessor = RoutingProcessor_1 = class RoutingProcessor extends bullmq_1.WorkerHost {
    prisma;
    ordersGateway;
    logger = new common_1.Logger(RoutingProcessor_1.name);
    constructor(prisma, ordersGateway) {
        super();
        this.prisma = prisma;
        this.ordersGateway = ordersGateway;
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    async process(job) {
        const { orderId, customerLat, customerLng, isReassign } = job.data;
        this.logger.log(`Processing routing for order ${orderId}. Lat: ${customerLat}, Lng: ${customerLng}`);
        let routingLog = [];
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new Error('Order not found');
        if (order.routingLog) {
            routingLog = typeof order.routingLog === 'string' ? JSON.parse(order.routingLog) : order.routingLog;
        }
        if (order.mode === 'PICKUP' || order.mode === 'DINE_IN') {
            this.logger.log(`Order ${orderId} is ${order.mode}, already assigned -> PENDING`);
            await this.prisma.order.update({
                where: { id: orderId },
                data: { status: 'PENDING' }
            });
            this.ordersGateway.notifyBranchOfNewOrder(order.branchId, orderId);
            return;
        }
        routingLog.push({ step: 'find_branches', radius: 20 });
        let branches = await this.prisma.location.findMany({ where: { isActive: true } });
        let branchesWithDistance = branches.map(b => ({
            ...b,
            distanceKm: this.calculateDistance(customerLat, customerLng, b.latitude, b.longitude)
        })).sort((a, b) => a.distanceKm - b.distanceKm);
        let eligible = branchesWithDistance.filter(b => b.distanceKm <= 20);
        let radiusUsedKm = 20;
        if (eligible.length === 0) {
            this.logger.warn(`No branches within 20km for ${orderId}. Expanding to 35km.`);
            routingLog.push({ step: 'radius_expand', newRadius: 35 });
            eligible = branchesWithDistance.filter(b => b.distanceKm <= 35);
            radiusUsedKm = 35;
            if (eligible.length === 0) {
                this.logger.warn(`Still no branches within 35km for ${orderId}. Assigning nearest regardless of radius.`);
                routingLog.push({ step: 'assign_nearest', logic: 'no_radius_limit' });
                eligible = [branchesWithDistance[0]];
                radiusUsedKm = eligible[0].distanceKm;
            }
        }
        let targetBranch = eligible[0];
        let isLongDistance = targetBranch.distanceKm > 20;
        if (targetBranch.isClosed) {
            routingLog.push({ step: 'branch_closed_check' });
            const nextOpen = eligible.find(b => !b.isClosed);
            if (nextOpen) {
                targetBranch = nextOpen;
                routingLog.push({ step: 'reassign_next_open', branchId: targetBranch.id });
            }
            else {
                this.logger.log(`All eligible branches closed for order ${orderId}. Scheduling.`);
                routingLog.push({ step: 'all_closed_scheduled' });
                await this.prisma.order.update({
                    where: { id: orderId },
                    data: {
                        status: 'SCHEDULED',
                        branchId: targetBranch.id,
                        routingAttempts: { increment: 1 },
                        routingLog,
                        radiusUsedKm
                    }
                });
                return;
            }
        }
        routingLog.push({ step: 'branch_assigned', branchId: targetBranch.id });
        const updateData = {
            status: 'PENDING',
            branchId: targetBranch.id,
            routingAttempts: { increment: 1 },
            radiusUsedKm,
            isLongDistance,
            routingLog
        };
        if (!order.branchIdOriginal) {
            updateData.branchIdOriginal = targetBranch.id;
        }
        if (isReassign) {
            updateData.isReassigned = true;
        }
        await this.prisma.order.update({
            where: { id: orderId },
            data: updateData
        });
        this.logger.log(`Order ${orderId} assigned to ${targetBranch.name} (${targetBranch.distanceKm.toFixed(2)}km). PENDING.`);
        this.ordersGateway.notifyBranchOfNewOrder(targetBranch.id, {
            orderId,
            status: 'PENDING',
            distance: targetBranch.distanceKm,
        });
    }
};
exports.RoutingProcessor = RoutingProcessor;
exports.RoutingProcessor = RoutingProcessor = RoutingProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('order-routing'),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        orders_gateway_1.OrdersGateway])
], RoutingProcessor);
//# sourceMappingURL=routing.processor.js.map