import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class ResendService {
    private resend: Resend;
    private readonly logger = new Logger(ResendService.name);
    private readonly fromEmail: string;
    private readonly frontendUrl: string;

    constructor(private configService: ConfigService) {
        this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
        this.fromEmail = this.configService.get<string>('EMAIL_FROM') || 'orders@sushifusion.com';
        this.frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    }

    /* ─── Order Confirmation Email ─── */
    async sendOrderConfirmationEmail(email: string, order: {
        id: string;
        customerName?: string;
        totalAmount: number;
        mode: string;
        items?: { menuItem?: { name: string }; quantity: number; unitPrice: number }[];
    }) {
        const shortId = order.id.slice(0, 8).toUpperCase();
        const trackUrl = `${this.frontendUrl}/track/${order.id}`;
        const eta = order.mode === 'DELIVERY' ? '30–45 minutes' : '15–20 minutes';

        const itemsHtml = (order.items || []).map(i =>
            `<tr>
                <td style="padding:8px 12px;border-bottom:1px solid #f0e8df;font-size:14px;color:#3d2c1e;">${i.menuItem?.name || 'Item'}</td>
                <td style="padding:8px 12px;border-bottom:1px solid #f0e8df;font-size:14px;color:#8a7060;text-align:center;">×${i.quantity}</td>
                <td style="padding:8px 12px;border-bottom:1px solid #f0e8df;font-size:14px;color:#3d2c1e;text-align:right;">AED ${(i.unitPrice * i.quantity).toFixed(2)}</td>
            </tr>`
        ).join('');

        try {
            await this.resend.emails.send({
                from: this.fromEmail,
                to: email,
                subject: `Order Confirmed! #${shortId} 🍣`,
                html: `
                <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #ede6dc;">
                    <div style="background:linear-gradient(135deg,#FF6A0C,#e55a00);padding:32px 28px;text-align:center;">
                        <h1 style="color:#fff;font-size:24px;margin:0 0 6px;">Order Confirmed!</h1>
                        <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">Thank you${order.customerName ? ', ' + order.customerName : ''}!</p>
                    </div>
                    <div style="padding:28px;">
                        <div style="background:#fff8f3;border:1px solid #ffdcc4;border-radius:12px;padding:16px;margin-bottom:24px;text-align:center;">
                            <p style="font-size:12px;color:#a08060;margin:0 0 4px;">ORDER NUMBER</p>
                            <p style="font-size:22px;font-weight:800;color:#FF6A0C;margin:0;letter-spacing:0.05em;">#${shortId}</p>
                        </div>
                        <div style="display:flex;justify-content:space-between;margin-bottom:24px;">
                            <div style="text-align:center;flex:1;">
                                <p style="font-size:11px;color:#a08060;margin:0 0 4px;">ETA</p>
                                <p style="font-size:15px;font-weight:700;color:#3d2c1e;margin:0;">${eta}</p>
                            </div>
                            <div style="text-align:center;flex:1;">
                                <p style="font-size:11px;color:#a08060;margin:0 0 4px;">MODE</p>
                                <p style="font-size:15px;font-weight:700;color:#3d2c1e;margin:0;">${order.mode === 'DELIVERY' ? '🚚 Delivery' : '🍽️ Dine-In'}</p>
                            </div>
                            <div style="text-align:center;flex:1;">
                                <p style="font-size:11px;color:#a08060;margin:0 0 4px;">TOTAL</p>
                                <p style="font-size:15px;font-weight:700;color:#FF6A0C;margin:0;">AED ${order.totalAmount.toFixed(2)}</p>
                            </div>
                        </div>
                        ${itemsHtml ? `
                        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
                            <thead><tr>
                                <th style="padding:8px 12px;text-align:left;font-size:11px;color:#a08060;border-bottom:2px solid #ede6dc;">ITEM</th>
                                <th style="padding:8px 12px;text-align:center;font-size:11px;color:#a08060;border-bottom:2px solid #ede6dc;">QTY</th>
                                <th style="padding:8px 12px;text-align:right;font-size:11px;color:#a08060;border-bottom:2px solid #ede6dc;">PRICE</th>
                            </tr></thead>
                            <tbody>${itemsHtml}</tbody>
                        </table>` : ''}
                        <a href="${trackUrl}" style="display:block;text-align:center;background:#FF6A0C;color:#fff;padding:14px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">Track Your Order →</a>
                    </div>
                    <div style="padding:16px 28px;background:#faf8f5;border-top:1px solid #ede6dc;text-align:center;">
                        <p style="font-size:12px;color:#b09070;margin:0;">Sushi Fusion — Fresh, Bold, Delivered.</p>
                    </div>
                </div>`,
            });
            this.logger.log(`Order confirmation email sent to ${email} for #${shortId}`);
        } catch (error) {
            this.logger.error(`Failed to send confirmation email to ${email}`, error.stack);
        }
    }

    /* ─── Welcome Email (Guest Account Created) ─── */
    async sendWelcomeEmail(email: string, name: string) {
        const loginUrl = `${this.frontendUrl}/login`;
        try {
            await this.resend.emails.send({
                from: this.fromEmail,
                to: email,
                subject: `Welcome to Sushi Fusion! 🎉`,
                html: `
                <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #ede6dc;">
                    <div style="background:linear-gradient(135deg,#FF6A0C,#e55a00);padding:32px 28px;text-align:center;">
                        <h1 style="color:#fff;font-size:24px;margin:0 0 6px;">Welcome, ${name}!</h1>
                        <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">Your account has been created</p>
                    </div>
                    <div style="padding:28px;">
                        <p style="font-size:15px;color:#3d2c1e;line-height:1.7;margin:0 0 20px;">
                            We've created an account for you so you can track your orders and reorder your favourites with ease.
                        </p>
                        <div style="background:#fff8f3;border:1px solid #ffdcc4;border-radius:12px;padding:16px;margin-bottom:24px;">
                            <p style="font-size:13px;color:#8a5c3a;margin:0 0 8px;font-weight:700;">🔑 Set up your password</p>
                            <p style="font-size:13px;color:#8a7060;margin:0;line-height:1.6;">
                                Visit the login page and use "Forgot Password" with your email <strong>${email}</strong> to set your password.
                            </p>
                        </div>
                        <a href="${loginUrl}" style="display:block;text-align:center;background:#FF6A0C;color:#fff;padding:14px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">Go to Login →</a>
                    </div>
                    <div style="padding:16px 28px;background:#faf8f5;border-top:1px solid #ede6dc;text-align:center;">
                        <p style="font-size:12px;color:#b09070;margin:0;">Sushi Fusion — Fresh, Bold, Delivered.</p>
                    </div>
                </div>`,
            });
            this.logger.log(`Welcome email sent to ${email}`);
        } catch (error) {
            this.logger.error(`Failed to send welcome email to ${email}`, error.stack);
        }
    }

    /* ─── Order Status Update Email ─── */
    async sendOrderStatusEmail(email: string, order: {
        id: string;
        customerName?: string;
        totalAmount: number;
        status: string;
    }) {
        const shortId = order.id.slice(0, 8).toUpperCase();
        const trackUrl = `${this.frontendUrl}/track/${order.id}`;

        const statusConfig: Record<string, { emoji: string; title: string; message: string; color: string }> = {
            CONFIRMED: {
                emoji: '✅',
                title: 'Order Confirmed',
                message: 'Your order has been confirmed and will be prepared shortly.',
                color: '#22c55e',
            },
            PREPARING: {
                emoji: '👨‍🍳',
                title: 'Being Prepared',
                message: 'Our chefs are now preparing your delicious order!',
                color: '#f59e0b',
            },
            READY: {
                emoji: '🎉',
                title: 'Order Ready',
                message: 'Your order is ready! It will be on its way soon.',
                color: '#3b82f6',
            },
            COMPLETED: {
                emoji: '🎊',
                title: 'Order Completed',
                message: 'Your order has been completed. We hope you enjoyed it!',
                color: '#22c55e',
            },
            CANCELLED: {
                emoji: '❌',
                title: 'Order Cancelled',
                message: 'Your order has been cancelled. If this was unexpected, please contact us.',
                color: '#ef4444',
            },
        };

        const config = statusConfig[order.status];
        if (!config) {
            this.logger.warn(`No email template for status: ${order.status}`);
            return;
        }

        try {
            await this.resend.emails.send({
                from: this.fromEmail,
                to: email,
                subject: `${config.emoji} Order #${shortId} — ${config.title}`,
                html: `
                <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #ede6dc;">
                    <div style="background:${config.color};padding:32px 28px;text-align:center;">
                        <p style="font-size:48px;margin:0 0 8px;">${config.emoji}</p>
                        <h1 style="color:#fff;font-size:22px;margin:0 0 6px;">${config.title}</h1>
                        <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">Order #${shortId}</p>
                    </div>
                    <div style="padding:28px;">
                        <p style="font-size:15px;color:#3d2c1e;line-height:1.7;margin:0 0 24px;">
                            Hi${order.customerName ? ' ' + order.customerName : ''},<br/><br/>
                            ${config.message}
                        </p>
                        <a href="${trackUrl}" style="display:block;text-align:center;background:#FF6A0C;color:#fff;padding:14px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">Track Your Order →</a>
                    </div>
                    <div style="padding:16px 28px;background:#faf8f5;border-top:1px solid #ede6dc;text-align:center;">
                        <p style="font-size:12px;color:#b09070;margin:0;">Sushi Fusion — Fresh, Bold, Delivered.</p>
                    </div>
                </div>`,
            });
            this.logger.log(`Status email (${order.status}) sent to ${email} for #${shortId}`);
        } catch (error) {
            this.logger.error(`Failed to send status email to ${email}`, error.stack);
        }
    }
}
