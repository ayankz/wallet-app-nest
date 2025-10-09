import { Module } from '@nestjs/common';
import { StatementsController } from './statements.controller';
import { StatementsService } from './statements.service';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'statements',
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get('REDIS_HOST'),
          port: parseInt(config.get('REDIS_PORT') || '6379', 10),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [StatementsService],
  controllers: [StatementsController],
})
export class StatementsModule {}
