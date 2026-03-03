import { Controller, Get, Patch, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    async getSettings() {
        return this.settingsService.getSettings();
    }

    @Patch()
    async updateSettings(@Body() data: { logoUrl?: string; bannerUrl?: string }) {
        return this.settingsService.updateSettings(data);
    }
}
