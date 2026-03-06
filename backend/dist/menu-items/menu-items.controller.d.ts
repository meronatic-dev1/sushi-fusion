import { MenuItemsService } from './menu-items.service';
export declare class MenuItemsController {
    private readonly menuItemsService;
    constructor(menuItemsService: MenuItemsService);
    findAll(categoryId?: string): import("@prisma/client").Prisma.PrismaPromise<({
        category: {
            id: string;
            name: string;
            description: string | null;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
        isAvailable: boolean;
        salesCount: number;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getBestSellers(): import("@prisma/client").Prisma.PrismaPromise<({
        category: {
            id: string;
            name: string;
            description: string | null;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
        isAvailable: boolean;
        salesCount: number;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__MenuItemClient<({
        category: {
            id: string;
            name: string;
            description: string | null;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
        isAvailable: boolean;
        salesCount: number;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(body: {
        name: string;
        description?: string;
        price: number;
        imageUrl?: string;
        isAvailable?: boolean;
        categoryId: string;
    }): import("@prisma/client").Prisma.Prisma__MenuItemClient<{
        category: {
            id: string;
            name: string;
            description: string | null;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
        isAvailable: boolean;
        salesCount: number;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, body: {
        name?: string;
        description?: string;
        price?: number;
        imageUrl?: string;
        isAvailable?: boolean;
        categoryId?: string;
    }): import("@prisma/client").Prisma.Prisma__MenuItemClient<{
        category: {
            id: string;
            name: string;
            description: string | null;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
        isAvailable: boolean;
        salesCount: number;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    remove(id: string): import("@prisma/client").Prisma.Prisma__MenuItemClient<{
        id: string;
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
        isAvailable: boolean;
        salesCount: number;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
