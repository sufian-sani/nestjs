import { AmqpConnection,RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Model} from "mongoose";
import {Stock} from "../interfaces/stock.interface";

@Injectable()
export class StockCheckService {
    constructor(
        @Inject('STOCK_MODEL') private stockModel: Model<Stock>,
        private readonly amqpConnection: AmqpConnection,
    ) {}

    @RabbitSubscribe({
        exchange: 'stock-product',
        routingKey: 'stock-product-route',
        queue: 'stock-product-queue', // Ensure the queue name is unique for this consumer
    })
    async handleProductStockCheck(msg: any) {
        // console.log('Received stock message:', msg.type);

        // Check the message type and process accordingly
        if (msg.type === 'check_stock_by_id') {
            // console.log(msg)
            const {itemId, quantity} = msg.msg.msg
            // const stocks = await this.checkStock(itemId, quantity);
            const stocks = true
            if(!!stocks) {
                // console.log(stocks)
                await this.stockConfirmationMessage({ msg: 'product available' })
            }
            // console.log(itemId, quantity)
            // console.log('Product Stock data:', msg.stocks); // Process the stock data
        }
        return null
    }
    public async checkStock(stockId: string, quantity: number): Promise<Stock> {
        try {
            // console.log('dslkdjsldj')
            // return await this.stockModel.findById(itemId).exec(); // Fetch all stocks from the database
            // const stock = await this.stockModel.findOne({ stockId }).exec();
            // if (!stock) {
            //     throw new NotFoundException(`Stock with ID ${stockId} not found`);
            // }

            // Validate input
            if (typeof quantity !== 'number' || quantity <= 0) {
                throw new Error(`Invalid quantity: ${quantity}. Must be a positive number.`);
            }
            const stock = await this.stockModel
                .findOneAndUpdate({ stockId, quantity: { $gte: quantity }},
                    { $inc: { quantity: -quantity } }, // Deduct quantity
                    { new: true } // Return the updated stock document
                )
            if (!stock) {
                throw new Error(`Stock not available for stockId: ${stockId} or insufficient quantity.`);
            }

            return stock;
        } catch (error) {
            console.error('Error fetching stocks:', error);
            throw error; // Rethrow or handle error as needed
        }
    }
    public async stockConfirmationMessage(msg: any){
        console.log(msg)
        await this.amqpConnection.publish('stock-product', 'stock-product-route', {
            type: 'check_product_stock_availability',
            msg // Send the stock data as the message payload
        });
    }
}
