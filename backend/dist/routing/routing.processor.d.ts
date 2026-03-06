import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersGateway } from '../orders/orders.gateway';
import { RoutingService } from './routing.service';
export declare class RoutingProcessor extends WorkerHost {
    private prisma;
    private ordersGateway;
    private routingService;
    private readonly logger;
    constructor(prisma: PrismaService, ordersGateway: OrdersGateway, routingService: RoutingService);
    private calculateDistance;
    private deg2rad;
    process(job: Job<any, any, string>): Promise<any>;
    private handleBranchAssignment;
    private handleAcceptanceCheck;
}
