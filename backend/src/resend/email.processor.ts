import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { ResendService } from './resend.service';

@Processor('emails')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(private readonly resendService: ResendService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { type, email, data } = job.data;
    this.logger.log(`Processing email job: ${type} to ${email}`);

    try {
      switch (type) {
        case 'order-confirmation':
          await this.resendService.dispatchOrderConfirmationEmail(email, data);
          break;
        case 'order-status':
          await this.resendService.dispatchOrderStatusEmail(email, data);
          break;
        case 'refund-notification':
          await this.resendService.dispatchRefundNotificationEmail(email, data);
          break;
        case 'password-reset':
          await this.resendService.dispatchPasswordResetEmail(email, data);
          break;
        case 'welcome':
          await this.resendService.dispatchWelcomeEmail(email, data);
          break;
        default:
          this.logger.warn(`Unknown email type: ${type}`);
      }
    } catch (error) {
      this.logger.error(`Failed to process email job ${job.id}: ${error.message}`);
      throw error; // Rethrow to trigger BullMQ retry
    }
  }
}
