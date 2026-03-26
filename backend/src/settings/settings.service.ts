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

    async updateSettings(data: { logoUrl?: string; bannerUrl?: string; bannerUrls?: string[]; serviceCharge?: number; enableServiceCharge?: boolean; enableServiceChargeTakeaway?: boolean; deliveryFee?: number; taxRate?: number }) {
        return this.prisma.storeSettings.upsert({
            where: { id: 'singleton' },
            update: data,
            create: {
                id: 'singleton',
                ...data,
            },
        });
    }

    async resetData() {
        // Delete analytics data and transaction items first due to FKs
        await this.prisma.orderItem.deleteMany();
        await this.prisma.order.deleteMany();
        
        // Delete users but keep admins and branch managers
        await this.prisma.user.deleteMany({
            where: {
                role: {
                    notIn: ['ADMIN', 'BRANCH_MANAGER']
                }
            }
        });

        return { success: true, message: 'Application data reset successfully' };
    }
}
