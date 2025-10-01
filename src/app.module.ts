import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './common/guards';
import { AppService } from './app.service';
import { OperationsModule } from './operations/operations.module';
import { CategoryModule } from './category/category.module';
// import { StatementsModule } from './statements/statements/statements.module';
import { CardModule } from './card/card.module';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health-chech/health.controller';
import { DebtsModule } from './debts/debts.module';
@Module({
  imports: [
    AuthModule,
    PrismaModule,
    OperationsModule,
    CategoryModule,
    // StatementsModule,
    CardModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
    }),
    DebtsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
