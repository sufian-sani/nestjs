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
        // console.log('Received stock message:', msg.type);

        // Check the message type and process accordingly
        try {
            if (data.type === 'check_stock_by_id') {
                const { itemId, quantity } = data.data.data
                if (!itemId && !quantity) {
                    throw new NotFoundException('error')
                }
                console.log(itemId, quantity)
                const stocks = await this.checkStock(itemId, quantity);
                // console.log(stocks)
                if(!stocks) {
                    // console.log('product stock is empty');
                    return this.stockConfirmationMessage.stockConfirmationMessage({ res: false, msg: 'product not available' })
                    // await this.stockConfirmationMessage({ msg: 'product available' })
                } else {
                    // const orderItem = {
                    //     itemId, quantity
                    // }
                    return this.stockConfirmationMessage.stockConfirmationMessage({data: {res: true, data: data.data.data}})
                }
                // console.log(itemId, quantity)
                // console.log('Product Stock data:', msg.stocks); // Process the stock data
            }
        } catch (e) {
            console.log(e)
        }
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
                return null
                // throw new Error(`Invalid quantity: ${quantity}. Must be a positive number.`);
            }
            // const stock = await this.stockModel
            //     .findOneAndUpdate({ stockId, quantity: { $gte: quantity }},
            //         { $inc: { quantity: -quantity } }, // Deduct quantity
            //         { new: true } // Return the updated stock document
            //     )

            // if (!stock) {
            //     throw new Error(`Stock not available for stockId: ${stockId} or insufficient quantity.`);
            // }
            // const product = await this.stockModel.findOne({ stockId }).exec();
            // if(!!product && product.quantity > 0) {
            //     console.log(product)
            // }
            // --------------
            // const stock = true
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
    // async stockConfirmationMessage(data: any){
    //     // console.log(msg)
    //     await this.amqpConnection.publish('stock-product', 'stock-product-route', {
    //         type: 'check_product_stock_availability',
    //         data // Send the stock data as the message payload
    //     });
    // }
}
