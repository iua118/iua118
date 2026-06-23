import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getPipelineReport() {
    return this.prisma.deal.groupBy({
      by: ['stage'],
      _sum: { amount: true },
      _count: true,
    });
  }

  async getPerformanceReport() {
    return this.prisma.user.findMany({
      include: {
        deals: { where: { status: 'CLOSED_WON' } },
        _count: { select: { deals: true } },
      },
    });
  }
}
