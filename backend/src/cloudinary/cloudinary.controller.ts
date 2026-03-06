import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

@Controller('upload')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        try {
            // Try Cloudinary first
            const result = await this.cloudinaryService.uploadImage(file);
            return {
                url: result.secure_url,
                public_id: result.public_id,
            };
        } catch (error: any) {
            console.warn('Cloudinary upload failed, falling back to local storage:', error.message);

            // Fallback to local storage
            const uploadDir = path.join(process.cwd(), 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const ext = path.extname(file.originalname) || '.jpg';
            const filename = `${randomUUID()}${ext}`;
            const filePath = path.join(uploadDir, filename);

            fs.writeFileSync(filePath, file.buffer);

            // Return local URL
            return {
                url: `http://localhost:3001/uploads/${filename}`,
                public_id: filename,
            };
        }
    }
}
