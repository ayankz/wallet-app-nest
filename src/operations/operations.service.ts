import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOperationDto } from './dto/create-operation.dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto/update-operation.dto';

@Injectable()
export class OperationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateOperationDto) {
    return this.prisma.$transaction(async (tx) => {
      if (dto.cardId) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const card = await tx.card.findUnique({
          where: { id: dto.cardId },
        });

        if (!card) {
          throw new Error('Card not found');
        }
      }
      const transaction = await tx.transaction.create({
        data: {
          ...dto,
          userId,
        },
      });

      // если транзакция привязана к карте -> обновляем баланс
      if (dto.cardId) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        await tx.card.update({
          where: { id: dto.cardId },
          data: {
            balance:
              dto.type === 'INCOME'
                ? { increment: dto.amount }
                : { decrement: dto.amount },
          },
        });
      }

      return transaction;
    });
  }

  async findAll(userId: number) {
    return await this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        card: {
          select: {
            digits: true,
            type: true,
          },
        },
      },
    });
  }

  async findOne(id: number, userId: number) {
    return this.prisma.transaction.findFirst({
      where: { id, userId },
    });
  }

  async update(id: number, userId: number, dto: UpdateOperationDto) {
    const result = await this.prisma.transaction.updateMany({
      where: { id, userId },
      data: dto,
    });

    if (result.count === 0) {
      throw new ForbiddenException('Access denied or transaction not found');
    }
    return { message: 'Transaction updated' };
  }

  async remove(id: number, userId: number) {
    const result = await this.prisma.transaction.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new ForbiddenException('Access denied or transaction not found');
    }

    return { message: 'Transaction deleted' };
  }
}
