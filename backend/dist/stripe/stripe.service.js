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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var StripeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = __importDefault(require("stripe"));
const prisma_service_1 = require("../prisma/prisma.service");
let StripeService = StripeService_1 = class StripeService {
    configService;
    prisma;
    stripe;
    logger = new common_1.Logger(StripeService_1.name);
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.stripe = new stripe_1.default(this.configService.get('STRIPE_SECRET_KEY') || '', {
            apiVersion: '2023-10-16',
        });
    }
    async createCheckoutSession(orderId, amount, mode) {
        return this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Order #${orderId}`,
                        },
                        unit_amount: Math.round(amount * 100),
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
    async constructEventFromPayload(signature, payload) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET') || '';
        return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    }
    async handleWebhook(event) {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const orderId = session.metadata?.orderId;
            this.logger.log(`Payment successful for order ${orderId}`);
        }
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = StripeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map