import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { ResendService } from '../resend/resend.service';

@Injectable()
export class DailySummaryService {
    private readonly logger = new Logger(DailySummaryService.name);

    constructor(
        private prisma: PrismaService,
        private resendService: ResendService,
    ) {}

    /**
     * Runs every day at 11:59 PM (server time).
     * Sends a daily order summary email to every branch manager.
     */
    @Cron('59 23 * * *')
    async handleDailySummary() {
        this.logger.log('Running daily order summary job…');

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dateLabel = today.toLocaleDateString('en-AE', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        });

        // Get all branches
        const branches = await this.prisma.location.findMany({
            where: { isActive: true },
            include: { users: true },
        });

        for (const branch of branches) {
            // Orders for this branch today
            const orders = await this.prisma.order.findMany({
                where: {
                    branchId: branch.id,
                    createdAt: { gte: today, lt: tomorrow },
                },
                include: {
                    orderItems: { include: { menuItem: true } },
                },
            });

            const totalOrders = orders.length;
            const totalRevenue = orders.reduce((acc, o) => acc + Number(o.totalAmount), 0);
            const completedOrders = orders.filter(o => o.status === 'COMPLETED' || o.status === 'DELIVERED').length;
            const cancelledOrders = orders.filter(o => o.status === 'CANCELLED').length;

            // Top items
            const itemCounts: Record<string, number> = {};
            for (const order of orders) {
                for (const item of order.orderItems) {
                    const name = item.menuItem?.name || 'Unknown';
                    itemCounts[name] = (itemCounts[name] || 0) + item.quantity;
                }
            }
            const topItems = Object.entries(itemCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([name, quantity]) => ({ name, quantity }));

            // Find managers for this branch
            const managers = branch.users.filter(
                (u: any) => u.role === 'BRANCH_MANAGER' || u.role === 'ADMIN',
            );

            if (managers.length === 0) {
                this.logger.warn(`No managers found for branch ${branch.name}, skipping summary`);
                continue;
            }

            // Send to each manager
            for (const manager of managers) {
                await this.resendService.sendDailyOrderSummaryEmail(manager.email, {
                    branchName: branch.name,
                    date: dateLabel,
                    totalOrders,
                    totalRevenue,
                    completedOrders,
                    cancelledOrders,
                    topItems,
                }).catch(err =>
                    this.logger.error(`Failed to send summary to ${manager.email}`, err),
                );
            }
        }

        this.logger.log('Daily order summary job complete.');
    }
}
