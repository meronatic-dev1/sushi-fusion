import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { CouponsService } from './coupons.service';

@Controller('coupons')
export class CouponsController {
    constructor(private readonly couponsService: CouponsService) { }

    @Get()
    findAll() {
        return this.couponsService.findAll();
    }
    
    @Get('validate')
    validate(@Query('code') code: string, @Query('subtotal') subtotal: string) {
        return this.couponsService.validateCode(code, Number(subtotal) || 0);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.couponsService.findOne(id);
    }

    @Post()
    create(@Body() body: any) {
        return this.couponsService.create(body);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.couponsService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.couponsService.remove(id);
    }
}
