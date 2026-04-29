import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Processor('stripe-webhooks')
export class StripeWebhookProcessor extends WorkerHost {
  private readonly logger = new Logger(StripeWebhookProcessor.name);

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const event = job.data as Stripe.Event;
    
    this.logger.log(`Processing Stripe event: ${event.type} (jobId: ${job.id})`);

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSession(event.data.object as Stripe.Checkout.Session);
        break;
      // Add other event handlers here
      default:
        this.logger.debug(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleCheckoutSession(session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      this.logger.warn('Checkout session completed without orderId in metadata');
      return;
    }

    // Idempotency check: only process if order is still PENDING or UNPAID
    const order = await this.prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      this.logger.error(`Order ${orderId} not found for checkout session ${session.id}`);
      return;
    }

    if (order.status !== 'PENDING' && order.status !== 'ROUTING') {
        this.logger.log(`Order ${orderId} already processed (status: ${order.status}), skipping.`);
        return;
    }

    this.logger.log(`Updating order ${orderId} status to PENDING/PAID logic here...`);
    
    // Update order as paid
    await this.prisma.order.update({
      where: { id: orderId },
      data: { 
        status: order.mode === 'DELIVERY' ? 'ROUTING' : 'PENDING',
        // In a real app we might have a 'paid' boolean or separate status flow
      }
    });

    this.logger.log(`Successfully processed payment for order ${orderId}`);
  }
}
