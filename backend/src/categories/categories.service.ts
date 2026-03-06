import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.category.findMany({
            orderBy: { createdAt: 'asc' },
            include: { _count: { select: { menuItems: true } } },
        });
    }

    findOne(id: string) {
        return this.prisma.category.findUnique({
            where: { id },
            include: { menuItems: true },
        });
    }

    create(data: { name: string; description?: string; imageUrl?: string }) {
        return this.prisma.category.create({ data });
    }

    update(id: string, data: { name?: string; description?: string; imageUrl?: string }) {
        return this.prisma.category.update({ where: { id }, data });
    }

    remove(id: string) {
        return this.prisma.category.delete({ where: { id } });
    }
}
