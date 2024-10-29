import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {HttpException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Model} from "mongoose";
import {Order} from "../interfaces/order.interface";

@Injectable()
export class OrderStatusChange {
    constructor(
        @Inject('ORDER_MODEL') private orderModel: Model<Order>,
        private readonly amqpConnection: AmqpConnection,
        // private sendOrderDetailsService: SendOrderDetailsService
    ) {}

    @RabbitSubscribe({
        exchange: 'order-delivery-status-change',
        routingKey: 'order-delivery-status-change-route',
        queue: 'order-delivery-status-change-route-queue',
    })
    async handleOrderStatusChange(data: any) {
        try {
            if (data.type === 'order-status-change') {
                const {status, orderId} = data.data

                const currentdOrderCheck = await this.orderModel.findById({_id: orderId}).exec();
                if (!currentdOrderCheck) {
                    throw new NotFoundException(`Order with ID ${orderId} not found.`);
                }
                console.log(currentdOrderCheck)
                const { status:currentStatus, itemId, quantity } = currentdOrderCheck;
                if (currentStatus !== 'cancelled'){
                    if(status === 'cancelled'){
                        // console.log(status)
                        const updatedOrder = await this.orderModel.findOneAndUpdate(
                            {_id: orderId},
                            { status: status },
                            { new: true, useFindAndModify: false } // Returns the updated document
                        ).exec();
                        if (!updatedOrder) {
                            throw new NotFoundException(`Order with ID ${orderId} not found.`);
                        }
                        this.amqpConnection.publish('order-cancel-stock-back', 'order-cancel-stock-back-route', { type: 'order-cancel-stock-back-type', data: { itemId, quantity } });
                    } else {
                        const updatedOrder = await this.orderModel.findOneAndUpdate(
                            {_id: orderId},
                            { status: status },
                            { new: true, useFindAndModify: false } // Returns the updated document
                        ).exec();
                        if (!updatedOrder) {
                            throw new NotFoundException(`Order with ID ${orderId} not found.`);
                        }
                    }
                } else {
                    console.log("update isn't possible")
                    // const updatedOrder = await this.orderModel.findOneAndUpdate(
                    //     {_id: orderId},
                    //     { status: status },
                    //     { new: true, useFindAndModify: false } // Returns the updated document
                    // ).exec();
                    // if (!updatedOrder) {
                    //     throw new NotFoundException(`Order with ID ${orderId} not found.`);
                    // }
                }
            }
        } catch (error){
            console.error(error)
        }
    }
    // async handelCheckOrderDeliveryCondition(orderDeliverId: any, deliver_status: any){
    //     try {
    //         const orderDeliver = await this.deliveryModel.findOne({ _id: orderDeliverId }).exec();
    //         if (!orderDeliver) {
    //             throw new NotFoundException(`Order Deliver with ID ${orderDeliverId} not found.`);
    //         }
    //         if (orderDeliver.status === deliver_status) {
    //             return 'delivery status already exsist'
    //         }
    //         if(deliver_status==='inprocess'){
    //             await this.deliveryModel.findByIdAndUpdate(
    //                 orderDeliverId,
    //                 { status: deliver_status },
    //                 { new: true } // Returns the updated document
    //             )
    //             this.amqpConnection.publish('order-delivery-status-change', 'order-delivery-status-change-route', { type: 'order-delivery-status-change-status', data: { deliver_status } });
    //             // await orderDeliver.save();
    //         } else if(deliver_status==='pending'){
    //             await this.deliveryModel.findByIdAndUpdate(
    //                 orderDeliverId,
    //                 { status: deliver_status },
    //                 { new: true } // Returns the updated document
    //             )
    //         }
    //         return true
    //     } catch (error){
    //         console.error(error)
    //     }
    // }
}
