import { AmqpConnection,RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Model} from "mongoose";
import {Stock} from "../interfaces/stock.interface";
// import {StockConfirmationMessageService} from "./stock-confirmation-message";

@Injectable()
export class StockBackService {
    constructor(
        @Inject('STOCK_MODEL') private stockModel: Model<Stock>,
        private readonly amqpConnection: AmqpConnection,
    ) {}

    @RabbitSubscribe({
        exchange: 'order-cancel-stock-back',
        routingKey: 'order-cancel-stock-back-route',
        queue: 'order-cancel-stock-back-route-queue', // Ensure the queue name is unique for this consumer
    })
    async handleStockBackService(data: any) {
        // console.log('Received stock message:', msg.type);

        // Check the message type and process accordingly
        try {
            if (data.type === 'order-cancel-stock-back-type') {
                const { itemId,quantity } = data.data
                console.log(typeof itemId, typeof quantity)
                const stock = await this.stockModel.findOneAndUpdate(
                    { stockId:itemId, quantity: { $gte: quantity } }, // Ensure enough quantity is available
                    { $inc: { quantity: +quantity } }, // Decrement quantity
                    { new: true, useFindAndModify: false } // Return the updated stock document
                ).exec();
            }
        } catch (e) {
            console.error(e)
        }
    }
}