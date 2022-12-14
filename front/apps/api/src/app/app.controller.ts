import { Controller, Get } from '@nestjs/common';

import { Message } from '@project/api-interfaces';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getData(): Message {
    return this.appService.getData();
  }

  @Get('pie-chart')
  getPieChart() {
    return this.appService.getPieChartValue();
  }

}
