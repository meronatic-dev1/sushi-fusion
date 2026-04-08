import { Controller, Post, Headers, Req, BadRequestException, Body, Logger } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request } from 'express';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('stripe')
export class StripeController {
    private readonly logger = new Logger(StripeController.name);

    constructor(
        private readonly stripeService: StripeService,
        @InjectQueue('stripe-webhooks') private readonly webhookQueue: Queue
    ) { }

    @Post('create-payment-intent')
    async createPaymentIntent(@Body() body: { amount: number }) {
        if (!body.amount || body.amount <= 0) {
            throw new BadRequestException('Invalid amount');
        }
        return this.stripeService.createPaymentIntent(body.amount);
    }

    @Post('webhook')
    async handleWebhook(
        @Headers('stripe-signature') signature: string,
        @Req() req: RawBodyRequest<Request>,
    ) {
        if (!signature) {
            throw new BadRequestException('Missing stripe-signature header');
        }

        try {
            const event = await this.stripeService.constructEventFromPayload(
                signature,
                req.rawBody as Buffer,
            );
            
            // Queue the event for background processing
            await this.webhookQueue.add(event.type, event, {
                attempts: 5,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
                removeOnComplete: true,
            });

            return { received: true };
        } catch (err) {
            this.logger.error(`Webhook Error: ${err.message}`);
            throw new BadRequestException(`Webhook Error: ${err.message}`);
        }
    }
}
