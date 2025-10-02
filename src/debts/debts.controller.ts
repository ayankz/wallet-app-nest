import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { GetCurrentUserId } from 'src/common/decorators';

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
  findAll(@GetCurrentUserId() userId: string) {
    return this.debtsService.findAll(userId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.debtsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDebtDto: UpdateDebtDto) {
  //   return this.debtsService.update(+id, updateDebtDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string, @GetCurrentUserId() userId: string) {
    return this.debtsService.remove(id, userId);
  }
}
