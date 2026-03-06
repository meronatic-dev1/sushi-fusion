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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RoutingProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const prisma_service_1 = require("../prisma/prisma.service");
const orders_gateway_1 = require("../orders/orders.gateway");
const common_1 = require("@nestjs/common");
const routing_service_1 = require("./routing.service");
let RoutingProcessor = RoutingProcessor_1 = class RoutingProcessor extends bullmq_1.WorkerHost {
    prisma;
    ordersGateway;
    routingService;
    logger = new common_1.Logger(RoutingProcessor_1.name);
    constructor(prisma, ordersGateway, routingService) {
        super();
        this.prisma = prisma;
        this.ordersGateway = ordersGateway;
        this.routingService = routingService;
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
        if (job.name === 'assign-branch') {
            return this.handleBranchAssignment(job);
        }
        else if (job.name === 'check-acceptance') {
            return this.handleAcceptanceCheck(job);
        }
    }
    async handleBranchAssignment(job) {
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
            await this.routingService.queueAcceptanceCheck(orderId);
            return;
        }
        routingLog.push({ step: 'find_branches', radius: 20, time: new Date() });
        let branches = await this.prisma.location.findMany({ where: { isActive: true } });
        let branchesWithDistance = branches.map(b => ({
            ...b,
            distanceKm: this.calculateDistance(customerLat, customerLng, b.latitude, b.longitude)
        })).sort((a, b) => a.distanceKm - b.distanceKm);
        let eligible = branchesWithDistance.filter(b => b.distanceKm <= 20);
        let radiusUsedKm = 20;
        if (eligible.length === 0) {
            this.logger.warn(`No branches within 20km for ${orderId}. Expanding to 35km.`);
            routingLog.push({ step: 'radius_expand', newRadius: 35, time: new Date() });
            eligible = branchesWithDistance.filter(b => b.distanceKm <= 35);
            radiusUsedKm = 35;
            if (eligible.length === 0) {
                this.logger.warn(`Still no branches within 35km for ${orderId}. Assigning nearest regardless of radius.`);
                routingLog.push({ step: 'assign_nearest', logic: 'no_radius_limit', time: new Date() });
                eligible = [branchesWithDistance[0]];
                radiusUsedKm = eligible[0].distanceKm;
            }
        }
        let targetBranch = eligible[0];
        let isLongDistance = targetBranch.distanceKm > 20;
        if (isReassign) {
            const skippedBranchIds = routingLog
                .filter((l) => l.step === 'acceptance_timeout' || l.step === 'branch_rejected')
                .map((l) => l.branchId);
            const nextBest = eligible.find(b => !skippedBranchIds.includes(b.id));
            if (nextBest) {
                targetBranch = nextBest;
            }
            else {
                this.logger.warn(`All eligible branches already tried for ${orderId}. Rotating back or using absolute nearest.`);
            }
        }
        if (targetBranch.isClosed) {
            routingLog.push({ step: 'branch_closed_check', branchId: targetBranch.id, time: new Date() });
            const nextOpen = eligible.find(b => !b.isClosed);
            if (nextOpen) {
                targetBranch = nextOpen;
                routingLog.push({ step: 'reassign_next_open', branchId: targetBranch.id, time: new Date() });
            }
            else {
                this.logger.log(`All eligible branches closed for order ${orderId}. Scheduling.`);
                routingLog.push({ step: 'all_closed_scheduled', time: new Date() });
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
        routingLog.push({ step: 'branch_assigned', branchId: targetBranch.id, isReassign, time: new Date() });
        const updateData = {
            status: isLongDistance ? 'LONG_DISTANCE' : 'PENDING',
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
            status: updateData.status,
            distance: targetBranch.distanceKm,
        });
        await this.routingService.queueAcceptanceCheck(orderId);
    }
    async handleAcceptanceCheck(job) {
        const { orderId } = job.data;
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            return;
        if (order.status === 'PENDING' || order.status === 'LONG_DISTANCE' || order.status === 'ROUTING') {
            this.logger.warn(`Order ${orderId} not accepted within window. Escalating.`);
            let routingLog = typeof order.routingLog === 'string' ? JSON.parse(order.routingLog) : order.routingLog;
            routingLog.push({ step: 'acceptance_timeout', branchId: order.branchId, time: new Date() });
            if (order.routingAttempts < 3) {
                this.logger.log(`Triggering reassignment for order ${orderId}`);
                await this.prisma.order.update({
                    where: { id: orderId },
                    data: { status: 'REASSIGNING', routingLog }
                });
                await this.routingService.queueOrderForRouting(orderId, order.customerLat, order.customerLng, true);
            }
            else {
                this.logger.error(`Max routing attempts reached for order ${orderId}. ESCALATING.`);
                routingLog.push({ step: 'max_attempts_escalated', time: new Date() });
                await this.prisma.order.update({
                    where: { id: orderId },
                    data: { status: 'ESCALATED', routingLog }
                });
            }
        }
    }
};
exports.RoutingProcessor = RoutingProcessor;
exports.RoutingProcessor = RoutingProcessor = RoutingProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('order-routing'),
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => routing_service_1.RoutingService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        orders_gateway_1.OrdersGateway,
        routing_service_1.RoutingService])
], RoutingProcessor);
//# sourceMappingURL=routing.processor.js.map