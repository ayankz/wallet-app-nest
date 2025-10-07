import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Injectable()
export class StatementsService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly logger = new Logger(StatementsService.name);

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET')!;
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
    });
  }
  async uploadAndQueue(file: Express.Multer.File, userId: number) {
    const ext = extname(file.originalname);
    const key = `statements/${userId}/${randomUUID()}${ext}`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      const fileUrl = `https://${this.bucket}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;

      this.logger.log(`✅ File uploaded to S3: ${fileUrl}`);
      return { key, fileUrl };
    } catch (error) {
      this.logger.error('❌ Failed to upload to S3', error);
      throw error;
    }
  }
}
