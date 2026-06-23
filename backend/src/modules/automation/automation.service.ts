import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AutomationService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.automationSequence.findMany({ include: { steps: true } });
  }

  async findOne(id: string) {
    return this.prisma.automationSequence.findUnique({ where: { id }, include: { steps: true } });
  }
}
