import { Controller, Get, Patch, Post, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    async getSettings() {
        return this.settingsService.getSettings();
    }

    @Patch()
    async updateSettings(@Body() data: { logoUrl?: string; bannerUrl?: string; bannerUrls?: string[]; serviceCharge?: number; enableServiceCharge?: boolean; enableServiceChargeTakeaway?: boolean; deliveryFee?: number; taxRate?: number }) {
        return this.settingsService.updateSettings(data);
    }

    @Post('reset')
    async resetApplication() {
        return this.settingsService.resetData();
    }
}
