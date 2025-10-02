import { Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DebtsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateDebtDto) {
    return this.prisma.debt.create({
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

  async findAll(userId: number) {
    return this.prisma.debt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // update(id: number, updateDebtDto: UpdateDebtDto) {
  //   return `This action updates a #${id} debt`;
  // }

  async remove(id: number, userId: number) {
    return this.prisma.debt.deleteMany({
      where: { id, userId },
    });
  }
}
