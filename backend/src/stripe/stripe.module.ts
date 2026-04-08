import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { BullModule } from '@nestjs/bullmq';
import { StripeWebhookProcessor } from './stripe-webhook.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'stripe-webhooks',
    }),
  ],
  providers: [StripeService, StripeWebhookProcessor],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule { }
