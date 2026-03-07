import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<any>;
    updateSettings(data: {
        logoUrl?: string;
        bannerUrl?: string;
        serviceCharge?: number;
        enableServiceCharge?: boolean;
    }): Promise<any>;
}
