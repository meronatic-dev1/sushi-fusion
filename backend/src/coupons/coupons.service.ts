import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CouponsService {
    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.discountCoupon.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    findOne(id: string) {
        return this.prisma.discountCoupon.findUnique({
            where: { id },
        });
    }
    
    findByCode(code: string) {
        return this.prisma.discountCoupon.findUnique({
            where: { code: code.toUpperCase() },
        });
    }

    async validateCode(code: string, subtotal: number) {
        const coupon = await this.findByCode(code);
        if (!coupon) throw new BadRequestException('Invalid coupon code');
        if (!coupon.isActive) throw new BadRequestException('Coupon is not active');
        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
            throw new BadRequestException('Coupon has expired');
        }
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            throw new BadRequestException('Coupon usage limit reached');
        }
        if (coupon.minimumSpend > 0 && subtotal < coupon.minimumSpend) {
            throw new BadRequestException(`Minimum spend of AED ${coupon.minimumSpend} required`);
        }
        
        let discountAmt = 0;
        if (coupon.isPercent) {
            discountAmt = (subtotal * coupon.discount) / 100;
        } else {
            discountAmt = coupon.discount;
        }
        
        // Don't discount more than the subtotal
        if (discountAmt > subtotal) {
            discountAmt = subtotal;
        }

        return {
            valid: true,
            coupon,
            discountAmt
        };
    }

    async create(data: { code: string; discount: number; isPercent?: boolean; isActive?: boolean; usageLimit?: number; expiryDate?: Date; minimumSpend?: number }) {
        // Ensure code is uppercase
        const code = data.code.toUpperCase();
        const exists = await this.findByCode(code);
        if (exists) throw new BadRequestException('Coupon code already exists');
        
        return this.prisma.discountCoupon.create({
            data: {
                ...data,
                code,
            }
        });
    }

    update(id: string, data: { code?: string; discount?: number; isPercent?: boolean; isActive?: boolean; usageLimit?: number; expiryDate?: Date; minimumSpend?: number }) {
        const updateData = { ...data };
        if (updateData.code) {
            updateData.code = updateData.code.toUpperCase();
        }
        return this.prisma.discountCoupon.update({
            where: { id },
            data: updateData,
        });
    }

    remove(id: string) {
        return this.prisma.discountCoupon.delete({ where: { id } });
    }
}
