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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const routing_service_1 = require("../routing/routing.service");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersController = class OrdersController {
    routingService;
    prisma;
    constructor(routingService, prisma) {
        this.routingService = routingService;
        this.prisma = prisma;
    }
    async getOrders() {
        return this.prisma.order.findMany({
            include: {
                orderItems: {
                    include: {
                        menuItem: true
                    }
                },
                branch: true,
                user: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async updateOrderStatus(id, status) {
        return this.prisma.order.update({
            where: { id },
            data: { status: status }
        });
    }
    async createOrder(body) {
        const items = body.items || [];
        const orderItemsData = [];
        let calculatedTotal = 0;
        for (const item of items) {
            const menuItem = await this.prisma.menuItem.findFirst({
                where: { name: item.name }
            });
            if (menuItem) {
                const itemTotal = menuItem.price * item.quantity;
                calculatedTotal += itemTotal;
                orderItemsData.push({
                    menuItemId: menuItem.id,
                    quantity: item.quantity,
                    unitPrice: menuItem.price,
                    totalPrice: itemTotal,
                });
            }
        }
        const DELIVERY_FEE = 15;
        const tax = calculatedTotal * 0.05;
        const finalTotal = calculatedTotal + (body.mode === 'DELIVERY' ? DELIVERY_FEE : 0) + tax;
        let fallbackBranch = await this.prisma.location.findFirst();
        if (!fallbackBranch) {
            fallbackBranch = await this.prisma.location.create({
                data: {
                    name: 'System Default Branch',
                    address: 'Default Address',
                    latitude: 25.2048,
                    longitude: 55.2708,
                    isActive: true,
                    isClosed: false,
                }
            });
        }
        const order = await this.prisma.order.create({
            data: {
                userId: body.userId || null,
                mode: body.mode || 'DELIVERY',
                totalAmount: finalTotal,
                branchId: fallbackBranch.id,
                branchIdOriginal: fallbackBranch.id,
                radiusUsedKm: 0,
                customerLat: body.customerLat || 0,
                customerLng: body.customerLng || 0,
                orderItems: {
                    create: orderItemsData
                }
            }
        });
        if (order.mode === 'DELIVERY') {
            await this.routingService.queueOrderForRouting(order.id, order.customerLat, order.customerLng);
        }
        return {
            message: 'Order placed successfully',
            orderId: order.id,
            status: order.mode === 'DELIVERY' ? 'ROUTING' : 'PENDING'
        };
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "createOrder", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [routing_service_1.RoutingService,
        prisma_service_1.PrismaService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map