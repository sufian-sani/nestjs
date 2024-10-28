import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {HttpException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Model} from "mongoose";
import {Order} from "../interfaces/order.interface";
import {SendOrderDetailsService} from "./send-order-details-service";

@Injectable()
export class OrderStatusCheck {
    constructor(
        @Inject('ORDER_MODEL') private orderModel: Model<Order>,
        private readonly amqpConnection: AmqpConnection,
        private sendOrderDetailsService: SendOrderDetailsService
    ) {}

    @RabbitSubscribe({
        exchange: 'order-status-check',
        routingKey: 'order-status-check-route',
        queue: 'order-status-check-route-queue',
    })
    async handleOrderStatusCheck(data: any) {
        try {
            if (data.type === 'order-status-check') {
                // console.log(data)
                const orderId = data.data.msg.data?.orderId || data.data?.msg?.data?.msg?.data?.orderId || {}
                // console.log(orderId)
                // console.log(data.data.msg.data)
                // console.log(data.data.msg.data?.msg?.data)
                // const orderId = data.data?.msg.data?.msg.data
                // console.log(orderId)
                if (orderId) {
                    // console.log(orderId.orderId);
                    const orderDetails = await this.orderGetFromDatabase(orderId)
                    if(orderDetails) {
                        const {status, _id} = orderDetails;
                        const orderDetailsInfo = {status, orderId: _id.toString()}
                        this.sendOrderDetailsService.handlerSendOrderDetailsService(orderDetailsInfo)
                    }
                }
            }
        } catch (error){
            console.error('-----------------------------------------',error)
        }
    }
    public async orderGetFromDatabase(orderId: string): Promise<Order> {
        try {
            const order = await this.orderModel.findOne({ _id: orderId }).exec();
            if (!order) {
                throw new NotFoundException(`Order with ID ${orderId} not found.`);
            }
            return order;
        } catch (error) {
            console.error(error)
        }
    }
}
