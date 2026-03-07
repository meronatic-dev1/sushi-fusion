import { Controller, Post, Get, Patch, Param, Body, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { RoutingService } from '../routing/routing.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('orders')
export class OrdersController {
    constructor(
        private routingService: RoutingService,
        private prisma: PrismaService
    ) { }

    @Get()
    async getOrders(@Query('branchId') branchId?: string) {
        return this.prisma.order.findMany({
            where: branchId ? { branchId } : undefined,
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

    @Patch(':id/status')
    async updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.prisma.order.update({
            where: { id },
            data: { status: status as any } // Cast the string to Prisma enum
        });
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createOrder(@Body() body: any) {
        // Resolve menu items from the DB to get their true IDs
        const items = body.items || [];
        const orderItemsData = [];

        let calculatedTotal = 0;

        for (const item of items) {
            // Find the item by name since the frontend mock data didn't have real IDs
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

        // Fetch store settings for service charge
        const settings = await this.prisma.storeSettings.findUnique({ where: { id: 'singleton' } });
        const serviceChargeEnabled = settings?.enableServiceCharge ?? false;
        const serviceChargePercent = settings?.serviceCharge ?? 0;

        let serviceChargeAmount = 0;
        if (serviceChargeEnabled && body.mode === 'DINE_IN') {
            serviceChargeAmount = calculatedTotal * (serviceChargePercent / 100);
        }

        // Add dummy Delivery fee & Tax for this POC
        const DELIVERY_FEE = 15;
        const tax = calculatedTotal * 0.05;
        const finalTotal = calculatedTotal + (body.mode === 'DELIVERY' ? DELIVERY_FEE : 0) + tax + serviceChargeAmount;

        // Ensure we link a User (find existing or create guest)
        let resolvedUserId = body.userId;

        if (!resolvedUserId && body.customerEmail && body.customerName) {
            let existingUser = await this.prisma.user.findUnique({
                where: { email: body.customerEmail }
            });

            if (!existingUser) {
                existingUser = await this.prisma.user.create({
                    data: {
                        email: body.customerEmail,
                        name: body.customerName,
                        phone: body.customerPhone || null,
                        password: 'guest-placeholder-password', // Required by schema
                    }
                });
            }
            resolvedUserId = existingUser.id;
        }

        // Resolve branch: use body.branchId if provided (frontend auto-selection)
        // otherwise fallback to first available branch
        let selectedBranchId = body.branchId;
        if (!selectedBranchId) {
            const fallbackBranch = await this.prisma.location.findFirst({ where: { isActive: true } });
            selectedBranchId = fallbackBranch?.id;
        }

        // If still no branch, create a system default one
        if (!selectedBranchId) {
            const systemBranch = await this.prisma.location.create({
                data: {
                    name: 'System Default Branch',
                    address: 'Default Address',
                    latitude: 25.2048,
                    longitude: 55.2708,
                    isActive: true,
                    isClosed: false,
                }
            });
            selectedBranchId = systemBranch.id;
        }

        const order = await this.prisma.order.create({
            data: {
                userId: resolvedUserId || null,
                mode: body.mode || 'DELIVERY',
                totalAmount: finalTotal,
                // Customer details from checkout form
                customerName: body.customerName || null,
                customerEmail: body.customerEmail || null,
                customerPhone: body.customerPhone || null,
                customerStreet: body.customerStreet || null,
                customerCity: body.customerCity || null,
                customerPostcode: body.customerPostcode || null,
                deliveryInstructions: body.deliveryInstructions || null,
                // Routing fields
                branchId: selectedBranchId,
                branchIdOriginal: selectedBranchId,
                radiusUsedKm: 0,
                customerLat: body.customerLat || 0,
                customerLng: body.customerLng || 0,
                customerAddress: body.customerAddress || null,
                orderItems: {
                    create: orderItemsData
                }
            }
        });

        // Update salesCount for best sellers
        for (const item of orderItemsData) {
            await this.prisma.menuItem.update({
                where: { id: item.menuItemId },
                data: { salesCount: { increment: item.quantity } }
            });
        }

        if (order.mode === 'DELIVERY') {
            // Hands off the heavy lifting to BullMQ
            await this.routingService.queueOrderForRouting(
                order.id,
                order.customerLat,
                order.customerLng
            );
        }

        return {
            message: 'Order placed successfully',
            orderId: order.id,
            status: order.mode === 'DELIVERY' ? 'ROUTING' : 'PENDING'
        };
    }
}
