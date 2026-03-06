import { ConfigService } from '@nestjs/config';
export declare class ResendService {
    private configService;
    private resend;
    private readonly logger;
    constructor(configService: ConfigService);
    sendOrderConfirmationEmail(email: string, orderId: string, amount: number): Promise<void>;
}
