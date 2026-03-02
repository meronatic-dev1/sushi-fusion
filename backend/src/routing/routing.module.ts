import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { RoutingService } from './routing.service';
import { RoutingProcessor } from './routing.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { OrdersGateway } from '../orders/orders.gateway';
import { OrdersModule } from '../orders/orders.module'; // Added dependency if needed, handled via careful exports

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'order-routing',
    }),
  ],
  providers: [RoutingService, RoutingProcessor, OrdersGateway],
  exports: [RoutingService, BullModule],
})
export class RoutingModule { }
