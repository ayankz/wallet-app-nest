import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { StatementsService } from './statements.service';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('statements')
export class StatementsController {
  constructor(private readonly statementsService: StatementsService) {}

  @Post('upload')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadStatement(
    @UploadedFile() file: Express.Multer.File,
    @GetCurrentUserId() userId: number,
  ) {
    if (!file) {
      throw new Error('Файл не передан');
    }

    return await this.statementsService.uploadAndQueue(file, Number(userId));
  }
}
