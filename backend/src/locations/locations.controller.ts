import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) { }

    @Get()
    async findAll() {
        return this.locationsService.findAll();
    }

    @Post()
    async create(@Body() data: any) {
        return this.locationsService.create(data);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() data: any) {
        return this.locationsService.update(id, data);
    }

    @Patch(':id/toggle')
    async toggleActive(@Param('id') id: string) {
        return this.locationsService.toggleActive(id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.locationsService.remove(id);
    }
}
