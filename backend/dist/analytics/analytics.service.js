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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboard() {
        const [orders, customers, topProducts, leastProducts, categoryPerf, customerList,] = await Promise.all([
            this.prisma.order.findMany({
                include: {
                    orderItems: { include: { menuItem: true } },
                    user: true,
                    branch: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.findMany({
                where: { role: 'CUSTOMER' },
                select: { id: true, email: true, name: true, createdAt: true },
            }),
            this.prisma.orderItem.groupBy({
                by: ['menuItemId'],
                _sum: { quantity: true, totalPrice: true },
                _count: { id: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 10,
            }),
            this.prisma.orderItem.groupBy({
                by: ['menuItemId'],
                _sum: { quantity: true },
                _count: { id: true },
                orderBy: { _sum: { quantity: 'asc' } },
                take: 5,
            }),
            this.prisma.orderItem.groupBy({
                by: ['menuItemId'],
                _sum: { quantity: true, totalPrice: true },
            }),
            this.prisma.user.findMany({
                where: { role: 'CUSTOMER' },
                include: {
                    orders: {
                        select: { id: true, totalAmount: true, createdAt: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
        ]);
        const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
        const totalOrders = orders.length;
        const uniqueCustomerIds = new Set(orders.filter(o => o.userId).map(o => o.userId));
        const totalCustomers = uniqueCustomerIds.size || customers.length;
        const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const modeCount = { DELIVERY: 0, PICKUP: 0, DINE_IN: 0 };
        for (const o of orders) {
            modeCount[o.mode] = (modeCount[o.mode] || 0) + 1;
        }
        const modeSplit = [
            { label: 'Delivery', count: modeCount.DELIVERY, pct: totalOrders > 0 ? Math.round((modeCount.DELIVERY / totalOrders) * 100) : 0 },
            { label: 'Pickup', count: modeCount.PICKUP, pct: totalOrders > 0 ? Math.round((modeCount.PICKUP / totalOrders) * 100) : 0 },
            { label: 'Dine-In', count: modeCount.DINE_IN, pct: totalOrders > 0 ? Math.round((modeCount.DINE_IN / totalOrders) * 100) : 0 },
        ];
        const statusDotMap = {
            ROUTING: '#fbbf24', PENDING: '#fbbf24', CONFIRMED: '#60a5fa',
            PREPARING: '#fb923c', READY_FOR_PICKUP: '#4ade80', OUT_FOR_DELIVERY: '#4ade80',
            DELIVERED: '#6b7280', COMPLETED: '#6b7280', CANCELLED: '#f87171',
            ESCALATED: '#f87171', REASSIGNING: '#fbbf24', SCHEDULED: '#818cf8',
            LONG_DISTANCE: '#818cf8',
        };
        const statusLabelMap = {
            ROUTING: 'Pending', PENDING: 'Pending', CONFIRMED: 'Confirmed',
            PREPARING: 'Preparing', READY_FOR_PICKUP: 'Ready', OUT_FOR_DELIVERY: 'Ready',
            DELIVERED: 'Completed', COMPLETED: 'Completed', CANCELLED: 'Cancelled',
            ESCALATED: 'Escalated', REASSIGNING: 'Reassigning', SCHEDULED: 'Scheduled',
            LONG_DISTANCE: 'Long Distance',
        };
        const modeIconMap = { DELIVERY: '🛵', PICKUP: '🏠', DINE_IN: '🍽️' };
        const recentOrders = orders.slice(0, 5).map(o => ({
            id: '#' + o.id.split('-')[0].toUpperCase(),
            name: o.user?.name || 'Guest',
            branch: o.branch?.name || 'Unknown',
            mode: modeIconMap[o.mode] || '🛵',
            total: `AED ${(o.totalAmount || 0).toFixed(0)}`,
            status: statusLabelMap[o.status] || o.status,
            dot: statusDotMap[o.status] || '#6b7280',
        }));
        const menuItemIds = [...new Set([
                ...topProducts.map(p => p.menuItemId),
                ...leastProducts.map(p => p.menuItemId),
                ...categoryPerf.map(p => p.menuItemId),
            ])];
        const menuItems = await this.prisma.menuItem.findMany({
            where: { id: { in: menuItemIds } },
            include: { category: true },
        });
        const menuMap = new Map(menuItems.map(m => [m.id, m]));
        const maxTopOrders = topProducts.length > 0 ? (topProducts[0]._sum.quantity || 1) : 1;
        const topProductsData = topProducts.map(p => {
            const mi = menuMap.get(p.menuItemId);
            return {
                name: mi?.name || 'Unknown',
                orders: p._sum.quantity || 0,
                pct: Math.round(((p._sum.quantity || 0) / maxTopOrders) * 100),
                revenue: `AED ${((p._sum.totalPrice || 0)).toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
            };
        });
        const leastProductsData = leastProducts.map(p => {
            const mi = menuMap.get(p.menuItemId);
            return {
                name: mi?.name || 'Unknown',
                orders: p._sum.quantity || 0,
            };
        });
        const catAgg = {};
        for (const item of categoryPerf) {
            const mi = menuMap.get(item.menuItemId);
            const catName = mi?.category?.name || 'Uncategorized';
            if (!catAgg[catName])
                catAgg[catName] = { revenue: 0, orders: 0, name: catName };
            catAgg[catName].revenue += item._sum.totalPrice || 0;
            catAgg[catName].orders += item._sum.quantity || 0;
        }
        const categoryPerfData = Object.values(catAgg).sort((a, b) => b.revenue - a.revenue);
        const customerOrderCounts = {};
        const customerSpend = {};
        for (const o of orders) {
            if (o.userId) {
                customerOrderCounts[o.userId] = (customerOrderCounts[o.userId] || 0) + 1;
                customerSpend[o.userId] = (customerSpend[o.userId] || 0) + (o.totalAmount || 0);
            }
        }
        const newCustomers = Object.values(customerOrderCounts).filter(c => c === 1).length;
        const returningCustomers = Object.values(customerOrderCounts).filter(c => c > 1).length;
        const topLTV = Math.max(0, ...Object.values(customerSpend));
        const hourCounts = {};
        for (const o of orders) {
            const hour = new Date(o.createdAt).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        }
        let peakHour = '—';
        if (Object.keys(hourCounts).length > 0) {
            const maxH = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
            const h = parseInt(maxH[0]);
            const format = (hr) => {
                if (hr === 0)
                    return '12 AM';
                if (hr < 12)
                    return `${hr} AM`;
                if (hr === 12)
                    return '12 PM';
                return `${hr - 12} PM`;
            };
            peakHour = `${format(h)}–${format(h + 1 > 23 ? 0 : h + 1)}`;
        }
        const newPct = totalCustomers > 0 ? Math.round((newCustomers / totalCustomers) * 100) : 0;
        const retPct = totalCustomers > 0 ? 100 - newPct : 0;
        const customerListData = customerList.map(u => ({
            name: u.name,
            email: u.email,
            joined: new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            orders: u.orders.length,
            spend: `AED ${u.orders.reduce((s, o) => s + (o.totalAmount || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
            status: 'Active',
        }));
        const totalItemsSold = topProducts.reduce((s, p) => s + (p._sum.quantity || 0), 0);
        const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const heatmap = {};
        for (const day of DAYS) {
            heatmap[day] = new Array(24).fill(0);
        }
        for (const o of orders) {
            const d = new Date(o.createdAt);
            const dayName = DAYS[d.getDay()];
            const hour = d.getHours();
            heatmap[dayName][hour]++;
        }
        const maxVal = Math.max(1, ...Object.values(heatmap).flat());
        const peakHoursHeatmap = {};
        for (const day of DAYS) {
            peakHoursHeatmap[day] = heatmap[day].map(v => Math.round((v / maxVal) * 9));
        }
        return {
            kpis: {
                revenue: totalRevenue,
                orders: totalOrders,
                customers: totalCustomers,
                avgOrder: Math.round(avgOrder * 10) / 10,
            },
            modeSplit,
            recentOrders,
            topProducts: topProductsData,
            leastProducts: leastProductsData,
            categoryPerformance: categoryPerfData,
            customerStats: {
                newCustomers,
                returningCustomers,
                peakHour,
                topLTV: Math.round(topLTV),
                newPct,
                retPct,
            },
            customerList: customerListData,
            totalItemsSold,
            peakHoursHeatmap,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map