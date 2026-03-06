import { LocationsService } from './locations.service';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
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
    create(data: any): Promise<{
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
