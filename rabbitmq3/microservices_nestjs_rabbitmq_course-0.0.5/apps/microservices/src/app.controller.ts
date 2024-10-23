import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { v4 as uuid } from 'uuid';
import {EventPattern, MessagePattern} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get('check-stock')
  async checkStock() {
    await this.appService.checkStock();
  }

  // @MessagePattern('check_stock')
  // async handleStockResponse(data: any) {
  //   console.log('Received stock data:', data);
  //   // Process the received stock data as needed
  // }

  @Get('order')
  async createOrder() {
    await this.appService.createOrder('jaffa-cake-monster', 'jaffa-cake', 1);
  }

  @Get('check-delivery')
  async checkDelivery() {
    await this.appService.checkDelivery('jaffa-cake-monster');
  }

  @Get('create-stock')
  async createStock() {
    await this.appService.createStock(uuid(), 9, 'new item 2');
  }
}
