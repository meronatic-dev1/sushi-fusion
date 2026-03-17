import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getDashboard(branchId?: string) {
        // Run all queries in parallel for performance
        // Fetch orders and ALL menu items to build the dashboard entirely in-memory.
        // This makes filtering by branch trivial and fully accurate.
        const [orders, menuItems] = await Promise.all([
            this.prisma.order.findMany({
                where: branchId ? { branchId } : undefined,
                include: {
                    orderItems: { include: { menuItem: { include: { category: true } } } },
                    user: true,
                    branch: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.menuItem.findMany({
                include: { category: true },
            }),
        ]);

        const menuMap = new Map(menuItems.map(m => [m.id, m]));

        // Aggregate product data
        const itemAgg: Record<string, { quantity: number; totalPrice: number; menuItemId: string }> = {};
        for (const o of orders) {
            for (const i of o.orderItems) {
                if (!itemAgg[i.menuItemId]) itemAgg[i.menuItemId] = { quantity: 0, totalPrice: 0, menuItemId: i.menuItemId };
                itemAgg[i.menuItemId].quantity += i.quantity;
                itemAgg[i.menuItemId].totalPrice += (i.unitPrice * i.quantity);
            }
        }
        
        const allAgg = Object.values(itemAgg);
        const topProducts = [...allAgg].sort((a, b) => b.quantity - a.quantity).slice(0, 10).map(x => ({ _sum: { quantity: x.quantity, totalPrice: x.totalPrice }, menuItemId: x.menuItemId }));
        const leastProducts = [...allAgg].sort((a, b) => a.quantity - b.quantity).slice(0, 5).map(x => ({ _sum: { quantity: x.quantity }, menuItemId: x.menuItemId }));
        const categoryPerf = allAgg.map(x => ({ _sum: { quantity: x.quantity, totalPrice: x.totalPrice }, menuItemId: x.menuItemId }));

        // Customers list
        const customerMap: Record<string, any> = {};
        for (const o of orders) {
            // Priority 1: Registered Users (linked to an account)
            if (o.userId && o.user) {
                if (!customerMap[o.userId]) {
                    customerMap[o.userId] = { 
                        id: o.userId, 
                        name: o.user.name || o.customerName || 'Sync User', 
                        email: o.user.email || o.customerEmail || '—', 
                        phone: o.user.phone || o.customerPhone || '—', 
                        createdAt: o.user.createdAt, 
                        orders: [] 
                    };
                }
                // Fallback if user profile is missing info
                if ((customerMap[o.userId].name === 'Sync User' || !customerMap[o.userId].name) && o.customerName) {
                    customerMap[o.userId].name = o.customerName;
                }
                if ((customerMap[o.userId].email === '—' || !customerMap[o.userId].email) && o.customerEmail) {
                    customerMap[o.userId].email = o.customerEmail;
                }
                if ((customerMap[o.userId].phone === '—' || !customerMap[o.userId].phone) && o.customerPhone) {
                    customerMap[o.userId].phone = o.customerPhone;
                }
                customerMap[o.userId].orders.push({ id: o.id, totalAmount: o.totalAmount, createdAt: o.createdAt });
            } 
            // Priority 2: Guest Users (identified by email)
            else if (o.customerEmail) {
                const guestId = `guest-${o.customerEmail}`;
                if (!customerMap[guestId]) {
                    customerMap[guestId] = {
                        id: guestId,
                        name: o.customerName || 'Guest User',
                        email: o.customerEmail,
                        phone: o.customerPhone || '—',
                        createdAt: o.createdAt,
                        orders: []
                    };
                }
                customerMap[guestId].orders.push({ id: o.id, totalAmount: o.totalAmount, createdAt: o.createdAt });
            }
        }
        const customerList = Object.values(customerMap);
        const customers = customerList;

        // ── KPIs ──
        const totalRevenue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
        const totalOrders = orders.length;
        const uniqueCustomerIds = new Set(orders.filter(o => o.userId).map(o => o.userId));
        const totalCustomers = uniqueCustomerIds.size || customers.length;
        const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // ── Mode split ──
        const modeCount: Record<string, number> = { DELIVERY: 0, PICKUP: 0, DINE_IN: 0 };
        for (const o of orders) {
            modeCount[o.mode] = (modeCount[o.mode] || 0) + 1;
        }
        const modeSplit = [
            { label: 'Delivery', count: modeCount.DELIVERY, pct: totalOrders > 0 ? Math.round((modeCount.DELIVERY / totalOrders) * 100) : 0 },
            { label: 'Pickup', count: modeCount.PICKUP, pct: totalOrders > 0 ? Math.round((modeCount.PICKUP / totalOrders) * 100) : 0 },
            { label: 'Dine-In', count: modeCount.DINE_IN, pct: totalOrders > 0 ? Math.round((modeCount.DINE_IN / totalOrders) * 100) : 0 },
        ];

        // ── Recent orders (latest 5) ──
        const statusDotMap: Record<string, string> = {
            ROUTING: '#fbbf24', PENDING: '#fbbf24', CONFIRMED: '#60a5fa',
            PREPARING: '#fb923c', READY_FOR_PICKUP: '#4ade80', OUT_FOR_DELIVERY: '#4ade80',
            DELIVERED: '#6b7280', COMPLETED: '#6b7280', CANCELLED: '#f87171',
            ESCALATED: '#f87171', REASSIGNING: '#fbbf24', SCHEDULED: '#818cf8',
            LONG_DISTANCE: '#818cf8',
        };
        const statusLabelMap: Record<string, string> = {
            ROUTING: 'Pending', PENDING: 'Pending', CONFIRMED: 'Confirmed',
            PREPARING: 'Preparing', READY_FOR_PICKUP: 'Ready', OUT_FOR_DELIVERY: 'Ready',
            DELIVERED: 'Completed', COMPLETED: 'Completed', CANCELLED: 'Cancelled',
            ESCALATED: 'Escalated', REASSIGNING: 'Reassigning', SCHEDULED: 'Scheduled',
            LONG_DISTANCE: 'Long Distance',
        };
        const modeIconMap: Record<string, string> = { DELIVERY: '🛵', PICKUP: '🏠', DINE_IN: '🍽️' };

        const recentOrders = orders.slice(0, 5).map(o => ({
            id: '#' + o.id.split('-')[0].toUpperCase(),
            name: o.user?.name || 'Guest',
            branch: o.branch?.name || 'Unknown',
            mode: modeIconMap[o.mode] || '🛵',
            total: `AED ${(o.totalAmount || 0).toFixed(0)}`,
            status: statusLabelMap[o.status] || o.status,
            dot: statusDotMap[o.status] || '#6b7280',
        }));

        // ── Top products — resolve names ──
        const menuItemIds = [...new Set([
            ...topProducts.map(p => p.menuItemId),
            ...leastProducts.map(p => p.menuItemId),
            ...categoryPerf.map(p => p.menuItemId),
        ])];
        const menuItemsLookup = await this.prisma.menuItem.findMany({
            where: { id: { in: menuItemIds } },
            include: { category: true },
        });
        const menuMapLookup = new Map(menuItemsLookup.map(m => [m.id, m]));

        const maxTopOrders = topProducts.length > 0 ? (topProducts[0]._sum.quantity || 1) : 1;
        const topProductsData = topProducts.map(p => {
            const mi = menuMapLookup.get(p.menuItemId);
            return {
                name: mi?.name || 'Unknown',
                orders: p._sum.quantity || 0,
                pct: Math.round(((p._sum.quantity || 0) / maxTopOrders) * 100),
                revenue: `AED ${((p._sum.totalPrice || 0)).toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
            };
        });

        const leastProductsData = leastProducts.map(p => {
            const mi = menuMapLookup.get(p.menuItemId);
            return {
                name: mi?.name || 'Unknown',
                orders: p._sum.quantity || 0,
            };
        });

        // ── Category performance ──
        const catAgg: Record<string, { revenue: number; orders: number; name: string }> = {};
        for (const item of categoryPerf) {
            const mi = menuMapLookup.get(item.menuItemId);
            const catName = mi?.category?.name || 'Uncategorized';
            if (!catAgg[catName]) catAgg[catName] = { revenue: 0, orders: 0, name: catName };
            catAgg[catName].revenue += item._sum.totalPrice || 0;
            catAgg[catName].orders += item._sum.quantity || 0;
        }
        const categoryPerfData = Object.values(catAgg).sort((a, b) => b.revenue - a.revenue);

        // ── Customer stats ──
        const customerOrderCounts: Record<string, number> = {};
        const customerSpend: Record<string, number> = {};
        for (const o of orders) {
            if (o.userId) {
                customerOrderCounts[o.userId] = (customerOrderCounts[o.userId] || 0) + 1;
                customerSpend[o.userId] = (customerSpend[o.userId] || 0) + (o.totalAmount || 0);
            }
        }
        const newCustomers = Object.values(customerOrderCounts).filter(c => c === 1).length;
        const returningCustomers = Object.values(customerOrderCounts).filter(c => c > 1).length;
        const topLTV = Math.max(0, ...Object.values(customerSpend));

        // Peak hour
        const hourCounts: Record<number, number> = {};
        for (const o of orders) {
            const hour = new Date(o.createdAt).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        }
        let peakHour = '—';
        if (Object.keys(hourCounts).length > 0) {
            const maxH = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
            const h = parseInt(maxH[0]);
            const format = (hr: number) => {
                if (hr === 0) return '12 AM';
                if (hr < 12) return `${hr} AM`;
                if (hr === 12) return '12 PM';
                return `${hr - 12} PM`;
            };
            peakHour = `${format(h)}–${format(h + 1 > 23 ? 0 : h + 1)}`;
        }

        const newPct = totalCustomers > 0 ? Math.round((newCustomers / totalCustomers) * 100) : 0;
        const retPct = totalCustomers > 0 ? 100 - newPct : 0;

        // ── Customer list ──
        const customerListData = customerList.map(u => ({
            name: u.name,
            email: u.email,
            phone: u.phone || '—',
            joined: new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            orders: u.orders.length,
            spend: `AED ${u.orders.reduce((s: number, o: any) => s + (o.totalAmount || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}`,
            status: 'Active' as const,
        }));

        // ── Total items sold ──
        const totalItemsSold = topProducts.reduce((s, p) => s + (p._sum.quantity || 0), 0);

        // ── Peak hours heatmap (7 days × 24 hours) ──
        const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const heatmap: Record<string, number[]> = {};
        for (const day of DAYS) {
            heatmap[day] = new Array(24).fill(0);
        }
        for (const o of orders) {
            const d = new Date(o.createdAt);
            const dayName = DAYS[d.getDay()];
            const hour = d.getHours();
            heatmap[dayName][hour]++;
        }
        // Normalize to 0-9 scale
        const maxVal = Math.max(1, ...Object.values(heatmap).flat());
        const peakHoursHeatmap: Record<string, number[]> = {};
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
}
