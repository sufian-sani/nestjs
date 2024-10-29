import { AmqpConnection,RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {Inject, Injectable, NotFoundException} from '@nestjs/common';

@Injectable()
export class StatusFromOrderService {
    constructor(
        private readonly amqpConnection: AmqpConnection,
    ) {}

    @RabbitSubscribe({
        exchange: 'order-status-check',
        routingKey: 'order-status-check-route',
        queue: 'order-status-check-route-queue', // Ensure the queue name is unique for this consumer
    })

    async checkStatusFromOrderService(msg: any){
        await this.amqpConnection.publish('order-status-check', 'order-status-check-route', { type: 'order-status-check', data: { msg } });
        // console.log(data)
        // await this.amqpConnection.publish('stock-response-product', 'stock-product-response-route', {
        //     type: 'check_product_stock_availability',
        //     data // Send the stock data as the message payload
        // });
    }
}
