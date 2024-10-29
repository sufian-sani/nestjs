import {Body, Controller, Get, Param} from '@nestjs/common';
import { AppService } from './app.service';
// import { v4 as uuid } from 'uuid';
// import {EventPattern, MessagePattern} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  // stock
  @Get('check-stock')
  async checkStock() {
    await this.appService.checkStock();
  }

  @Get('create-stock')
  async createStock(@Body() body: any) {
    const { stockId, quantity, name } = body; // Destructure body data
    // console.log(stockId, quantity, name)
    await this.appService.createStock(stockId, quantity, name);
  }

  @Get('order')
  async createOrder() {
    await this.appService.createOrder('ca2b39a3-b7b1-4181-a56f-905a6c11aaef', 4);
  }

  @Get('check-delivery')
  async checkDelivery() {
    await this.appService.checkDelivery('671f26ed97432a564c910b6c');
  }

  @Get('change-delivery-status')
  async changeDeliveryStatus(
      @Body('deliver_status') deliver_status: string,
      @Body('orderDeliverId') orderDeliverId: string
  ) {
    await this.appService.changeDeliveryStatus(orderDeliverId, deliver_status);
  }
}
