import { Controller, Post, Headers, Req, BadRequestException } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request } from 'express';

@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService) { }

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
            await this.stripeService.handleWebhook(event);
            return { received: true };
        } catch (err) {
            throw new BadRequestException(`Webhook Error: ${err.message}`);
        }
    }
}
