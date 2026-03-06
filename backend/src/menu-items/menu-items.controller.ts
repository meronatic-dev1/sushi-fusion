import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';

@Controller('menu-items')
export class MenuItemsController {
    constructor(private readonly menuItemsService: MenuItemsService) { }

    @Get()
    findAll(@Query('categoryId') categoryId?: string) {
        return this.menuItemsService.findAll(categoryId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.menuItemsService.findOne(id);
    }

    @Post()
    create(
        @Body()
        body: {
            name: string;
            description?: string;
            price: number;
            imageUrl?: string;
            isAvailable?: boolean;
            categoryId: string;
        },
    ) {
        return this.menuItemsService.create(body);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body()
        body: {
            name?: string;
            description?: string;
            price?: number;
            imageUrl?: string;
            isAvailable?: boolean;
            categoryId?: string;
        },
    ) {
        return this.menuItemsService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.menuItemsService.remove(id);
    }
}
