import { Controller, Post, Get, Patch, Param, Body, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ProcessRefundDto } from './dto/process-refund.dto';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Get()
    async getOrders(@Query('branchId') branchId?: string) {
        return this.ordersService.findAll(branchId);
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
        return this.ordersService.create(body);
    }
}
