import { RoutingService } from '../routing/routing.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class OrdersController {
    private routingService;
    private prisma;
    constructor(routingService: RoutingService, prisma: PrismaService);
    getOrders(branchId?: string): Promise<any>;
    updateOrderStatus(id: string, status: string): Promise<any>;
    createOrder(body: any): Promise<{
        message: string;
        orderId: any;
        status: string;
    }>;
}
