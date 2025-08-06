import { IsOptional, IsEnum, IsNumber, IsString } from 'class-validator';

export class UpdateOperationDto {
  @IsOptional()
  @IsEnum(['INCOME', 'EXPENSE'])
  readonly type?: 'INCOME' | 'EXPENSE';

  @IsOptional()
  @IsNumber()
  readonly amount?: number;

  @IsOptional()
  @IsString()
  readonly category?: string;

  @IsOptional()
  @IsString()
  readonly comment?: string;
}
