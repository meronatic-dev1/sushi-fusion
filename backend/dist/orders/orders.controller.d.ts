import { RoutingService } from '../routing/routing.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class OrdersController {
    private routingService;
    private prisma;
    constructor(routingService: RoutingService, prisma: PrismaService);
    getOrders(): Promise<({
        user: {
            id: string;
            branchId: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string;
            password: string;
            phone: string | null;
            role: import("@prisma/client").$Enums.Role;
        } | null;
        branch: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            address: string;
            latitude: number;
            longitude: number;
            isActive: boolean;
            isClosed: boolean;
            openTime: string | null;
            closeTime: string | null;
        };
        orderItems: ({
            menuItem: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                price: number;
                imageUrl: string | null;
                isAvailable: boolean;
                categoryId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            orderId: string;
            menuItemId: string;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
        })[];
    } & {
        id: string;
        userId: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        mode: import("@prisma/client").$Enums.OrderMode;
        totalAmount: number;
        branchId: string;
        branchIdOriginal: string;
        routingAttempts: number;
        radiusUsedKm: number;
        customerLat: number;
        customerLng: number;
        customerAddress: string | null;
        geocodeFallback: boolean;
        isLongDistance: boolean;
        isReassigned: boolean;
        scheduledFor: Date | null;
        routingLog: import("@prisma/client/runtime/client").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    updateOrderStatus(id: string, status: string): Promise<{
        id: string;
        userId: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        mode: import("@prisma/client").$Enums.OrderMode;
        totalAmount: number;
        branchId: string;
        branchIdOriginal: string;
        routingAttempts: number;
        radiusUsedKm: number;
        customerLat: number;
        customerLng: number;
        customerAddress: string | null;
        geocodeFallback: boolean;
        isLongDistance: boolean;
        isReassigned: boolean;
        scheduledFor: Date | null;
        routingLog: import("@prisma/client/runtime/client").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createOrder(body: any): Promise<{
        message: string;
        orderId: string;
        status: string;
    }>;
}
