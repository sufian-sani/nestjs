import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {Inject, Injectable} from '@nestjs/common';
import {Model} from "mongoose";
import {Order} from "../interfaces/order.interface";

@Injectable()
export class StockCheckByServiceService {
    constructor(
        private readonly amqpConnection: AmqpConnection,
    ) {}

    @RabbitSubscribe({
        exchange: 'stock-product',
        routingKey: 'stock-product-route',
        queue: 'stock-product-queue', // Ensure the queue name is unique for this consumer
    })
    async handleStockProductMessageSend(msg: any) {
        // console.log(msg)
        const stockAvailabilityResponse = await this.amqpConnection.publish('stock-product', 'stock-product-route', {
          type: 'check_stock_by_id',
            msg// Send the stock data as the message payload
        });

        // switch (msg.type) {
        //     case 'check_product_stock_availability':
        //         console.log(msg)
        //         break;
        //     default:
        //         console.log('Unknown message type');
        // }

        return stockAvailabilityResponse
        // switch (msg.type) {
        //     case 'check_product_stock_availability':
        //         console.log('check_product_stock_availability')
        //         // await this.createStock(msg.data);
        //         break;
        //     // Other cases
        //     default:

        // console.log('handleStockProductMessageSend')
        // console.log('Received stock message:', msg);

        // Check the message type and process accordingly
        // if (msg.type === 'check_stock') {
        //     console.log('Stock data:', msg.stocks); // Process the stock data
        // }
    }
    // async handleStockProductGetMessage(msg: any) {
    //     // Your existing logic
    //     switch (msg.type) {
    //         case 'check_product_stock_availability':
    //             console.log('sdjsljdlsjdl')
    //             // await this.createStock(msg.data);
    //             break;
    //         // Other cases
    //         default:
    //             // default
    //     }
        // if (msg.type === 'check_product_stock_availability') {
        //     console.log('Stock data:', msg); // Process the stock data
        // }
}
