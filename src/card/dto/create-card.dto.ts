import { IsNumber, IsString, Length } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @Length(4, 4)
  digits: string;

  @IsNumber()
  balance: number;
}
