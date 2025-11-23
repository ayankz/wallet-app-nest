import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { StatementsProcessor } from './statements.processor';
import { AiService } from '../ai/ai.service';
import { CategoryModule } from '../category/category.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoryService } from 'src/category/category.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        connection: {
          host: '127.0.0.1',
          //   config.get<string>('REDIS_HOST'),
          port: 6379,
          //   parseInt(config.get<string>('REDIS_PORT') || '6379', 10),
        },
      }),
    }),

    BullModule.registerQueue({ name: 'statements' }),
    CategoryModule,
    PrismaModule,
  ],
  providers: [StatementsProcessor, AiService, CategoryService],
})
export class WorkerModule {}
