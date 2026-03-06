import { CloudinaryService } from './cloudinary.service';
import type { Request } from 'express';
export declare class CloudinaryController {
    private readonly cloudinaryService;
    constructor(cloudinaryService: CloudinaryService);
    uploadImage(file: Express.Multer.File, req: Request): Promise<{
        url: any;
        public_id: any;
    }>;
}
