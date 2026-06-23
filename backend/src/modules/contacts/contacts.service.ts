import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.contact.findMany({ include: { account: true } });
  }

  async findOne(id: string) {
    return this.prisma.contact.findUnique({ where: { id }, include: { account: true } });
  }
}
