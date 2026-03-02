import { RoutingService } from '../routing/routing.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class OrdersController {
    private routingService;
    private prisma;
    constructor(routingService: RoutingService, prisma: PrismaService);
    createOrder(body: any): Promise<{
        message: string;
        orderId: string;
        status: string;
    }>;
}
