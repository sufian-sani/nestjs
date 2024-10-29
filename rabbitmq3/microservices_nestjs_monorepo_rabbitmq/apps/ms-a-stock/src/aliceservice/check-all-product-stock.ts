import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {HttpException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Model} from "mongoose";
import { Stock } from '../interfaces/stock.interface';

@Injectable()
export class AllStockCheck {
    constructor(
        @Inject('STOCK_MODEL') private stockModel: Model<Stock>,
        private readonly amqpConnection: AmqpConnection,
    ) {}

    @RabbitSubscribe({
        exchange: 'stock-check',
        routingKey: 'stock-check-route',
        queue: 'stock-check-route-queue',
    })
    async handleAllStockCheck(data: any) {
        try {
            if (data.type === 'check_all_stock') {
                const allStocks = await this.checkStock();
                await this.amqpConnection.publish('all-stock-response', 'all-stock-response-route', {
                    type: 'all-stock-response-type',
                    allStocks // Send the stock data as the message payload
                });
                // console.log(allStocks)
                // console.log(data)
                // const orderId = data.data.msg.data?.orderId || data.data?.msg?.data?.msg?.data?.orderId || {}
                // // console.log(orderId)
                // // console.log(data.data.msg.data)
                // // console.log(data.data.msg.data?.msg?.data)
                // // const orderId = data.data?.msg.data?.msg.data
                // // console.log(orderId)
                // if (orderId) {
                //     // console.log(orderId.orderId);
                //     const orderDetails = await this.orderGetFromDatabase(orderId)
                //     if(orderDetails) {
                //         const {status, _id} = orderDetails;
                //         const orderDetailsInfo = {status, orderId: _id.toString()}
                //         this.sendOrderDetailsService.handlerSendOrderDetailsService(orderDetailsInfo)
                //     }
                // }
            }
        } catch (error){
            console.error(error)
        }
    }
    public async checkStock(): Promise<Stock[]> {
      try {
        return await this.stockModel.find().exec(); // Fetch all stocks from the database
      } catch (error) {
        console.error('Error fetching stocks:', error);
        throw error; // Rethrow or handle error as needed
      }
    }
}
