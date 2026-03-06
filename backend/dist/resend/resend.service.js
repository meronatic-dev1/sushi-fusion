"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ResendService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let ResendService = ResendService_1 = class ResendService {
    configService;
    resend;
    logger = new common_1.Logger(ResendService_1.name);
    constructor(configService) {
        this.configService = configService;
        this.resend = new resend_1.Resend(this.configService.get('RESEND_API_KEY'));
    }
    async sendOrderConfirmationEmail(email, orderId, amount) {
        try {
            await this.resend.emails.send({
                from: this.configService.get('EMAIL_FROM') || 'orders@sushifusion.com',
                to: email,
                subject: `Order Confirmation #${orderId}`,
                html: `<p>Thank you for your order! Your total is $${amount.toFixed(2)}</p>`,
            });
            this.logger.log(`Order confirmation email sent to ${email}`);
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${email}`, error.stack);
        }
    }
};
exports.ResendService = ResendService;
exports.ResendService = ResendService = ResendService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ResendService);
//# sourceMappingURL=resend.service.js.map