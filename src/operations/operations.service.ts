import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOperationDto } from './dto/create-operation.dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto/update-operation.dto';

@Injectable()
export class OperationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateOperationDto) {
    return this.prisma.transaction.create({
      data: {
        ...dto,
        type: dto.type,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
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
