import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DealsService } from './deals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('deals')
@UseGuards(JwtAuthGuard)
export class DealsController {
  constructor(private dealsService: DealsService) {}

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.dealsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dealsService.findOne(id);
  }
}
