import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RoutingService } from '../routing/routing.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('orders')
export class OrdersController {
    constructor(
        private routingService: RoutingService,
        private prisma: PrismaService
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createOrder(@Body() body: any) {
        // Basic stub. We would calculate total amounts, save items, etc.
        const order = await this.prisma.order.create({
            data: {
                userId: body.userId || null,
                mode: body.mode || 'DELIVERY',
                totalAmount: body.totalAmount || 0,
                branchId: 'temp', // This will be set by the queue
                branchIdOriginal: 'temp',
                radiusUsedKm: 0,
                customerLat: body.customerLat || 0,
                customerLng: body.customerLng || 0,
            }
        });

        if (order.mode === 'DELIVERY') {
            // Hands off the heavy lifting to BullMQ
            await this.routingService.queueOrderForRouting(
                order.id,
                order.customerLat,
                order.customerLng
            );
        }

        return {
            message: 'Order placed successfully',
            orderId: order.id,
            status: order.mode === 'DELIVERY' ? 'ROUTING' : 'PENDING'
        };
    }
}
