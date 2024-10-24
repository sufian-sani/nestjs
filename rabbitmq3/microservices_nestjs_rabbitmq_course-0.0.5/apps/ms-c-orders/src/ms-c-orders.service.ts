import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {Inject, Injectable} from '@nestjs/common';
import {Model} from "mongoose";
import {Order} from "./interfaces/order.interface";

@Injectable()
export class MsCOrdersService {
  constructor(
      @Inject('ORDER_MODEL') private orderModel: Model<Order>,
  ) {}
  @RabbitSubscribe({
    exchange: 'orders',
    routingKey: 'orders-route',
    queue: 'orders-queue',
  })

  public async pubSubHandler(msg: any) {
    switch (msg.type) {
      case 'create_order':
        // console.log(JSON.stringify(msg.data));
        this.createOrder(msg.data);
        break;
      default:
        // none for now
    }
  }

  public async createOrder(data) {
    // console.log('data',data)
    return await new this.orderModel(data).save();
  }
}
