import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('pipeline')
  getPipelineReport() {
    return this.reportsService.getPipelineReport();
  }

  @Get('performance')
  getPerformanceReport() {
    return this.reportsService.getPerformanceReport();
  }
}
