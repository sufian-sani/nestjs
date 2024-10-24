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

  public async pubSubHandler(msg: any) {
    switch (msg.type) {
      case 'create_order':
        // console.log(JSON.stringify(msg.data));
        await this.createOrder(msg.data);
        break;
      default:
        // none for now
    }
  }

  public async createOrder(data) {
    // console.log('data',data)
    const stockValue = await this.productStockCheck.handleStockProductMessageSend(data)
    console.log(stockValue)
    // await this.amqpConnection.publish('stock', 'stock-route', {
    //   type: 'check_stock_by_id',
    //   data,// Send the stock data as the message payload
    // });
    // const messageConfirmation = await this.productStockCheck.handleStockProductGetMessage(data)
    // console.log(messageConfirmation)
    // return await new this.orderModel(data).save();
  }
}
