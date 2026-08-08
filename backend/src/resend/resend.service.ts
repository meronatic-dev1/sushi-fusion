import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class ResendService {
    private resend: Resend;
    private readonly logger = new Logger(ResendService.name);

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('RESEND_API_KEY');
        if (apiKey) {
            this.resend = new Resend(apiKey);
        }
    }

    async sendOrderConfirmationEmail(email: string, orderId: string, amount: number) {
        if (!this.resend) {
            this.logger.warn('Resend API key is not configured. Skipping email send.');
            return;
        }
        try {
            await this.resend.emails.send({
                from: this.configService.get<string>('EMAIL_FROM') || 'orders@sushifusion.com',
                to: email,
                subject: `Order Confirmation #${orderId}`,
                html: `<p>Thank you for your order! Your total is $${amount.toFixed(2)}</p>`, // Replace with React Email later
            });
            this.logger.log(`Order confirmation email sent to ${email}`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${email}`, error.stack);
        }
    }
}
