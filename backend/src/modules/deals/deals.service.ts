import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.deal.findMany({ include: { assignedTo: true, account: true } });
  }

  async findOne(id: string) {
    return this.prisma.deal.findUnique({ where: { id }, include: { assignedTo: true, account: true, contacts: true } });
  }
}
