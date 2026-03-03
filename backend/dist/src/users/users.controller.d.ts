import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    findOne(id: string): Promise<{
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
    create(createUserDto: any): Promise<{
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
    update(id: string, updateUserDto: any): Promise<{
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
