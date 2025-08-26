import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  @Length(4, 4)
  digits?: string;

  @IsOptional()
  @IsNumber()
  balance?: number;
}
