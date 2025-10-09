import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { StatementsProcessor } from './statements.processor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT') || 6379,
        },
      }),
      inject: [ConfigService],
    }),

    BullModule.registerQueue({ name: 'statements' }),
  ],
  providers: [StatementsProcessor],
})
export class WorkerModule {}
