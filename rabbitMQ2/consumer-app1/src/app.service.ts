import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  @MessagePattern('product_created')
  async handleProductCreated(data: any) {
    console.log('Consumer 1 processing data:', data);
    // Add your processing logic here
  }
}
