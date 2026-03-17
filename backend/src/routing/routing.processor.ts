import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersGateway } from '../orders/orders.gateway';
import { Injectable, Logger, forwardRef, Inject } from '@nestjs/common';
import { RoutingService } from './routing.service';

@Processor('order-routing')
@Injectable()
export class RoutingProcessor extends WorkerHost {
    private readonly logger = new Logger(RoutingProcessor.name);

    constructor(
        private prisma: PrismaService,
        private ordersGateway: OrdersGateway,
        @Inject(forwardRef(() => RoutingService))
        private routingService: RoutingService
    ) {
        super();
    }

    // Basic Haversine distance formula
    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Earth's radius in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    async process(job: Job<any, any, string>): Promise<any> {
        if (job.name === 'assign-branch') {
            return this.handleBranchAssignment(job);
        } else if (job.name === 'check-acceptance') {
            return this.handleAcceptanceCheck(job);
        }
    }

    private async handleBranchAssignment(job: Job<any>) {
        const { orderId, customerLat, customerLng, isReassign } = job.data;
        this.logger.log(`Processing routing for order ${orderId}. Lat: ${customerLat}, Lng: ${customerLng}`);

        let routingLog = [];

        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order) throw new Error('Order not found');

        if (order.routingLog) {
            routingLog = typeof order.routingLog === 'string' ? JSON.parse(order.routingLog) : order.routingLog;
        }

        if (order.mode === 'PICKUP' || order.mode === 'DINE_IN') {
            this.logger.log(`Order ${orderId} is ${order.mode}, already assigned -> PENDING`);
            await this.prisma.order.update({
                where: { id: orderId },
                data: { status: 'PENDING' }
            });
            this.ordersGateway.notifyBranchOfNewOrder(order.branchId, {
                id: order.id,
                customerName: order.customerName || 'Guest',
                totalAmount: order.totalAmount,
                branchId: order.branchId,
                status: 'PENDING'
            });
            // Even pickup orders get a check (optional, but good for SLA)
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

        // If we have routing history, don't pick the same branch that skipped/rejected
        if (isReassign) {
            const skippedBranchIds = routingLog
                .filter((l: any) => l.step === 'acceptance_timeout' || l.step === 'branch_rejected')
                .map((l: any) => l.branchId);

            const nextBest = eligible.find(b => !skippedBranchIds.includes(b.id));
            if (nextBest) {
                targetBranch = nextBest;
            } else {
                this.logger.warn(`All eligible branches already tried for ${orderId}. Rotating back or using absolute nearest.`);
            }
        }

        if (targetBranch.isClosed) {
            routingLog.push({ step: 'branch_closed_check', branchId: targetBranch.id, time: new Date() });
            const nextOpen = eligible.find(b => !b.isClosed);
            if (nextOpen) {
                targetBranch = nextOpen;
                routingLog.push({ step: 'reassign_next_open', branchId: targetBranch.id, time: new Date() });
            } else {
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

        const updateData: any = {
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
            id: order.id,
            customerName: order.customerName || 'Guest',
            totalAmount: order.totalAmount,
            branchId: targetBranch.id,
            status: updateData.status,
            distance: targetBranch.distanceKm,
        });

        // Start the 8-minute acceptance clock
        await this.routingService.queueAcceptanceCheck(orderId);
    }

    private async handleAcceptanceCheck(job: Job<any>) {
        const { orderId } = job.data;
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order) return;

        // If order is still PENDING or LONG_DISTANCE, it means branch hasn't CONFIRMED yet
        if (order.status === 'PENDING' || order.status === 'LONG_DISTANCE' || order.status === 'ROUTING') {
            this.logger.warn(`Order ${orderId} not accepted within window. Escalating.`);

            let routingLog = typeof order.routingLog === 'string' ? JSON.parse(order.routingLog) : order.routingLog;
            routingLog.push({ step: 'acceptance_timeout', branchId: order.branchId, time: new Date() });

            // If we've only tried once, try reassigning to next nearest
            if (order.routingAttempts < 3) {
                this.logger.log(`Triggering reassignment for order ${orderId}`);
                await this.prisma.order.update({
                    where: { id: orderId },
                    data: { status: 'REASSIGNING', routingLog }
                });

                // Re-queue for routing with isReassign = true
                await this.routingService.queueOrderForRouting(orderId, order.customerLat, order.customerLng, true);
            } else {
                // Max attempts reached, mark as ESCALATED for manager to handle manually
                this.logger.error(`Max routing attempts reached for order ${orderId}. ESCALATING.`);
                routingLog.push({ step: 'max_attempts_escalated', time: new Date() });
                await this.prisma.order.update({
                    where: { id: orderId },
                    data: { status: 'ESCALATED', routingLog }
                });
            }
        }
    }
}
