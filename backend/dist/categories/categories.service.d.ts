import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): any;
    findOne(id: string): any;
    create(data: {
        name: string;
        description?: string;
        imageUrl?: string;
    }): any;
    update(id: string, data: {
        name?: string;
        description?: string;
        imageUrl?: string;
    }): any;
    remove(id: string): any;
}
