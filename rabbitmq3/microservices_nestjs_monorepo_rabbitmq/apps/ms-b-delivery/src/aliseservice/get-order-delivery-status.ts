import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {HttpException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Model} from "mongoose";
import {Delivery} from "../interfaces/delivery.interface";

@Injectable()
export class OrderDeliveryStatus {
    constructor(
        @Inject('DELIVERY_MODEL') private deliveryModel: Model<Delivery>,
        private readonly amqpConnection: AmqpConnection,
        // private sendOrderDetailsService: SendOrderDetailsService
    ) {}

    @RabbitSubscribe({
        exchange: 'order-delivery',
        routingKey: 'order-delivery-route',
        queue: 'order-delivery-route-queue',
    })
    async handleOrderDeliveryStatus(data: any) {
        try {
            if (data.type === 'order-delivery-status') {
                const {orderDeliverId,deliver_status} = data.data.orderDeliveryDetails
                const checkOrderDeliveryCondition = await this.handelCheckOrderDeliveryCondition(
                    orderDeliverId,
                    deliver_status
                )
                console.log('message send to order service:', checkOrderDeliveryCondition)
            }
        } catch (error){
            console.error('-----------------------------------------',error)
        }
    }
    async handelCheckOrderDeliveryCondition(orderDeliverId: any, deliver_status: any){
        try {
            const orderDeliver = await this.deliveryModel.findOne({ _id: orderDeliverId }).exec();
            if (!orderDeliver) {
                throw new NotFoundException(`Order Deliver with ID ${orderDeliverId} not found.`);
            }
            if (orderDeliver.status === deliver_status) {
                return 'delivery status already exsist'
            } else if (orderDeliver.status === 'cancelled'){
                return 'order delivery status already cancelled, not able to update'
            }
            if(deliver_status==='inprocess'){
                const updatedDeliveryOrder = await this.deliveryModel.findOneAndUpdate(
                    orderDeliverId,
                    { status: deliver_status },
                    { new: true } // Returns the updated document
                )
                if (!updatedDeliveryOrder) {
                    throw new NotFoundException(`Order with ID ${updatedDeliveryOrder} not found.`);
                }
                const { status, orderId } = updatedDeliveryOrder;
                this.amqpConnection.publish('order-delivery-status-change', 'order-delivery-status-change-route', { type: 'order-status-change', data: { status, orderId } });
                // await orderDeliver.save();
            } else if(deliver_status==='pending'){
                const updatedDeliveryOrder = await this.deliveryModel.findOneAndUpdate(
                    orderDeliverId,
                    { status: deliver_status },
                    { new: true } // Returns the updated document
                )
                if (!updatedDeliveryOrder) {
                    throw new NotFoundException(`Order with ID ${updatedDeliveryOrder} not found.`);
                }
                const { status, orderId } = updatedDeliveryOrder;
                this.amqpConnection.publish('order-delivery-status-change', 'order-delivery-status-change-route', { type: 'order-status-change', data: { status, orderId } });
            } else if(deliver_status==='shipped'){
                const updatedDeliveryOrder = await this.deliveryModel.findOneAndUpdate(
                    orderDeliverId,
                    { status: deliver_status },
                    { new: true } // Returns the updated document
                )
                if (!updatedDeliveryOrder) {
                    throw new NotFoundException(`Order with ID ${updatedDeliveryOrder} not found.`);
                }
                const { status, orderId } = updatedDeliveryOrder;
                this.amqpConnection.publish('order-delivery-status-change', 'order-delivery-status-change-route', { type: 'order-status-change', data: { status, orderId } });
            } else if(deliver_status==='cancelled'){
                const updatedDeliveryOrder = await this.deliveryModel.findOneAndUpdate(
                    orderDeliverId,
                    { status: deliver_status },
                    { new: true } // Returns the updated document
                )
                if (!updatedDeliveryOrder) {
                    throw new NotFoundException(`Order with ID ${updatedDeliveryOrder} not found.`);
                }
                const { status, orderId } = updatedDeliveryOrder;
                this.amqpConnection.publish('order-delivery-status-change', 'order-delivery-status-change-route', { type: 'order-status-change', data: { status, orderId } });
            }

            return true
        } catch (error){
            console.error(error)
        }
    }
}
