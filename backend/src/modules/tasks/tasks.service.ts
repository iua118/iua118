import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.task.findMany({ include: { assignedTo: true, deal: true } });
  }

  async findOne(id: string) {
    return this.prisma.task.findUnique({ where: { id }, include: { assignedTo: true, subtasks: true } });
  }
}
