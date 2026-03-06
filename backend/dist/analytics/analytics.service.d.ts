import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(): Promise<{
        kpis: {
            revenue: number;
            orders: number;
            customers: number;
            avgOrder: number;
        };
        modeSplit: {
            label: string;
            count: number;
            pct: number;
        }[];
        recentOrders: {
            id: string;
            name: string;
            branch: string;
            mode: string;
            total: string;
            status: string;
            dot: string;
        }[];
        topProducts: {
            name: string;
            orders: number;
            pct: number;
            revenue: string;
        }[];
        leastProducts: {
            name: string;
            orders: number;
        }[];
        categoryPerformance: {
            revenue: number;
            orders: number;
            name: string;
        }[];
        customerStats: {
            newCustomers: number;
            returningCustomers: number;
            peakHour: string;
            topLTV: number;
            newPct: number;
            retPct: number;
        };
        customerList: {
            name: string;
            email: string;
            joined: string;
            orders: number;
            spend: string;
            status: "Active";
        }[];
        totalItemsSold: number;
        peakHoursHeatmap: Record<string, number[]>;
    }>;
}
