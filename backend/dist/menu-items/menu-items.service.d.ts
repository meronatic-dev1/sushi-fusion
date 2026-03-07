import { PrismaService } from '../prisma/prisma.service';
export declare class MenuItemsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(categoryId?: string): any;
    getBestSellers(): any;
    findOne(id: string): any;
    create(data: {
        name: string;
        description?: string;
        price: number;
        imageUrl?: string;
        isAvailable?: boolean;
        categoryId: string;
    }): any;
    update(id: string, data: {
        name?: string;
        description?: string;
        price?: number;
        imageUrl?: string;
        isAvailable?: boolean;
        categoryId?: string;
    }): any;
    remove(id: string): any;
}
