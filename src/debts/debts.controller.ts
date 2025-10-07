import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { GetCurrentUserId } from 'src/common/decorators';
import { UpdateDebtDto } from './dto/update-debt.dto';

@Controller('debts')
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post()
  create(
    @GetCurrentUserId() userId: number,
    @Body() createDebtDto: CreateDebtDto,
  ) {
    return this.debtsService.create(userId, createDebtDto);
  }

  @Get()
  findAll(
    @GetCurrentUserId() userId: number,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.debtsService.findAll(
      userId,
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Patch(':debtId')
  update(
    @Param('debtId', ParseIntPipe) debtId: number,
    @Body() updateDebtDto: UpdateDebtDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.debtsService.update(debtId, updateDebtDto, userId);
  }

  @Delete(':debtId')
  remove(
    @Param('debtId', ParseIntPipe) debtId: number,
    @GetCurrentUserId() userId: number,
  ) {
    return this.debtsService.remove(debtId, userId);
  }
}
