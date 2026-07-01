import { TransactionType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOperationDto {
  @IsOptional()
  @IsEnum(TransactionType)
  readonly type?: TransactionType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly amount?: number;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @Type(() => Number)
  @IsNumber()
  readonly categoryId?: number | null;

  @IsOptional()
  @IsString()
  readonly comment?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @Type(() => Number)
  @IsNumber()
  readonly cardId?: number | null;
}
