import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class ResendService {
    private resend: Resend;
    private readonly logger = new Logger(ResendService.name);

    constructor(private configService: ConfigService) {
        this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
    }

    async sendOrderConfirmationEmail(email: string, orderId: string, amount: number) {
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
