import { Controller, Post, Get, Patch, Param, Body, HttpCode, HttpStatus, Query, Logger } from '@nestjs/common';
import { RoutingService } from '../routing/routing.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResendService } from '../resend/resend.service';
import { ConfigService } from '@nestjs/config';
import { createClerkClient } from '@clerk/clerk-sdk-node';

@Controller('orders')
export class OrdersController {
    private readonly logger = new Logger(OrdersController.name);
    private clerkClient: ReturnType<typeof createClerkClient> | null = null;

    constructor(
        private routingService: RoutingService,
        private prisma: PrismaService,
        private resendService: ResendService,
        private configService: ConfigService,
    ) {
        const clerkSecret = this.configService.get<string>('CLERK_SECRET_KEY');
        if (clerkSecret) {
            this.clerkClient = createClerkClient({ secretKey: clerkSecret });
        } else {
            this.logger.warn('CLERK_SECRET_KEY not set — guest Clerk account creation disabled');
        }
    }

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

    @Get(':id')
    async getOrderById(@Param('id') id: string) {
        return this.prisma.order.findUnique({
            where: { id },
            include: {
                orderItems: {
                    include: {
                        menuItem: true
                    }
                },
                branch: true,
            }
        });
    }

    @Patch(':id/status')
    async updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
        const order = await this.prisma.order.update({
            where: { id },
            data: { status: status as any },
            include: {
                orderItems: { include: { menuItem: true } },
            }
        });

        // Send status update email if we have a customer email
        if (order.customerEmail) {
            this.resendService.sendOrderStatusEmail(order.customerEmail, {
                id: order.id,
                customerName: order.customerName || undefined,
                totalAmount: Number(order.totalAmount),
                status: order.status,
            }).catch(err => this.logger.error('Failed to send status email', err));
        }

        return order;
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createOrder(@Body() body: any) {
        // Resolve menu items from the DB to get their true IDs
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

        // Fetch store settings for service charge
        const settings = await this.prisma.storeSettings.findUnique({ where: { id: 'singleton' } });
        const serviceChargeEnabled = settings?.enableServiceCharge ?? false;
        const serviceChargePercent = settings?.serviceCharge ?? 0;

        let serviceChargeAmount = 0;
        if (serviceChargeEnabled && body.mode === 'DINE_IN') {
            serviceChargeAmount = calculatedTotal * (serviceChargePercent / 100);
        }

        const DELIVERY_FEE = 15;
        const tax = calculatedTotal * 0.05;
        const finalTotal = calculatedTotal + (body.mode === 'DELIVERY' ? DELIVERY_FEE : 0) + tax + serviceChargeAmount;

        // ─── Guest Account Creation ───
        let resolvedUserId = body.userId;
        let isNewGuestAccount = false;

        if (!resolvedUserId && body.customerEmail && body.customerName) {
            let existingUser = await this.prisma.user.findUnique({
                where: { email: body.customerEmail }
            });

            if (!existingUser) {
                // Try to create Clerk account for the guest
                let clerkUserId: string | null = null;
                if (this.clerkClient) {
                    try {
                        const clerkUser = await this.clerkClient.users.createUser({
                            firstName: body.customerName,
                            emailAddress: [body.customerEmail],
                            skipPasswordChecks: true,
                            skipPasswordRequirement: true,
                            publicMetadata: { role: 'customer' },
                        });
                        clerkUserId = clerkUser.id;
                        isNewGuestAccount = true;
                        this.logger.log(`Created Clerk guest account for ${body.customerEmail}: ${clerkUserId}`);
                    } catch (clerkErr: any) {
                        this.logger.warn(`Clerk guest creation failed for ${body.customerEmail}: ${clerkErr.message}`);
                    }
                }

                existingUser = await this.prisma.user.create({
                    data: {
                        ...(clerkUserId ? { id: clerkUserId } : {}),
                        email: body.customerEmail,
                        name: body.customerName,
                        phone: body.customerPhone || null,
                        password: 'guest-placeholder-password',
                    }
                });
            }
            resolvedUserId = existingUser.id;
        }

        // Resolve branch
        let selectedBranchId = body.branchId;
        if (!selectedBranchId) {
            const fallbackBranch = await this.prisma.location.findFirst({ where: { isActive: true } });
            selectedBranchId = fallbackBranch?.id;
        }

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
                customerName: body.customerName || null,
                customerEmail: body.customerEmail || null,
                customerPhone: body.customerPhone || null,
                customerStreet: body.customerStreet || null,
                customerCity: body.customerCity || null,
                customerPostcode: body.customerPostcode || null,
                deliveryInstructions: body.deliveryInstructions || null,
                branchId: selectedBranchId,
                branchIdOriginal: selectedBranchId,
                radiusUsedKm: 0,
                customerLat: body.customerLat || 0,
                customerLng: body.customerLng || 0,
                customerAddress: body.customerAddress || null,
                orderItems: {
                    create: orderItemsData
                }
            },
            include: {
                orderItems: { include: { menuItem: true } },
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
            await this.routingService.queueOrderForRouting(
                order.id,
                order.customerLat,
                order.customerLng
            );
        }

        // ─── Send Emails (fire-and-forget) ───
        if (body.customerEmail) {
            // 1. Order confirmation email
            this.resendService.sendOrderConfirmationEmail(body.customerEmail, {
                id: order.id,
                customerName: body.customerName,
                totalAmount: Number(order.totalAmount),
                mode: order.mode,
                items: order.orderItems,
            }).catch(err => this.logger.error('Failed to send confirmation email', err));

            // 2. Welcome email for new guest accounts
            if (isNewGuestAccount) {
                this.resendService.sendWelcomeEmail(
                    body.customerEmail,
                    body.customerName || 'Customer',
                ).catch(err => this.logger.error('Failed to send welcome email', err));
            }
        }

        return {
            message: 'Order placed successfully',
            orderId: order.id,
            status: order.mode === 'DELIVERY' ? 'ROUTING' : 'PENDING'
        };
    }
}
