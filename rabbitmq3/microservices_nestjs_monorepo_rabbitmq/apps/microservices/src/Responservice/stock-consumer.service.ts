import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StockConsumerService {

    @RabbitSubscribe({
        exchange: 'stock',
        routingKey: 'stock-route',
        queue: 'stock-queue', // Ensure the queue name is unique for this consumer
    })
    async handleStockMessage(msg: any) {
        // console.log('Received stock message:', msg);

        // Check the message type and process accordingly
        if (msg.type === 'check_stock') {
            console.log('Stock data:', msg.stocks); // Process the stock data
        }
    }
}
