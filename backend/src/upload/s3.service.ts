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
    private region: string;

constructor(private configService: ConfigService) {
        this.endpoint = this.configService.get('S3_ENDPOINT') || '';
        this.bucketName = this.configService.get('S3_BUCKET_NAME') || '';
        this.region = this.configService.get('S3_REGION') || 'us-east-1';
        
        const clientConfig: any = {
            region: this.region,
            credentials: {
                accessKeyId: this.configService.get('S3_ACCESS_KEY') || '',
                secretAccessKey: this.configService.get('S3_SECRET_KEY') || '',
            },
        };

        if (this.endpoint) {
            clientConfig.endpoint = this.endpoint;
            clientConfig.forcePathStyle = true; // Required for MinIO/custom endpoints
        }

        this.s3Client = new S3Client(clientConfig);
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

        let url = '';
        if (this.endpoint) {
            // Path-style URL for custom endpoints like MinIO
            url = `${this.endpoint.replace(/\/$/, '')}/${this.bucketName}/${filename}`;
        } else {
            // Virtual-hosted-style URL for standard AWS S3
            url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${filename}`;
        }

        return {
            url,
            public_id: filename,
        };
    }
}
