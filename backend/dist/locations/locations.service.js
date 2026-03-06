"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LocationsService = class LocationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const locations = await this.prisma.location.findMany({
            include: {
                orders: {
                    where: { createdAt: { gte: today } },
                    select: { id: true, totalAmount: true },
                },
                _count: { select: { users: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
        return locations.map(loc => ({
            id: loc.id,
            name: loc.name,
            address: loc.address,
            latitude: loc.latitude,
            longitude: loc.longitude,
            isActive: loc.isActive,
            isClosed: loc.isClosed,
            openTime: loc.openTime,
            closeTime: loc.closeTime,
            phone: '',
            ordersToday: loc.orders.length,
            revenueToday: loc.orders.reduce((s, o) => s + (o.totalAmount || 0), 0),
            managersCount: loc._count.users,
            createdAt: loc.createdAt,
        }));
    }
    async create(data) {
        return this.prisma.location.create({
            data: {
                name: data.name,
                address: data.address,
                latitude: data.latitude ?? 0,
                longitude: data.longitude ?? 0,
                openTime: data.openTime ?? null,
                closeTime: data.closeTime ?? null,
            },
        });
    }
    async update(id, data) {
        return this.prisma.location.update({
            where: { id },
            data,
        });
    }
    async toggleActive(id) {
        const loc = await this.prisma.location.findUnique({ where: { id } });
        if (!loc)
            throw new Error('Location not found');
        return this.prisma.location.update({
            where: { id },
            data: { isActive: !loc.isActive },
        });
    }
    async remove(id) {
        return this.prisma.location.delete({ where: { id } });
    }
};
exports.LocationsService = LocationsService;
exports.LocationsService = LocationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocationsService);
//# sourceMappingURL=locations.service.js.map