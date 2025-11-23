import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PDFParse } from 'pdf-parse';
import { AiService } from '../ai/ai.service';

@Processor('statements')
export class StatementsProcessor extends WorkerHost {
  private readonly logger = new Logger(StatementsProcessor.name);

  constructor(private aiService: AiService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`📄 Processing job ${job.id}`);
    // const fileUrl = job.data.fileUrl;
    try {
      // твоя логика обработки
      const s3 = new S3Client({ region: 'us-east-1' });

      const command = new GetObjectCommand({
        Bucket: 'wallet-statements',
        Key: 'statements/1/44465a74-c3a7-4d93-87e9-c0a40f20fb32.pdf',
      });
      const url: string = await getSignedUrl(s3, command, { expiresIn: 3600 });

      const res = await fetch(url);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const parser = await new PDFParse({ data: buffer });
      const textResult = await parser.getText();
      await parser.destroy();
      // console.log(textResult.text); // текст из PDF
      // return fileContent;
      const transactions = await this.aiService.extractTransactions(
        textResult.text,
      );
      console.log(
        `📄 transactions:  ${JSON.stringify(transactions, null, 2)} `,
      ); // текст из PDF
      return Promise.resolve({ status: 'ok' });
    } catch (err: unknown) {
      this.logger.error(`❌ Job ${job.id} failed`, err);
      throw err;
    }
  }
}
