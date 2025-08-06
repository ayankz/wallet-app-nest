import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { OperationsService } from './operations.service';
import { GetCurrentUserId } from 'src/common/decorators';
import { CreateOperationDto } from './dto/create-operation.dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto/update-operation.dto';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Get()
  findAll(@GetCurrentUserId() userId: number) {
    return this.operationsService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @GetCurrentUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.operationsService.findOne(id, userId);
  }

  @Post()
  create(@GetCurrentUserId() userId: number, @Body() dto: CreateOperationDto) {
    return this.operationsService.create(userId, dto);
  }

  @Patch(':id')
  update(
    @GetCurrentUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOperationDto,
  ) {
    return this.operationsService.update(id, userId, dto);
  }

  @Delete(':id')
  remove(
    @GetCurrentUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.operationsService.remove(id, userId);
  }
}
