import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
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
        serviceCharge?: number;
        enableServiceCharge?: boolean;
    }): Promise<{
        id: string;
        updatedAt: Date;
        logoUrl: string | null;
        bannerUrl: string | null;
        serviceCharge: number;
        enableServiceCharge: boolean;
    }>;
}
