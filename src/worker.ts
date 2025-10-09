import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('WorkerBootstrap');
  await NestFactory.createApplicationContext(AppModule);
  logger.log('🧠 Worker started and listening for BullMQ jobs...');
}
void bootstrap();
