import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuItemsService {
    constructor(private prisma: PrismaService) { }

    findAll(categoryId?: string) {
        return this.prisma.menuItem.findMany({
            where: categoryId ? { categoryId } : undefined,
            orderBy: { createdAt: 'asc' },
            include: { category: true },
        });
    }

    getBestSellers() {
        return this.prisma.menuItem.findMany({
            where: { isAvailable: true, salesCount: { gt: 0 } },
            orderBy: { salesCount: 'desc' },
            take: 10,
            include: { category: true },
        });
    }

    findOne(id: string) {
        return this.prisma.menuItem.findUnique({
            where: { id },
            include: { category: true },
        });
    }

    create(data: {
        name: string;
        description?: string;
        price: number;
        imageUrl?: string;
        isAvailable?: boolean;
        categoryId: string;
        dietary?: string[];
        allergens?: string[];
    }) {
        return this.prisma.menuItem.create({
            data,
            include: { category: true },
        });
    }

    update(
        id: string,
        data: {
            name?: string;
            description?: string;
            price?: number;
            imageUrl?: string;
            isAvailable?: boolean;
            categoryId?: string;
            dietary?: string[];
            allergens?: string[];
        },
    ) {
        return this.prisma.menuItem.update({
            where: { id },
            data,
            include: { category: true },
        });
    }

    remove(id: string) {
        return this.prisma.menuItem.delete({ where: { id } });
    }
}
