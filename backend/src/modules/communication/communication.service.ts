import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CommunicationService {
  constructor(private prisma: PrismaService) {}

  async getEmails() {
    return this.prisma.email.findMany();
  }

  async getCalls() {
    return this.prisma.call.findMany();
  }

  async getMeetings() {
    return this.prisma.meeting.findMany();
  }
}
