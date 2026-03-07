import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(): Promise<{
        kpis: {
            revenue: any;
            orders: any;
            customers: any;
            avgOrder: number;
        };
        modeSplit: {
            label: string;
            count: number;
            pct: number;
        }[];
        recentOrders: any;
        topProducts: any;
        leastProducts: any;
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
        customerList: any;
        totalItemsSold: any;
        peakHoursHeatmap: Record<string, number[]>;
    }>;
}
