import { Controller, Post, Get, Patch, Param, Body, HttpCode, HttpStatus, Query, Logger } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ProcessRefundDto } from './dto/process-refund.dto';

@Controller('orders')
export class OrdersController {
    private readonly logger = new Logger(OrdersController.name);
    constructor(private readonly ordersService: OrdersService) { }

    @Get()
    async getOrders(
        @Query('branchId') branchId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        return this.ordersService.findAll(branchId, startDate, endDate);
    }

    @Get(':id')
    async getOrderById(@Param('id') id: string) {
        return this.ordersService.findById(id);
    }

    @Patch(':id/status')
    async updateOrderStatus(
        @Param('id') id: string, 
        @Body() body: UpdateOrderStatusDto
    ) {
        return this.ordersService.updateStatus(id, body.status);
    }

    @Post(':id/refund')
    @HttpCode(HttpStatus.OK)
    async processRefund(
        @Param('id') id: string,
        @Body() body: ProcessRefundDto,
    ) {
        return this.ordersService.processRefund(id, body.amount, body.reason);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createOrder(@Body() body: CreateOrderDto) {
        this.logger.log(`Creating order in controller: ${JSON.stringify(body)}`);
        return this.ordersService.create(body);
    }
}
