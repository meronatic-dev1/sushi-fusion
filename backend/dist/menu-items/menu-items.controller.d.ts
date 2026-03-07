import { MenuItemsService } from './menu-items.service';
export declare class MenuItemsController {
    private readonly menuItemsService;
    constructor(menuItemsService: MenuItemsService);
    findAll(categoryId?: string): any;
    getBestSellers(): any;
    findOne(id: string): any;
    create(body: {
        name: string;
        description?: string;
        price: number;
        imageUrl?: string;
        isAvailable?: boolean;
        categoryId: string;
    }): any;
    update(id: string, body: {
        name?: string;
        description?: string;
        price?: number;
        imageUrl?: string;
        isAvailable?: boolean;
        categoryId?: string;
    }): any;
    remove(id: string): any;
}
