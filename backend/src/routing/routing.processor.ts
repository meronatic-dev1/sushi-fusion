import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersGateway } from '../orders/orders.gateway';
import { Injectable, Logger } from '@nestjs/common';

@Processor('order-routing')
@Injectable()
export class RoutingProcessor extends WorkerHost {
    private readonly logger = new Logger(RoutingProcessor.name);

    constructor(
        private prisma: PrismaService,
        private ordersGateway: OrdersGateway
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
        const { orderId, customerLat, customerLng, isReassign } = job.data;
        this.logger.log(`Processing routing for order ${orderId}. Lat: ${customerLat}, Lng: ${customerLng}`);

        let routingLog = [];

        // Fetch the order
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order) throw new Error('Order not found');

        if (order.routingLog) {
            routingLog = typeof order.routingLog === 'string' ? JSON.parse(order.routingLog) : order.routingLog;
        }

        if (order.mode === 'PICKUP' || order.mode === 'DINE_IN') {
            // Manual selection or tied to branch.
            this.logger.log(`Order ${orderId} is ${order.mode}, already assigned -> PENDING`);
            await this.prisma.order.update({
                where: { id: orderId },
                data: { status: 'PENDING' }
            });
            this.ordersGateway.notifyBranchOfNewOrder(order.branchId, orderId);
            return;
        }

        // Phase 2: Find Eligible Branches within 20km
        routingLog.push({ step: 'find_branches', radius: 20 });
        let branches = await this.prisma.location.findMany({ where: { isActive: true } });

        // Calculate distances
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
                eligible = [branchesWithDistance[0]]; // fallback to absolute closest
                radiusUsedKm = eligible[0].distanceKm;
            }
        }

        // Phase 3: Check Assigned Branch
        let targetBranch = eligible[0];
        let isLongDistance = targetBranch.distanceKm > 20;

        if (targetBranch.isClosed) {
            // Find next open branch
            routingLog.push({ step: 'branch_closed_check' });
            const nextOpen = eligible.find(b => !b.isClosed);
            if (nextOpen) {
                targetBranch = nextOpen;
                routingLog.push({ step: 'reassign_next_open', branchId: targetBranch.id });
            } else {
                // All closed -> schedule
                this.logger.log(`All eligible branches closed for order ${orderId}. Scheduling.`);
                routingLog.push({ step: 'all_closed_scheduled' });
                await this.prisma.order.update({
                    where: { id: orderId },
                    data: {
                        status: 'SCHEDULED',
                        branchId: targetBranch.id, // assign nearest anyway
                        routingAttempts: { increment: 1 },
                        routingLog,
                        radiusUsedKm
                    }
                });
                return;
            }
        }

        // Phase 4: Final Assignment
        routingLog.push({ step: 'branch_assigned', branchId: targetBranch.id });

        const updateData: any = {
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

        // BullMQ logic to spawn an 8-min delayed job to check for branch acceptance goes here
    }
}
