import { PrismaService } from '../prisma/prisma.service';
export declare class LocationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        address: string;
        latitude: number;
        longitude: number;
        isActive: boolean;
        isClosed: boolean;
        openTime: string | null;
        closeTime: string | null;
        phone: string;
        ordersToday: number;
        revenueToday: number;
        managersCount: number;
        createdAt: Date;
    }[]>;
    create(data: {
        name: string;
        address: string;
        latitude?: number;
        longitude?: number;
        openTime?: string;
        closeTime?: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        latitude: number;
        longitude: number;
        isActive: boolean;
        isClosed: boolean;
        openTime: string | null;
        closeTime: string | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        latitude: number;
        longitude: number;
        isActive: boolean;
        isClosed: boolean;
        openTime: string | null;
        closeTime: string | null;
    }>;
    toggleActive(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        latitude: number;
        longitude: number;
        isActive: boolean;
        isClosed: boolean;
        openTime: string | null;
        closeTime: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        latitude: number;
        longitude: number;
        isActive: boolean;
        isClosed: boolean;
        openTime: string | null;
        closeTime: string | null;
    }>;
}
