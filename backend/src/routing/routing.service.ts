import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class RoutingService {
    constructor(@InjectQueue('order-routing') private routingQueue: Queue) { }

    async queueOrderForRouting(orderId: string, customerLat: number, customerLng: number, isReassign = false) {
        // Add job to BullMQ
        await this.routingQueue.add('assign-branch', {
            orderId,
            customerLat,
            customerLng,
            isReassign
        }, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000,
            }
        });

        return { status: 'ROUTING', orderId };
    }
}
