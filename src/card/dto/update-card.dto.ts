import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class UpdateCardDto {
  @ApiPropertyOptional({ example: 'Halyk Black' })
  @IsOptional()
  @IsString()
  cardName?: string;

  @ApiPropertyOptional({ example: '4321', minLength: 4, maxLength: 4 })
  @IsOptional()
  @IsString()
  @Length(4, 4)
  digits?: string;

  @ApiPropertyOptional({ example: 5000 })
  @IsOptional()
  @IsNumber()
  balance?: number;
}
