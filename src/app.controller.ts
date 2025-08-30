import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@app/shared';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Public()
  async getHello() {
    const result = await this.appService.seedData();
    return result;
  }
}

