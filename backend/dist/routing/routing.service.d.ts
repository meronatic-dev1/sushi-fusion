import { Queue } from 'bullmq';
export declare class RoutingService {
    private routingQueue;
    constructor(routingQueue: Queue);
    queueOrderForRouting(orderId: string, customerLat: number, customerLng: number, isReassign?: boolean): Promise<{
        status: string;
        orderId: string;
    }>;
}
