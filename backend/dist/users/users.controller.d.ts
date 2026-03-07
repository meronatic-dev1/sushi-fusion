import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    create(createUserDto: any): Promise<any>;
    update(id: string, updateUserDto: any): Promise<any>;
    remove(id: string): Promise<any>;
}
