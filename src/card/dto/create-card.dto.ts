import { IsEnum, IsNumber, IsString, Length } from 'class-validator';

export enum CardType {
  VISA = 'VISA',
  MC = 'MC',
}
export class CreateCardDto {
  @IsString()
  @Length(4, 4)
  digits: string;

  @IsNumber()
  balance: number;

  @IsEnum(CardType, { message: 'type must be VISA or MC' })
  type: CardType;
}
