import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StripeService {
    private stripe: Stripe;
    private readonly logger = new Logger(StripeService.name);

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService
    ) {
        const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
        if (secretKey) {
            this.stripe = new Stripe(secretKey, {
                apiVersion: '2023-10-16' as any,
            });
        }
    }

    async createCheckoutSession(orderId: string, amount: number, mode: string) {
        if (!this.stripe) {
            this.logger.warn('Stripe secret key is not configured.');
            throw new Error('Stripe payment service is not configured');
        }
        return this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Order #${orderId}`,
                        },
                        unit_amount: Math.round(amount * 100), // Stripe expects cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:3000/checkout/success?orderId=${orderId}`,
            cancel_url: `http://localhost:3000/checkout/cancel`,
            metadata: { orderId, orderMode: mode },
        });
    }

    async constructEventFromPayload(signature: string, payload: Buffer) {
        const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || '';
        return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    }

    async handleWebhook(event: Stripe.Event) {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const orderId = session.metadata?.orderId;

            this.logger.log(`Payment successful for order ${orderId}`);
            // In a real flow, update DB that it's paid, then push to Routing logic
            // e.g. await this.routingQueue.add(...)
        }
    }
}
