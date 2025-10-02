import { DebtStatus } from '@prisma/client';
import {
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
  counterparty: string; // у кого взял / кому дал

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(DebtStatus)
  status?: DebtStatus; // по умолчанию PENDING

  @IsOptional()
  @IsString()
  attachment?: string; // путь к файлу/URL
}
