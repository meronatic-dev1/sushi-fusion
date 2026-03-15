import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                branchId: true,
                branch: {
                    select: { name: true }
                },
                createdAt: true,
            }
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async create(data: any) {
        const existing = await this.findByEmail(data.email);
        if (existing) {
            throw new ConflictException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(data.password, 12);

        return this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
    }

    async update(id: string, data: any) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 12);
        }
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.user.delete({
            where: { id },
        });
    }

    async syncUser(data: { id: string, email: string, name: string, phone?: string }) {
        // 1. Try finding by the provided ID (Clerk ID)
        let existing = await this.findById(data.id);

        // 2. If not found by ID, check if a user with the same email exists (migration case)
        if (!existing) {
            existing = await this.findByEmail(data.email);
            if (existing) {
                console.log(`Migrating user ${data.email} from old ID ${existing.id} to Clerk ID ${data.id}`);

                // Migrate the record to the new Clerk ID using a transaction
                return this.prisma.$transaction(async (tx) => {
                    // Update related orders to the new ID first
                    await tx.order.updateMany({
                        where: { userId: existing!.id },
                        data: { userId: data.id }
                    });

                    // Delete the old record
                    await tx.user.delete({ where: { id: existing!.id } });

                    // Create the new record with the same attributes but new ID
                    return tx.user.create({
                        data: {
                            id: data.id,
                            email: data.email,
                            name: data.name,
                            phone: data.phone || existing!.phone,
                            role: existing!.role,
                            password: existing!.password,
                            branchId: existing!.branchId,
                        },
                    });
                });
            }
        }

        // 3. Normal update flow if user exists with the correct ID
        if (existing) {
            return this.update(data.id, {
                email: data.email,
                name: data.name,
                phone: data.phone ?? existing.phone,
            });
        }

        // 4. Create new user if neither ID nor email matched
        return this.prisma.user.create({
            data: {
                id: data.id,
                email: data.email,
                name: data.name,
                phone: data.phone || null,
                password: 'synced-from-clerk',
                role: 'CUSTOMER',
            },
        });
    }
}
