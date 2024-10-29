import { RabbitSubscribe, AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Stock } from './interfaces/stock.interface';

@Injectable()
export class MsAStockService {
  constructor(
    @Inject('STOCK_MODEL') private stockModel: Model<Stock>,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @RabbitSubscribe({
    exchange: 'stock',
    routingKey: 'stock-route',
    queue: 'stock-queue',
  })

  public async pubSubHandler(msg: any) {
    switch (msg.type) {
      case 'create_stock':
        this.createStock(msg.data);
        break;
      case 'check_stock':
        const stocks = await this.checkStock();
        await this.amqpConnection.publish('stock', 'stock-route', {
          type: 'check_stock',
          stocks, // Send the stock data as the message payload
        });
        break;
      default:
      // none for now
    }

    // console.log(`Received message: ${JSON.stringify(msg)}`);
  }

  public async createStock(data) {
    return await new this.stockModel(data).save();
  }

  public async checkStock(): Promise<Stock[]> {
    try {
      return await this.stockModel.find().exec(); // Fetch all stocks from the database
    } catch (error) {
      console.error('Error fetching stocks:', error);
      throw error; // Rethrow or handle error as needed
    }
  }
}
