import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const locations = await this.prisma.location.findMany({
            include: {
                orders: {
                    where: { createdAt: { gte: today } },
                    select: { id: true, totalAmount: true },
                },
                _count: { select: { users: true } },
            },
            orderBy: { createdAt: 'asc' },
        });

        return locations.map(loc => ({
            id: loc.id,
            name: loc.name,
            address: loc.address,
            latitude: loc.latitude,
            longitude: loc.longitude,
            isActive: loc.isActive,
            isClosed: loc.isClosed,
            openTime: loc.openTime,
            closeTime: loc.closeTime,
            phone: '', // Location model doesn't have phone — kept for UI compat
            ordersToday: loc.orders.length,
            revenueToday: loc.orders.reduce((s, o) => s + (o.totalAmount || 0), 0),
            managersCount: loc._count.users,
            createdAt: loc.createdAt,
        }));
    }

    async create(data: {
        name: string;
        address: string;
        latitude?: number;
        longitude?: number;
        openTime?: string;
        closeTime?: string;
    }) {
        return this.prisma.location.create({
            data: {
                name: data.name,
                address: data.address,
                latitude: data.latitude ?? 0,
                longitude: data.longitude ?? 0,
                openTime: data.openTime ?? null,
                closeTime: data.closeTime ?? null,
            },
        });
    }

    async update(id: string, data: any) {
        return this.prisma.location.update({
            where: { id },
            data,
        });
    }

    async toggleActive(id: string) {
        const loc = await this.prisma.location.findUnique({ where: { id } });
        if (!loc) throw new Error('Location not found');
        return this.prisma.location.update({
            where: { id },
            data: { isActive: !loc.isActive },
        });
    }

    async remove(id: string) {
        return this.prisma.location.delete({ where: { id } });
    }
}
