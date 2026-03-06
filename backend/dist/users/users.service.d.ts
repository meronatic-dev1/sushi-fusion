import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
        branchId: string | null;
        createdAt: Date;
        branch: {
            name: string;
        } | null;
    }[]>;
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
        branchId: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findById(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
        branchId: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(data: any): Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
        branchId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
        branchId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        email: string;
        name: string;
        password: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
        branchId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
