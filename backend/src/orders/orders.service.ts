import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoutingService } from '../routing/routing.service';
import { ResendService } from '../resend/resend.service';
import { ConfigService } from '@nestjs/config';
import { createClerkClient } from '@clerk/clerk-sdk-node';
import { OrdersGateway } from './orders.gateway';
import { SessionsService } from '../sessions/sessions.service';

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);
    private clerkClient: ReturnType<typeof createClerkClient> | null = null;

    constructor(
        private prisma: PrismaService,
        private routingService: RoutingService,
        private resendService: ResendService,
        private configService: ConfigService,
        private ordersGateway: OrdersGateway,
        private sessionsService: SessionsService,
    ) {
        const clerkSecret = this.configService.get<string>('CLERK_SECRET_KEY');
        if (clerkSecret) {
            this.clerkClient = createClerkClient({ secretKey: clerkSecret });
        }
    }

    async findAll(branchId?: string) {
        return this.prisma.order.findMany({
            where: branchId ? { branchId } : undefined,
            include: {
                orderItems: {
                    include: { menuItem: true }
                },
                branch: true,
                user: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findById(id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                orderItems: {
                    include: { menuItem: true }
                },
                branch: true,
            }
        });
        if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
        return order;
    }

    async create(body: any) {
        const items = body.items || [];
        const orderItemsData = [];
        let calculatedTotal = 0;

        for (const item of items) {
            const menuItem = await this.prisma.menuItem.findUnique({
                where: { id: item.menuItemId }
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
            } else {
                this.logger.warn(`Menu item with ID ${item.menuItemId} not found during order creation`);
            }
        }

        const settings = await this.prisma.storeSettings.findUnique({ where: { id: 'singleton' } });
        const serviceChargeEnabled = settings?.enableServiceCharge ?? false;
        const serviceChargeTakeawayEnabled = settings?.enableServiceChargeTakeaway ?? false;
        const serviceChargePercent = settings?.serviceCharge ?? 0;

        let serviceChargeAmount = 0;
        const isDineIn = body.mode === 'DINE_IN';
        const isTakeawayOrDelivery = body.mode === 'DELIVERY' || body.mode === 'PICKUP';

        if ((serviceChargeEnabled && isDineIn) || (serviceChargeTakeawayEnabled && isTakeawayOrDelivery)) {
            serviceChargeAmount = calculatedTotal * (serviceChargePercent / 100);
        }

        const DELIVERY_FEE = 15;
        const tax = calculatedTotal * 0.05;
        const finalTotal = calculatedTotal + (body.mode === 'DELIVERY' ? DELIVERY_FEE : 0) + tax + serviceChargeAmount;

        let resolvedUserId = body.clerkUserId;
        let isNewGuestAccount = false;

        if (!resolvedUserId && body.customerEmail && body.customerName) {
            let existingUser = await this.prisma.user.findUnique({
                where: { email: body.customerEmail }
            });

            if (!existingUser) {
                let clerkUserId: string | null = null;
                if (this.clerkClient) {
                    try {
                        const [clerkUserByEmail] = await this.clerkClient.users.getUserList({ emailAddress: [body.customerEmail] });
                        if (clerkUserByEmail) {
                          clerkUserId = clerkUserByEmail.id;
                        } else {
                          const clerkUser = await this.clerkClient.users.createUser({
                              firstName: body.customerName,
                              emailAddress: [body.customerEmail],
                              skipPasswordChecks: true,
                              skipPasswordRequirement: true,
                              publicMetadata: { role: 'customer' },
                          });
                          clerkUserId = clerkUser.id;
                          isNewGuestAccount = true;
                        }
                    } catch (clerkErr: any) {
                        this.logger.warn(`Clerk user operations failed: ${clerkErr.message}`);
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
        } else if (resolvedUserId) {
            // Sign-in case: Check if local user exists, if not create them
            const localUser = await this.prisma.user.findUnique({ where: { id: resolvedUserId } });
            if (!localUser && body.customerEmail && body.customerName) {
                await this.prisma.user.create({
                    data: {
                        id: resolvedUserId,
                        email: body.customerEmail,
                        name: body.customerName,
                        phone: body.customerPhone || null,
                        password: 'clerk-synced-placeholder'
                    }
                }).catch(err => this.logger.warn(`Failed to create local sync user ${resolvedUserId}: ${err.message}`));
            }
        }

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
                customerLat: body.latitude || 0,
                customerLng: body.longitude || 0,
                customerAddress: body.address || null,
                orderItems: { create: orderItemsData }
            },
            include: { orderItems: { include: { menuItem: true } } }
        });

        for (const item of orderItemsData) {
            await this.prisma.menuItem.update({
                where: { id: item.menuItemId },
                data: { salesCount: { increment: item.quantity } }
            });
        }

        if (order.mode === 'DELIVERY') {
            await this.routingService.queueOrderForRouting(order.id, order.customerLat, order.customerLng);
        } else {
            // For PICKUP and DINE_IN, notify immediately as branch is already assigned
            this.ordersGateway.notifyBranchOfNewOrder(order.branchId, {
                id: order.id,
                customerName: order.customerName || 'Guest',
                totalAmount: order.totalAmount,
                branchId: order.branchId,
                status: 'PENDING'
            });
        }

        if (body.customerEmail) {
            this.resendService.sendOrderConfirmationEmail(body.customerEmail, {
                id: order.id,
                customerName: body.customerName,
                totalAmount: Number(order.totalAmount),
                mode: order.mode,
                items: order.orderItems,
            }).catch(err => this.logger.error('Failed to send confirmation email', err));

            if (isNewGuestAccount) {
                this.resendService.sendWelcomeEmail(body.customerEmail, body.customerName || 'Customer')
                    .catch(err => this.logger.error('Failed to send welcome email', err));
            }
        }

        return order;
    }

    async updateStatus(id: string, status: string) {
        const order = await this.prisma.order.update({
            where: { id },
            data: { status: status as any },
            include: { orderItems: { include: { menuItem: true } } }
        });

        if (order.customerEmail) {
            this.resendService.sendOrderStatusEmail(order.customerEmail, {
                id: order.id,
                customerName: order.customerName || undefined,
                totalAmount: Number(order.totalAmount),
                status: order.status,
            }).catch(err => this.logger.error('Failed to send status email', err));
        }

        this.ordersGateway.notifyOrderUpdate(order.id, order);
        this.ordersGateway.notifyBranchOfOrderUpdate(order.branchId, order);
        return order;
    }

    async processRefund(id: string, amount?: number, reason?: string) {
        const order = await this.findById(id);
        const refundAmount = amount ?? Number(order.totalAmount);

        if (order.status !== 'CANCELLED') {
            await this.prisma.order.update({
                where: { id },
                data: { status: 'CANCELLED' },
            });
        }

        if (order.customerEmail) {
            this.resendService.sendRefundNotificationEmail(order.customerEmail, {
                orderId: order.id,
                customerName: order.customerName || undefined,
                refundAmount,
                reason,
            }).catch(err => this.logger.error('Failed to send refund email', err));
        }

        this.ordersGateway.notifyOrderUpdate(id, { id, status: 'CANCELLED' });
        return { message: 'Refund processed', orderId: id, refundAmount };
    }
}
