import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.lead.findMany({ include: { assignedTo: true } });
  }

  async findOne(id: string) {
    return this.prisma.lead.findUnique({ where: { id }, include: { assignedTo: true } });
  }
}
