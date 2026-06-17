import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  cardName?: string;

  @IsOptional()
  @IsString()
  @Length(4, 4)
  digits?: string;

  @IsOptional()
  @IsNumber()
  balance?: number;
}
