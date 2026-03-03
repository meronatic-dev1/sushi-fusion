import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        id: string;
        updatedAt: Date;
        logoUrl: string | null;
        bannerUrl: string | null;
    }>;
    updateSettings(data: {
        logoUrl?: string;
        bannerUrl?: string;
    }): Promise<{
        id: string;
        updatedAt: Date;
        logoUrl: string | null;
        bannerUrl: string | null;
    }>;
}
