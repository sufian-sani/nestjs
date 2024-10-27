import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {HttpException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Model} from "mongoose";
import {Order} from "../interfaces/order.interface";

@Injectable()
export class StockCheckResponse {
    constructor(
        @Inject('ORDER_MODEL') private orderModel: Model<Order>,
        private readonly amqpConnection: AmqpConnection,
    ) {}

    @RabbitSubscribe({
        exchange: 'stock-response-product',
        routingKey: 'stock-product-response-route',
        queue: 'stock-product-response-route-queue', // Ensure the queue name is unique for this consumer
    })
    async handleStockProductGetMessage(data: any) {
        // Your existing logic
        if (data.type === 'check_product_stock_availability') {
            // console.log('Stock data:', data, 'seen from c'); // Process the stock data
            if (!data.data.data.data){
                throw new NotFoundException('Not Found');
            }
            if(!data.data.data.data.res){
                console.log('product not available');
            }
            const orderData=data.data.data.data.data
            // const {stockId,quantity} = data.data.data.data.data
            // const orderData = {
            //     stockId,
            //     quantity,
            // };
            // console.log(orderData);
            await new this.orderModel(orderData).save();
            // return data.data.data
        }
    }
}
