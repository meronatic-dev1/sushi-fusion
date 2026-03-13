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

        const hashedPassword = await bcrypt.hash(data.password, 10);

        return this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
    }

    async update(id: string, data: any) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
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
        const existing = await this.findById(data.id);
        if (existing) {
            return this.update(data.id, {
                email: data.email,
                name: data.name,
                phone: data.phone ?? existing.phone,
            });
        }

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
