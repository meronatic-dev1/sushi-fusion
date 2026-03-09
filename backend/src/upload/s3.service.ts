import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import * as path from 'path';

@Injectable()
export class S3Service {
    private s3Client: S3Client;
    private bucketName: string;
    private endpoint: string;

    constructor(private configService: ConfigService) {
        this.endpoint = this.configService.get('S3_ENDPOINT') || '';
        this.bucketName = this.configService.get('S3_BUCKET_NAME') || '';
        
        this.s3Client = new S3Client({
            region: this.configService.get('S3_REGION') || 'us-east-1',
            endpoint: this.endpoint,
            credentials: {
                accessKeyId: this.configService.get('S3_ACCESS_KEY') || '',
                secretAccessKey: this.configService.get('S3_SECRET_KEY') || '',
            },
            forcePathStyle: true, // Required for MinIO
        });
    }

    async uploadImage(file: Express.Multer.File): Promise<{ url: string, public_id: string }> {
        const ext = path.extname(file.originalname) || '.jpg';
        const filename = `${randomUUID()}${ext}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: filename,
            Body: file.buffer,
            ContentType: file.mimetype,
            // Depending on MinIO setup, ACL might be ignored, but it's good practice to mark it
            ACL: 'public-read',
        });

        await this.s3Client.send(command);

        // Construct the public URL for the uploaded image
        // With forcePathStyle, MinIO URLs look like: http://endpoint:9000/bucket/filename
        const url = `${this.endpoint.replace(/\/$/, '')}/${this.bucketName}/${filename}`;

        return {
            url,
            public_id: filename,
        };
    }
}
