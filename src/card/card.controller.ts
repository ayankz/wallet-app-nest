import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get()
  getCards(@GetCurrentUserId() userId: number) {
    return this.cardService.getCards(Number(userId));
  }

  @Post()
  createCard(@GetCurrentUserId() userId: number, @Body() dto: CreateCardDto) {
    return this.cardService.createCard(userId, dto);
  }

  @Patch(':cardId')
  updateCard(@Param('cardId') cardId: string, @Body() dto: UpdateCardDto) {
    return this.cardService.updateCard(Number(cardId), dto);
  }

  @Delete(':cardId')
  deleteCard(
    @Param('cardId') cardId: string,
    @GetCurrentUserId() userId: number,
  ) {
    return this.cardService.deleteCard(Number(cardId), Number(userId));
  }
}
