import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ResendService {
    private resend: Resend;
    private readonly logger = new Logger(ResendService.name);
    private readonly fromEmail: string;
    private readonly frontendUrl: string;

    constructor(
        private configService: ConfigService,
        @InjectQueue('emails') private readonly emailQueue: Queue
    ) {
        this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
        this.fromEmail = this.configService.get<string>('EMAIL_FROM') || 'orders@sushifusion.com';
        this.frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    }

    private async queueEmail(type: string, email: string, data: any) {
        await this.emailQueue.add(type, { type, email, data }, {
            attempts: 5,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
            removeOnComplete: true,
        });
    }

    /* ─────────────────────────────────────────────────────
     * 1. ORDER CONFIRMATION EMAIL
     * ───────────────────────────────────────────────────── */
    async sendOrderConfirmationEmail(email: string, order: any) {
        await this.queueEmail('order-confirmation', email, order);
    }

    async dispatchOrderConfirmationEmail(email: string, order: {
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

        await this.resend.emails.send({
            from: this.fromEmail,
            to: email,
            subject: `Order Confirmed! #${shortId} 🍣`,
            html: this.wrapTemplate(`
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
                </div>`),
        });
        this.logger.log(`Order confirmation email dispatched to ${email} for #${shortId}`);
    }

    /* ─────────────────────────────────────────────────────
     * 2. ORDER STATUS UPDATE EMAIL
     * ───────────────────────────────────────────────────── */
    async sendOrderStatusEmail(email: string, order: any) {
        await this.queueEmail('order-status', email, order);
    }

    async dispatchOrderStatusEmail(email: string, order: {
        id: string;
        customerName?: string;
        totalAmount: number;
        status: string;
    }) {
        const shortId = order.id.slice(0, 8).toUpperCase();
        const trackUrl = `${this.frontendUrl}/track/${order.id}`;

        const statusConfig: Record<string, { emoji: string; title: string; message: string; color: string }> = {
            CONFIRMED: { emoji: '✅', title: 'Order Confirmed', message: 'Your order has been confirmed and will be prepared shortly.', color: '#22c55e' },
            PREPARING: { emoji: '👨‍🍳', title: 'Being Prepared', message: 'Our chefs are now preparing your delicious order!', color: '#f59e0b' },
            READY: { emoji: '🎉', title: 'Order Ready', message: 'Your order is ready! It will be on its way soon.', color: '#3b82f6' },
            READY_FOR_PICKUP: { emoji: '🎉', title: 'Ready for Pickup', message: 'Your order is ready for pickup!', color: '#3b82f6' },
            OUT_FOR_DELIVERY: { emoji: '🚚', title: 'Out for Delivery', message: 'Your order is on its way to you!', color: '#8b5cf6' },
            DELIVERED: { emoji: '📦', title: 'Delivered', message: 'Your order has been delivered. Enjoy!', color: '#22c55e' },
            COMPLETED: { emoji: '🎊', title: 'Order Completed', message: 'Your order has been completed. We hope you enjoyed it!', color: '#22c55e' },
            CANCELLED: { emoji: '❌', title: 'Order Cancelled', message: 'Your order has been cancelled. If this was unexpected, please contact us.', color: '#ef4444' },
        };

        const config = statusConfig[order.status];
        if (!config) {
            this.logger.warn(`No email template for status: ${order.status}`);
            return;
        }

        await this.resend.emails.send({
            from: this.fromEmail,
            to: email,
            subject: `${config.emoji} Order #${shortId} — ${config.title}`,
            html: this.wrapTemplate(`
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
                </div>`),
        });
        this.logger.log(`Status email (${order.status}) dispatched to ${email} for #${shortId}`);
    }

    /* ─────────────────────────────────────────────────────
     * 3. REFUND NOTIFICATION EMAIL
     * ───────────────────────────────────────────────────── */
    async sendRefundNotificationEmail(email: string, data: any) {
        await this.queueEmail('refund-notification', email, data);
    }

    async dispatchRefundNotificationEmail(email: string, data: {
        orderId: string;
        customerName?: string;
        refundAmount: number;
        reason?: string;
    }) {
        const shortId = data.orderId.slice(0, 8).toUpperCase();
        await this.resend.emails.send({
            from: this.fromEmail,
            to: email,
            subject: `💸 Refund Processed — Order #${shortId}`,
            html: this.wrapTemplate(`
                <div style="background:linear-gradient(135deg,#22c55e,#16a34a);padding:32px 28px;text-align:center;">
                    <p style="font-size:48px;margin:0 0 8px;">💸</p>
                    <h1 style="color:#fff;font-size:22px;margin:0 0 6px;">Refund Processed</h1>
                    <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">Order #${shortId}</p>
                </div>
                <div style="padding:28px;">
                    <p style="font-size:15px;color:#3d2c1e;line-height:1.7;margin:0 0 20px;">
                        Hi${data.customerName ? ' ' + data.customerName : ''},<br/><br/>
                        We've processed a refund for your order. The details are below:
                    </p>
                    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin-bottom:24px;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                            <span style="font-size:13px;color:#6b7280;">Order</span>
                            <span style="font-size:13px;font-weight:700;color:#1a1108;">#${shortId}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                            <span style="font-size:13px;color:#6b7280;">Refund Amount</span>
                            <span style="font-size:15px;font-weight:800;color:#22c55e;">AED ${data.refundAmount.toFixed(2)}</span>
                        </div>
                        ${data.reason ? `
                        <div style="display:flex;justify-content:space-between;">
                            <span style="font-size:13px;color:#6b7280;">Reason</span>
                            <span style="font-size:13px;color:#1a1108;">${data.reason}</span>
                        </div>` : ''}
                    </div>
                    <p style="font-size:13px;color:#8a7060;line-height:1.6;margin:0;">
                        The refund will appear in your original payment method within 5–10 business days.
                    </p>
                </div>`),
        });
        this.logger.log(`Refund email dispatched to ${email} for #${shortId}`);
    }

    /* ─────────────────────────────────────────────────────
     * 4. PASSWORD RESET EMAIL
     * ───────────────────────────────────────────────────── */
    async sendPasswordResetEmail(email: string, data: any) {
        await this.queueEmail('password-reset', email, data);
    }

    async dispatchPasswordResetEmail(email: string, data: {
        name?: string;
        resetUrl: string;
    }) {
        await this.resend.emails.send({
            from: this.fromEmail,
            to: email,
            subject: `🔐 Reset Your Password — Sushi Fusion`,
            html: this.wrapTemplate(`
                <div style="background:linear-gradient(135deg,#6366f1,#4f46e5);padding:32px 28px;text-align:center;">
                    <p style="font-size:48px;margin:0 0 8px;">🔐</p>
                    <h1 style="color:#fff;font-size:22px;margin:0 0 6px;">Password Reset</h1>
                    <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">We received a reset request</p>
                </div>
                <div style="padding:28px;">
                    <p style="font-size:15px;color:#3d2c1e;line-height:1.7;margin:0 0 20px;">
                        Hi${data.name ? ' ' + data.name : ''},<br/><br/>
                        We received a request to reset your password. Click the button below to choose a new one.
                    </p>
                    <a href="${data.resetUrl}" style="display:block;text-align:center;background:#6366f1;color:#fff;padding:14px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;margin-bottom:20px;">Reset Password →</a>
                    <p style="font-size:12px;color:#a08060;line-height:1.6;margin:0;">
                        If you didn't request this, you can safely ignore this email. The link expires in 1 hour.
                    </p>
                </div>`),
        });
        this.logger.log(`Password reset email dispatched to ${email}`);
    }

    /* ─────────────────────────────────────────────────────
     * 5. WELCOME EMAIL (Guest Account Created)
     * ───────────────────────────────────────────────────── */
    async sendWelcomeEmail(email: string, name: string) {
        await this.queueEmail('welcome', email, { name });
    }

    async dispatchWelcomeEmail(email: string, data: { name: string }) {
        const loginUrl = `${this.frontendUrl}/login`;
        await this.resend.emails.send({
            from: this.fromEmail,
            to: email,
            subject: `Welcome to Sushi Fusion! 🎉`,
            html: this.wrapTemplate(`
                <div style="background:linear-gradient(135deg,#FF6A0C,#e55a00);padding:32px 28px;text-align:center;">
                    <h1 style="color:#fff;font-size:24px;margin:0 0 6px;">Welcome, ${data.name}!</h1>
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
                </div>`),
        });
        this.logger.log(`Welcome email dispatched to ${email}`);
    }

    /* ─────────────────────────────────────────────────────
     * 6. DAILY SUMMARY EMAIL
     * ───────────────────────────────────────────────────── */
    async sendDailyOrderSummaryEmail(email: string, data: any) {
        await this.queueEmail('daily-summary', email, data);
    }

    async dispatchDailyOrderSummaryEmail(email: string, data: {
        branchName: string;
        date: string;
        totalOrders: number;
        totalRevenue: number;
        completedOrders: number;
        cancelledOrders: number;
        topItems: { name: string; quantity: number }[];
    }) {
        const itemsHtml = data.topItems.map(i =>
            `<tr>
                <td style="padding:4px 0;font-size:14px;color:#3d2c1e;">${i.name}</td>
                <td style="padding:4px 0;font-size:14px;color:#FF6A0C;text-align:right;font-weight:700;">${i.quantity} units</td>
            </tr>`
        ).join('');

        await this.resend.emails.send({
            from: this.fromEmail,
            to: email,
            subject: `📊 Daily Summary — ${data.branchName} (${data.date})`,
            html: this.wrapTemplate(`
                <div style="background:linear-gradient(135deg,#1c1c1c,#333);padding:32px 28px;text-align:center;">
                    <h1 style="color:#fff;font-size:20px;margin:0 0 6px;">Daily Performance Report</h1>
                    <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:0;">${data.branchName} • ${data.date}</p>
                </div>
                <div style="padding:28px;">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
                        <div style="background:#f8f9fa;padding:12px;border-radius:8px;">
                            <p style="font-size:11px;color:#666;margin:0 0 4px;">REVENUE</p>
                            <p style="font-size:16px;font-weight:700;color:#22c55e;margin:0;">AED ${data.totalRevenue.toFixed(2)}</p>
                        </div>
                        <div style="background:#f8f9fa;padding:12px;border-radius:8px;">
                            <p style="font-size:11px;color:#666;margin:0 0 4px;">TOTAL ORDERS</p>
                            <p style="font-size:16px;font-weight:700;color:#1c1c1c;margin:0;">${data.totalOrders}</p>
                        </div>
                    </div>
                    
                    <p style="font-size:12px;color:#8a5c3a;font-weight:700;margin-bottom:12px;text-transform:uppercase;letter-spacing:1px;">Top 5 Sellers</p>
                    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
                        <tbody>${itemsHtml}</tbody>
                    </table>

                    <div style="border-top:1px solid #f0e8df;padding-top:18px;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                            <span style="font-size:13px;color:#666;">Completed Orders</span>
                            <span style="font-size:13px;font-weight:700;color:#22c55e;">${data.completedOrders}</span>
                        </div>
                        <div style="display:flex;justify-content:space-between;">
                            <span style="font-size:13px;color:#666;">Cancelled Orders</span>
                            <span style="font-size:13px;font-weight:700;color:#ef4444;">${data.cancelledOrders}</span>
                        </div>
                    </div>
                </div>`),
        });
        this.logger.log(`Daily summary report dispatched to ${email} for ${data.branchName}`);
    }

    /* ──── Shared HTML wrapper ─── */
    private wrapTemplate(innerHtml: string): string {
        return `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #ede6dc;">
            ${innerHtml}
            <div style="padding:16px 28px;background:#faf8f5;border-top:1px solid #ede6dc;text-align:center;">
                <p style="font-size:12px;color:#b09070;margin:0;">Sushi Fusion — Fresh, Bold, Delivered.</p>
            </div>
        </div>`;
    }
}
