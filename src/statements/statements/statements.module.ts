import { Module } from '@nestjs/common';
import { StatementsController } from './statements.controller';
import { StatementsService } from './statements.service';

@Module({
  providers: [StatementsService],
  controllers: [StatementsController],
})
export class StatementsModule {}
