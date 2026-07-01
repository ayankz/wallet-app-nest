import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TransactionType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOperationDto } from './dto/create-operation.dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto/update-operation.dto';

@Injectable()
export class OperationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateOperationDto) {
    return this.prisma.$transaction(async (tx) => {
      await this.assertCardOwnership(tx, dto.cardId, userId);
      await this.assertCategoryCompatibility(tx, dto.categoryId, dto.type);

      const transaction = await tx.transaction.create({
        data: {
          ...dto,
          userId,
        },
      });

      await this.applyCardBalanceChange(
        tx,
        dto.cardId,
        this.getSignedAmount(dto.type, dto.amount),
      );

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
    return this.prisma.$transaction(async (tx) => {
      const existingTransaction = await tx.transaction.findFirst({
        where: { id, userId },
      });

      if (!existingTransaction) {
        throw new ForbiddenException('Access denied or transaction not found');
      }

      const nextType = dto.type ?? existingTransaction.type;
      const nextAmount = dto.amount ?? existingTransaction.amount;
      const nextCategoryId =
        dto.categoryId === undefined
          ? existingTransaction.categoryId
          : dto.categoryId;
      const nextCardId =
        dto.cardId === undefined ? existingTransaction.cardId : dto.cardId;

      await this.assertCardOwnership(tx, nextCardId, userId);
      await this.assertCategoryCompatibility(tx, nextCategoryId, nextType);

      await tx.transaction.update({
        where: { id: existingTransaction.id },
        data: dto,
      });

      await this.syncCardBalancesAfterUpdate(tx, existingTransaction, {
        type: nextType,
        amount: nextAmount,
        cardId: nextCardId,
      });

      return { message: 'Transaction updated' };
    });
  }

  async remove(id: number, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const existingTransaction = await tx.transaction.findFirst({
        where: { id, userId },
      });

      if (!existingTransaction) {
        throw new ForbiddenException('Access denied or transaction not found');
      }

      await tx.transaction.delete({
        where: { id: existingTransaction.id },
      });

      await this.applyCardBalanceChange(
        tx,
        existingTransaction.cardId,
        -this.getSignedAmount(
          existingTransaction.type,
          existingTransaction.amount,
        ),
      );

      return { message: 'Transaction deleted' };
    });
  }

  private async assertCardOwnership(
    tx: Prisma.TransactionClient,
    cardId: number | null | undefined,
    userId: number,
  ) {
    if (cardId == null) {
      return;
    }

    const card = await tx.card.findFirst({
      where: { id: cardId, userId },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }
  }

  private async assertCategoryCompatibility(
    tx: Prisma.TransactionClient,
    categoryId: number | null | undefined,
    type: TransactionType,
  ) {
    if (categoryId == null) {
      return;
    }

    const category = await tx.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.type !== type) {
      throw new ForbiddenException(
        'Category type does not match transaction type',
      );
    }
  }

  private async syncCardBalancesAfterUpdate(
    tx: Prisma.TransactionClient,
    existingTransaction: {
      type: TransactionType;
      amount: number;
      cardId: number | null;
    },
    nextTransaction: {
      type: TransactionType;
      amount: number;
      cardId: number | null;
    },
  ) {
    const previousSignedAmount = this.getSignedAmount(
      existingTransaction.type,
      existingTransaction.amount,
    );
    const nextSignedAmount = this.getSignedAmount(
      nextTransaction.type,
      nextTransaction.amount,
    );

    if (existingTransaction.cardId === nextTransaction.cardId) {
      await this.applyCardBalanceChange(
        tx,
        nextTransaction.cardId,
        nextSignedAmount - previousSignedAmount,
      );
      return;
    }

    await this.applyCardBalanceChange(
      tx,
      existingTransaction.cardId,
      -previousSignedAmount,
    );
    await this.applyCardBalanceChange(
      tx,
      nextTransaction.cardId,
      nextSignedAmount,
    );
  }

  private async applyCardBalanceChange(
    tx: Prisma.TransactionClient,
    cardId: number | null | undefined,
    signedAmount: number,
  ) {
    if (cardId == null || signedAmount === 0) {
      return;
    }

    await tx.card.update({
      where: { id: cardId },
      data: {
        balance:
          signedAmount > 0
            ? { increment: signedAmount }
            : { decrement: Math.abs(signedAmount) },
      },
    });
  }

  private getSignedAmount(type: TransactionType, amount: number) {
    return type === 'INCOME' ? amount : -amount;
  }
}
