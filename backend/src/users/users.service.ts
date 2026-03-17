import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

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
        try {
            this.logger.log(`Syncing user: ${data.id} (${data.email})`);
            
            const userEmail = data.email || `user-${data.id}@sushifusion.local`;
            
            // 1. Try finding by the provided ID (Clerk ID)
            let existing = await this.findById(data.id);

            // 2. If not found by ID, check if a user with the same email exists (migration case)
            if (!existing && data.email) {
                existing = await this.findByEmail(data.email);
                    // Migrate the record to the new Clerk ID using a transaction
                    this.logger.log(`Starting migration transaction for ${data.id}`);
                    return await this.prisma.$transaction(async (tx) => {
                        // Update related orders to the new ID first
                        const updateCounts = await tx.order.updateMany({
                            where: { userId: existing!.id },
                            data: { userId: data.id }
                        });
                        this.logger.log(`Updated ${updateCounts.count} orders during migration`);

                        // Delete the old record
                        await tx.user.delete({ where: { id: existing!.id } });
                        this.logger.log(`Deleted old user record ${existing!.id}`);

                        // Create the new record with the same attributes but new ID
                        const created = await tx.user.create({
                            data: {
                                id: data.id,
                                email: data.email || existing!.email,
                                name: data.name,
                                phone: data.phone || existing!.phone,
                                role: existing!.role.toString().toUpperCase() as any,
                                password: existing!.password,
                                branchId: existing!.branchId,
                            },
                        });
                        this.logger.log(`Created new migration-synced user ${data.id}`);
                        return created;
                    }, {
                        timeout: 10000 // 10s timeout
                    });
            }

            // 3. Normal update flow if user exists with the correct ID
            if (existing) {
                this.logger.log(`Updating existing user: ${data.id}`);
                return await this.update(data.id, {
                    email: data.email,
                    name: data.name,
                    phone: data.phone ?? existing.phone,
                });
            }

            // 4. Create or update new user if neither ID nor email matched (using upsert for robustness)
            this.logger.log(`Upserting synced user: ${data.id}`);
            return await this.prisma.user.upsert({
                where: { id: data.id },
                update: {
                    email: userEmail,
                    name: data.name,
                    phone: data.phone || undefined, // Don't overwrite with null if it exists
                },
                create: {
                    id: data.id,
                    email: userEmail,
                    name: data.name,
                    phone: data.phone || null,
                    password: 'synced-from-clerk',
                    role: 'CUSTOMER',
                },
            });
        } catch (error: any) {
            this.logger.error(`Sync error for user ${data.id}: ${error.message}`, error.stack);
            throw error;
        }
    }
}
