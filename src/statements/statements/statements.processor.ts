import { OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { Logger, OnModuleInit } from '@nestjs/common';
import { Job } from 'bullmq';

export class StatementsProcessor extends WorkerHost implements OnModuleInit {
  private readonly logger = new Logger(StatementsProcessor.name);

  onModuleInit() {
    this.logger.log(
      '🚀 StatementsProcessor initialized and connected to Redis',
    );
  }

  async process(job: Job<any>) {
    this.logger.log(`📄 Processing job ${job.name} with ID ${job.id}`);
    return { status: 'ok' };
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<any>, err: Error) {
    this.logger.error(`❌ Job ${job.id} failed: ${err.message}`);
  }
}
