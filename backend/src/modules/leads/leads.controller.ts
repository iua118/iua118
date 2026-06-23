import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('leads')
@UseGuards(JwtAuthGuard)
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  // Lấy danh sách leads
  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('status') status?: string,
    @Query('source') source?: string,
    @Query('assignedToId') assignedToId?: string,
    @Query('search') search?: string,
    @CurrentUser() user?: any,
  ) {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Nếu là USER, chỉ xem leads được gán cho mình
    const filters: any = {};
    if (user?.role === 'USER') {
      filters.assignedToId = user.userId;
    }
    if (status) filters.status = status;
    if (source) filters.source = source;
    if (assignedToId && user?.role !== 'USER') filters.assignedToId = assignedToId;
    if (search) filters.search = search;

    return this.leadsService.findAll(pageNum, limitNum, filters);
  }

  // Tạo lead mới
  @Post()
  async create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  // Lấy thông tin chi tiết lead
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  // Cập nhật lead
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto,
  ) {
    return this.leadsService.update(id, updateLeadDto);
  }

  // Xóa lead
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }

  // Gán lead cho nhân viên
  @Put(':id/assign')
  async assignLead(
    @Param('id') id: string,
    @Body('assignedToId') assignedToId: string,
  ) {
    return this.leadsService.assignLead(id, assignedToId);
  }

  // Cập nhật trạng thái lead
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.leadsService.updateStatus(id, status);
  }

  // Cập nhật điểm số lead
  @Put(':id/score')
  async updateScore(
    @Param('id') id: string,
    @Body('score') score: number,
  ) {
    return this.leadsService.updateScore(id, score);
  }

  // Lấy thống kê leads
  @Get('stats/overview')
  async getStats(@Query('assignedToId') assignedToId?: string) {
    return this.leadsService.getLeadStats(assignedToId);
  }

  // Lấy leads theo nguồn
  @Get('stats/by-source')
  async getLeadsBySource() {
    return this.leadsService.getLeadsBySource();
  }
}
