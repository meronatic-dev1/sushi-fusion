import { LocationsService } from './locations.service';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    findAll(): Promise<any>;
    create(data: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
    toggleActive(id: string): Promise<any>;
    remove(id: string): Promise<any>;
}
