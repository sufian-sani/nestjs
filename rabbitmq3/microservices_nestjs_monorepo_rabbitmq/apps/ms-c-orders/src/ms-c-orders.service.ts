import {AmqpConnection, RabbitSubscribe} from '@golevelup/nestjs-rabbitmq';
import {Inject, Injectable} from '@nestjs/common';
import {Model} from "mongoose";
import {Order} from "./interfaces/order.interface";
import {StockCheckByServiceService} from "./aliceservice/productstock-check.service";

@Injectable()
export class MsCOrdersService {
  constructor(
      @Inject('ORDER_MODEL') private orderModel: Model<Order>,
      private readonly amqpConnection: AmqpConnection,
      private productStockCheck: StockCheckByServiceService
  ) {}
  @RabbitSubscribe({
    exchange: 'orders',
    routingKey: 'orders-route',
    queue: 'orders-queue',
  })

  public async pubSubHandler(data: any) {
    try {
      if (data.type === 'create_order') {
        await this.checkItemStock(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async checkItemStock(data) {
    this.amqpConnection.publish('stock-product', 'stock-product-route', {
      type: 'check_stock_by_id',
      data
    });
  }
}
