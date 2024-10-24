import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(
    private readonly amqpConnection: AmqpConnection,
  ) {}
  async checkStock() {
    await this.amqpConnection.publish('stock', 'stock-route', {
      type: 'check_stock',
    });

    // await this.amqpConnection.publish('stock', 'stock-route', { data: { itemName, quantity } });
    // console.log('msg published', 'stock', 'stock-route', { data: { itemName, quantity } });
  }

  async createOrder(itemId, quantity) {
    await this.amqpConnection.publish('orders', 'orders-route', { type: 'create_order', data: { itemId, quantity } });
    console.log('msg published', 'orders', 'orders-route', { data: { itemId, quantity } });
  }

  async checkDelivery(customerName) {
    await this.amqpConnection.publish('delivery', 'delivery-route', { data: { customerName } });
    console.log('msg published', 'delivery', 'delivery-route', { data: { customerName } });
  }

  async createStock(stockId, quantity, name) {
    await this.amqpConnection.publish('stock', 'stock-route', { type: 'create_stock', data: { stockId, quantity, name } }, {});
    console.log('msg published', 'stock', 'stock-route', { type: 'create_stock', data: { stockId, quantity, name } });
  }

  // Function to generate a unique correlation ID
  private generateCorrelationId() {
    return Math.random().toString(36).substr(2, 9);
  }
}
