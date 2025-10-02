import { Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DebtsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createDebtDto: CreateDebtDto) {
    return this.prisma.debt.create({
      data: {
        ...createDebtDto,
        userId,
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

  async remove(id: string, userId: number) {
    return this.prisma.debt.deleteMany({
      where: { id, userId },
    });
  }
}
