import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead } from '@prisma/client';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    // Kiểm tra email đã tồn tại
    if (createLeadDto.email) {
      const existingLead = await this.prisma.lead.findFirst({
        where: { email: createLeadDto.email },
      });

      if (existingLead) {
        throw new BadRequestException('Email này đã tồn tại trong hệ thống');
      }
    }

    return this.prisma.lead.create({
      data: {
        ...createLeadDto,
        status: 'NEW',
        score: 0,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
    filter?: {
      status?: string;
      source?: string;
      assignedToId?: string;
      search?: string;
    },
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filter?.status) {
      where.status = filter.status;
    }

    if (filter?.source) {
      where.source = filter.source;
    }

    if (filter?.assignedToId) {
      where.assignedToId = filter.assignedToId;
    }

    if (filter?.search) {
      where.OR = [
        { firstName: { contains: filter.search, mode: 'insensitive' } },
        { lastName: { contains: filter.search, mode: 'insensitive' } },
        { email: { contains: filter.search, mode: 'insensitive' } },
        { company: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const [leads, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        include: {
          assignedTo: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.lead.count({ where }),
    ]);

    return {
      data: leads,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        contact: true,
        deal: true,
        activities: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!lead) {
      throw new NotFoundException(`Lead với ID ${id} không tồn tại`);
    }

    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.findOne(id);

    // Kiểm tra email duplicate
    if (updateLeadDto.email && updateLeadDto.email !== lead.email) {
      const existingLead = await this.prisma.lead.findFirst({
        where: {
          email: updateLeadDto.email,
          id: { not: id },
        },
      });

      if (existingLead) {
        throw new BadRequestException('Email này đã được sử dụng');
      }
    }

    return this.prisma.lead.update({
      where: { id },
      data: updateLeadDto,
      include: {
        assignedTo: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async remove(id: string): Promise<Lead> {
    const lead = await this.findOne(id);

    // Xóa các liên kết trước
    await this.prisma.automationSequenceStep.deleteMany({
      where: { leadId: id },
    });

    await this.prisma.activity.deleteMany({
      where: { leadId: id },
    });

    return this.prisma.lead.delete({
      where: { id },
    });
  }

  async assignLead(id: string, assignedToId: string): Promise<Lead> {
    // Kiểm tra user tồn tại
    const user = await this.prisma.user.findUnique({
      where: { id: assignedToId },
    });

    if (!user) {
      throw new NotFoundException('User không tồn tại');
    }

    return this.update(id, { assignedToId });
  }

  async updateStatus(id: string, status: string): Promise<Lead> {
    return this.update(id, { status: status as any });
  }

  async updateScore(id: string, score: number): Promise<Lead> {
    if (score < 0 || score > 100) {
      throw new BadRequestException('Score phải từ 0 đến 100');
    }

    return this.update(id, { score });
  }

  async getLeadStats(assignedToId?: string) {
    const where = assignedToId ? { assignedToId } : {};

    const [
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      convertedLeads,
      lostLeads,
    ] = await Promise.all([
      this.prisma.lead.count({ where }),
      this.prisma.lead.count({ where: { ...where, status: 'NEW' } }),
      this.prisma.lead.count({ where: { ...where, status: 'CONTACTED' } }),
      this.prisma.lead.count({ where: { ...where, status: 'QUALIFIED' } }),
      this.prisma.lead.count({ where: { ...where, status: 'CONVERTED' } }),
      this.prisma.lead.count({ where: { ...where, status: 'LOST' } }),
    ]);

    return {
      totalLeads,
      byStatus: {
        NEW: newLeads,
        CONTACTED: contactedLeads,
        QUALIFIED: qualifiedLeads,
        CONVERTED: convertedLeads,
        LOST: lostLeads,
      },
      conversionRate:
        totalLeads > 0
          ? ((convertedLeads / totalLeads) * 100).toFixed(2)
          : 0,
    };
  }

  async getLeadsBySource() {
    return this.prisma.lead.groupBy({
      by: ['source'],
      _count: true,
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });
  }
}
