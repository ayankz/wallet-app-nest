import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransferService {
  constructor(private prisma: PrismaService) {}

  async createTransfer(userId: number, data: CreateTransferDto) {
    if (data.fromAccountId === data.toAccountId) {
      throw new BadRequestException('Cannot transfer to the same account');
    }

    return this.prisma.$transaction(async (tx) => {
      const fromAccount = await tx.account.findFirst({
        where: { id: data.fromAccountId, userId },
      });

      const toAccount = await tx.account.findFirst({
        where: { id: data.toAccountId, userId },
      });

      const debitAmount = new Prisma.Decimal(data.debitAmount);

      const creditAmount = new Prisma.Decimal(data.creditAmount);

      if (!fromAccount || !toAccount) {
        throw new NotFoundException('One or both accounts not found');
      }

      if (fromAccount.balance.lessThan(debitAmount)) {
        throw new BadRequestException(
          'Insufficient funds in the source account',
        );
      }

      await tx.account.update({
        where: { id: fromAccount.id },
        data: {
          balance: { decrement: debitAmount },
        },
      });

      await tx.account.update({
        where: { id: toAccount.id },
        data: {
          balance: { increment: creditAmount },
        },
      });

      return tx.transfer.create({
        data: {
          fromAccountId: data.fromAccountId,
          toAccountId: data.toAccountId,
          debitAmount,
          creditAmount,
          comment: data.comment,
          userId,
        },
      });
    });
  }
}
