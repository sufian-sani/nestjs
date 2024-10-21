import { Injectable } from '@nestjs/common';
import {RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class MsCOrdersService {
  @RabbitSubscribe({
    exchange: 'orders',
    routingKey: 'orders-route',
    queue: 'orders-queue',
  })

  public async pubSubHandler(msg: {}) {
    console.log(`Received message: ${JSON.stringify(msg)}`);
  }
}