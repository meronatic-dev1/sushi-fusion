import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
    constructor(private prisma: PrismaService) { }

    async getSettings() {
        let settings = await this.prisma.storeSettings.findUnique({
            where: { id: 'singleton' },
        });

        if (!settings) {
            settings = await this.prisma.storeSettings.create({
                data: {
                    id: 'singleton',
                },
            });
        }

        return settings;
    }

    async updateSettings(data: { logoUrl?: string; bannerUrl?: string; serviceCharge?: number; enableServiceCharge?: boolean; enableServiceChargeTakeaway?: boolean }) {
        return this.prisma.storeSettings.upsert({
            where: { id: 'singleton' },
            update: data,
            create: {
                id: 'singleton',
                ...data,
            },
        });
    }
}
