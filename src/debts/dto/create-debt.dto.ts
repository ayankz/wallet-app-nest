import { DebtDirection, DebtStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDebtDto {
  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  counterparty: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(DebtStatus)
  status?: DebtStatus;

  @IsOptional()
  @IsString()
  proofFileUrl?: string;

  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @IsNotEmpty()
  @IsEnum(DebtDirection)
  direction: DebtDirection;
}
