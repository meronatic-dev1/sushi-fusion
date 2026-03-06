import { RoutingService } from '../routing/routing.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class OrdersController {
    private routingService;
    private prisma;
    constructor(routingService: RoutingService, prisma: PrismaService);
    getOrders(): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
            password: string;
            phone: string | null;
            role: import("@prisma/client").$Enums.Role;
            branchId: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        branch: {
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
        };
        orderItems: ({
            menuItem: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
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
            quantity: number;
            unitPrice: number;
            totalPrice: number;
            menuItemId: string;
            orderId: string;
        })[];
    } & {
        id: string;
        branchId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: string | null;
        mode: import("@prisma/client").$Enums.OrderMode;
        totalAmount: number;
        customerName: string | null;
        customerEmail: string | null;
        customerPhone: string | null;
        customerStreet: string | null;
        customerCity: string | null;
        customerPostcode: string | null;
        deliveryInstructions: string | null;
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
    })[]>;
    updateOrderStatus(id: string, status: string): Promise<{
        id: string;
        branchId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.OrderStatus;
        userId: string | null;
        mode: import("@prisma/client").$Enums.OrderMode;
        totalAmount: number;
        customerName: string | null;
        customerEmail: string | null;
        customerPhone: string | null;
        customerStreet: string | null;
        customerCity: string | null;
        customerPostcode: string | null;
        deliveryInstructions: string | null;
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
    }>;
    createOrder(body: any): Promise<{
        message: string;
        orderId: string;
        status: string;
    }>;
}
