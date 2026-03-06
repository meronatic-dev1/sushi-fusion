import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { RoutingService } from './routing.service';
import { RoutingProcessor } from './routing.processor';
import { OrdersGateway } from '../orders/orders.gateway';

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
