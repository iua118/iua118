import { Controller, Get } from '@nestjs/common';
import { CommunicationService } from './communication.service';

@Controller('communication')
export class CommunicationController {
  constructor(private commService: CommunicationService) {}

  @Get('emails')
  getEmails() {
    return this.commService.getEmails();
  }

  @Get('calls')
  getCalls() {
    return this.commService.getCalls();
  }

  @Get('meetings')
  getMeetings() {
    return this.commService.getMeetings();
  }
}
