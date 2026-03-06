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
exports.MenuItemsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MenuItemsService = class MenuItemsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll(categoryId) {
        return this.prisma.menuItem.findMany({
            where: categoryId ? { categoryId } : undefined,
            orderBy: { createdAt: 'asc' },
            include: { category: true },
        });
    }
    findOne(id) {
        return this.prisma.menuItem.findUnique({
            where: { id },
            include: { category: true },
        });
    }
    create(data) {
        return this.prisma.menuItem.create({
            data,
            include: { category: true },
        });
    }
    update(id, data) {
        return this.prisma.menuItem.update({
            where: { id },
            data,
            include: { category: true },
        });
    }
    remove(id) {
        return this.prisma.menuItem.delete({ where: { id } });
    }
};
exports.MenuItemsService = MenuItemsService;
exports.MenuItemsService = MenuItemsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenuItemsService);
//# sourceMappingURL=menu-items.service.js.map