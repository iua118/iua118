import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.account.findMany({ include: { contacts: true, deals: true } });
  }

  async findOne(id: string) {
    return this.prisma.account.findUnique({ where: { id }, include: { contacts: true, deals: true } });
  }
}
