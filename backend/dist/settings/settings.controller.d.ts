import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<any>;
    updateSettings(data: {
        logoUrl?: string;
        bannerUrl?: string;
    }): Promise<any>;
}
