import { WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

export class StatementsProcessor extends WorkerHost {
  private readonly logger = new Logger(StatementsProcessor.name);
  async process(job: Job<any>) {
    this.logger.log(`📄 Processing job ${job.name} with ID ${job.id}`);
    this.logger.debug(`Payload: ${JSON.stringify(job.data)}`);

    try {
      // 1️⃣ Скачать PDF из S3 (fileUrl)
      // 2️⃣ Передать в AI-сервис (позже добавим)
      // 3️⃣ Получить JSON
      // 4️⃣ Сохранить результат в Redis или в Postgres (по сценарию)

      // Временно просто лог:
      this.logger.log(`✅ Job ${job.id} processed successfully`);
      return { status: 'ok' };
    } catch (err) {
      this.logger.error(`❌ Job ${job.id} failed`, err);
      throw err;
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<any>, err: Error) {
    this.logger.error(`❌ Job ${job.id} failed: ${err.message}`);
  }
}
