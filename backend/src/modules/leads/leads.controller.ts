import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('leads')
@UseGuards(JwtAuthGuard)
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    // Chỉ lấy leads được gán cho user hoặc nếu user là MANAGER/ADMIN thì lấy tất cả
    console.log('Current user:', user);
    return this.leadsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }
}
