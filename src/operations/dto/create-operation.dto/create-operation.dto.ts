import { TransactionType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOperationDto {
  @IsEnum(TransactionType)
  type!: TransactionType;

  @Type(() => Number)
  @IsNumber()
  amount!: number;

  @IsOptional()
  @Transform(({ value }) => (value == null || value === '' ? undefined : value))
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @Transform(({ value }) => (value == null || value === '' ? undefined : value))
  @Type(() => Number)
  @IsNumber()
  cardId?: number;
}
