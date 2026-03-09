import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';

@Controller('upload')
export class UploadController {
    constructor(private readonly s3Service: S3Service) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        try {
            const result = await this.s3Service.uploadImage(file);
            return {
                url: result.url,
                public_id: result.public_id,
            };
        } catch (error: any) {
            console.error('S3 upload failed:', error);
            throw new BadRequestException(`Image upload failed: ${error.message}`);
        }
    }
}
