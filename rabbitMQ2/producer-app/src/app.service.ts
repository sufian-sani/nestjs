import { Injectable } from '@nestjs/common';
import {Inject} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('PRODUCT_SERVICE') private readonly client: ClientProxy) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createProduct(data: any) {
    return this.client.emit('product_created', data); // Send message to the queue
  }
}
