import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
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
