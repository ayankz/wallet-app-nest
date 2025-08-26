import { Injectable } from '@nestjs/common';
import { UpdateCardDto } from './dto/update-card.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CardService {
  constructor(private prisma: PrismaService) {}

  async getCards(userId: number) {
    return await this.prisma.card.findMany({
      where: { userId },
      include: {
        transactions: true,
      },
    });
  }

  async createCard(userId: number, dto: CreateCardDto) {
    return this.prisma.card.create({
      data: {
        digits: dto.digits,
        userId,
        balance: new Prisma.Decimal(dto.balance),
        type: dto.type,
      },
    });
  }
  async updateCard(cardId: number, dto: UpdateCardDto) {
    return this.prisma.card.update({
      where: { id: cardId },
      data: {
        digits: dto.digits,
        balance:
          dto.balance !== undefined
            ? new Prisma.Decimal(dto.balance)
            : undefined,
      },
    });
  }

  async deleteCard(cardId: number, userId: number) {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
    });

    if (!card || card.userId !== userId) {
      throw new Error('Карта не найдена или доступ запрещен');
    }

    return this.prisma.card.delete({
      where: { id: cardId },
    });
  }
}
