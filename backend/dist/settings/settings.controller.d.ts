import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<{
        id: string;
        updatedAt: Date;
        logoUrl: string | null;
        bannerUrl: string | null;
        serviceCharge: number;
        enableServiceCharge: boolean;
    }>;
    updateSettings(data: {
        logoUrl?: string;
        bannerUrl?: string;
    }): Promise<{
        id: string;
        updatedAt: Date;
        logoUrl: string | null;
        bannerUrl: string | null;
        serviceCharge: number;
        enableServiceCharge: boolean;
    }>;
}
