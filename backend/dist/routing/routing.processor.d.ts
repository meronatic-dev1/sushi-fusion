import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersGateway } from '../orders/orders.gateway';
export declare class RoutingProcessor extends WorkerHost {
    private prisma;
    private ordersGateway;
    private readonly logger;
    constructor(prisma: PrismaService, ordersGateway: OrdersGateway);
    private calculateDistance;
    private deg2rad;
    process(job: Job<any, any, string>): Promise<any>;
}
