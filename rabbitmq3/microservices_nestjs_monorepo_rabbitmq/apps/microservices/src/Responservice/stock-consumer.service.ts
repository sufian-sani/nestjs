import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AllStockCheckService {

    @RabbitSubscribe({
        exchange: 'all-stock-response',
        routingKey: 'all-stock-response-route',
        queue: 'all-stock-response-route-queue', // Ensure the queue name is unique for this consumer
    })
    async handleStockMessage(data: any) {
        // console.log('Received stock message:', msg);

        // Check the message type and process accordingly
        if (data.type === 'all-stock-response-type') {
            console.log('all stock data:', data); // Process the stock data
        }
    }
}
