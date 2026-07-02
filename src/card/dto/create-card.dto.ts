import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';

export class CreateCardDto {
  @ApiProperty({ example: 'Kaspi Gold' })
  @IsString()
  cardName!: string;

  @ApiProperty({ example: '1234', minLength: 4, maxLength: 4 })
  @IsString()
  @Length(4, 4)
  digits!: string;

  @ApiProperty({ example: 15000.5 })
  @IsNumber()
  balance!: number;
}
