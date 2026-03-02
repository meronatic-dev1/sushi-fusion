"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const routing_service_1 = require("./routing.service");
const routing_processor_1 = require("./routing.processor");
const orders_gateway_1 = require("../orders/orders.gateway");
let RoutingModule = class RoutingModule {
};
exports.RoutingModule = RoutingModule;
exports.RoutingModule = RoutingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({
                name: 'order-routing',
            }),
        ],
        providers: [routing_service_1.RoutingService, routing_processor_1.RoutingProcessor, orders_gateway_1.OrdersGateway],
        exports: [routing_service_1.RoutingService, bullmq_1.BullModule],
    })
], RoutingModule);
//# sourceMappingURL=routing.module.js.map