import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
export declare class StripeService {
    private configService;
    private prisma;
    private stripe;
    private readonly logger;
    constructor(configService: ConfigService, prisma: PrismaService);
    createCheckoutSession(orderId: string, amount: number, mode: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
    constructEventFromPayload(signature: string, payload: Buffer): Promise<Stripe.Event>;
    handleWebhook(event: Stripe.Event): Promise<void>;
}
