import { AmqpConnection,RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Model} from "mongoose";
import {Stock} from "../interfaces/stock.interface";
import {StockConfirmationMessageService} from "./stock-confirmation-message";

@Injectable()
export class StockCheckService {
    constructor(
        @Inject('STOCK_MODEL') private stockModel: Model<Stock>,
        private readonly amqpConnection: AmqpConnection,
        private stockConfirmationMessage: StockConfirmationMessageService
    ) {}

    @RabbitSubscribe({
        exchange: 'stock-product',
        routingKey: 'stock-product-route',
        queue: 'stock-product-queue', // Ensure the queue name is unique for this consumer
    })
    async handleProductStockCheck(data: any) {
        try {
            if (data.type === 'check_stock_by_id') {
                const { itemId, quantity } = data.data
                if (!itemId && !quantity) {
                    throw new NotFoundException('error')
                }
                const stocks = await this.checkStock(itemId, parseInt(quantity));

                if(!stocks) {
                    throw new Error('product stock does not exist');
                }
                const infoStocks = {
                    stockId: stocks.stockId,
                    quantity,
                    name: stocks.name,
                }
                await this.amqpConnection.publish('stock-response-product', 'stock-product-response-route', {
                    type: 'check_product_stock_availability',
                    infoStocks
                });
            }
        } catch (e) {
            console.error(e)
        }
    }
    public async checkStock(stockId: string, quantity: number): Promise<Stock> {
        try {
            if (typeof quantity !== 'number' || quantity <= 0) {
                throw new Error(`Invalid quantity: ${quantity}. Must be a positive number.`);
            }
            const stock = await this.stockModel.findOneAndUpdate(
                { stockId, quantity: { $gte: quantity } }, // Ensure enough quantity is available
                { $inc: { quantity: -quantity } }, // Decrement quantity
                { new: true } // Return the updated stock document
            ).exec();
            if (!stock) {
                return null
            }
            return stock;
        } catch (error) {
            console.error('Error fetching stocks:', error);
        }
    }
}
