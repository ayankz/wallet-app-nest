import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { WorkerModule } from './worker/worker.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerModule, {
    logger: ['log', 'error', 'warn'],
  });
  const logger = new Logger('WorkerBootstrap');
  logger.log('🧠 Worker started and listening for BullMQ jobs...');
}
void bootstrap();
