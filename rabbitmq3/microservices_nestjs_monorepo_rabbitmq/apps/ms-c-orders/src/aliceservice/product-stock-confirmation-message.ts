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
        try {
            // Your existing logic
            if (data.type === 'check_product_stock_availability') {
                let response, productData;
                if (data.data.data.res !== undefined) {
                    response = data.data.data.res;
                    productData = data.data.data.data;
                }
                // Check for the second pattern
                else if (data.data.data.data.res !== undefined) {
                    response = data.data.data.data.res;
                    productData = data.data.data.data.data;
                }
                console.log(response)
                if (!response){
                    throw new NotFoundException('Product Not Found');
                }

                await new this.orderModel(productData).save();
            }
        } catch (error){
            console.error(error)
        }

    }
}
