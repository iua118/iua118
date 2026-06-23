import { Controller, Get, Param } from '@nestjs/common';
import { AutomationService } from './automation.service';

@Controller('automation')
export class AutomationController {
  constructor(private automationService: AutomationService) {}

  @Get()
  findAll() {
    return this.automationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.automationService.findOne(id);
  }
}
