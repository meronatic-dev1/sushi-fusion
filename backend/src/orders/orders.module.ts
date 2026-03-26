import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersGateway } from './orders.gateway';
import { RoutingModule } from '../routing/routing.module';
import { ResendModule } from '../resend/resend.module';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [RoutingModule, ResendModule, SessionsModule],
  providers: [OrdersService, OrdersGateway],
  controllers: [OrdersController],
  exports: [OrdersService, OrdersGateway],
})
export class OrdersModule { }
