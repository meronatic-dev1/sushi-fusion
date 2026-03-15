import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('upload')
export class UploadController {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        try {
            const result = await this.cloudinaryService.uploadImage(file);
            return {
                url: result.url,
                public_id: result.public_id,
            };
        } catch (error: any) {
            console.error('Cloudinary upload failed:', error);
            throw new BadRequestException(`Image upload failed: ${error.message}`);
        }
    }
}
