import {Controller, Get, Param} from '@nestjs/common';
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

  @Get('order')
  async createOrder() {
    await this.appService.createOrder('7333a918-8f49-4231-ae6b-87f76e074fd9', 1);
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
