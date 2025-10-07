import { Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateDebtDto } from './dto/update-debt.dto';

@Injectable()
export class DebtsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateDebtDto) {
    return await this.prisma.debt.create({
      data: {
        userId,
        amount: dto.amount,
        counterparty: dto.counterparty,
        description: dto.description,
        status: dto.status,
        proofFileUrl: dto.proofFileUrl,
        dueDate: dto.dueDate,
        direction: dto.direction,
      },
    });
  }

  async findAll(userId: number, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const debts = await this.prisma.debt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const total = await this.prisma.debt.count({ where: { userId } });

    return {
      data: debts,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async remove(id: number, userId: number) {
    return this.prisma.debt.deleteMany({
      where: { id, userId },
    });
  }

  update(id: number, updateDebtDto: UpdateDebtDto, userId: number) {
    return this.prisma.debt.update({
      where: { id, userId },
      data: updateDebtDto,
    });
  }
}
