import { PrismaService } from '../prisma/prisma.service';
export declare class LocationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<any>;
    create(data: {
        name: string;
        address: string;
        latitude?: number;
        longitude?: number;
        openTime?: string;
        closeTime?: string;
    }): Promise<any>;
    update(id: string, data: any): Promise<any>;
    toggleActive(id: string): Promise<any>;
    remove(id: string): Promise<any>;
}
