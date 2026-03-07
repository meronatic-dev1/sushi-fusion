import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): any;
    findOne(id: string): any;
    create(body: {
        name: string;
        description?: string;
        imageUrl?: string;
    }): any;
    update(id: string, body: {
        name?: string;
        description?: string;
        imageUrl?: string;
    }): any;
    remove(id: string): any;
}
