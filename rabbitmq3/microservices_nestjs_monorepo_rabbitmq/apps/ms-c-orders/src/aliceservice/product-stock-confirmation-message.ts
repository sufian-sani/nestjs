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
            if (data.type === 'check_product_stock_availability') {
                const { stockId, quantity } = data.infoStocks
                const productData = {
                    itemId: stockId,
                    quantity
                }
                await new this.orderModel(productData).save();
            }
        } catch (error){
            console.error(error)
        }

    }
}
