import { AmqpConnection,RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Model} from "mongoose";
import {Delivery} from "../interfaces/delivery.interface";

@Injectable()
export class StatusFromOrderService {
    constructor(
        private readonly amqpConnection: AmqpConnection,
        @Inject('DELIVERY_MODEL') private deliveryModel: Model<Delivery>,
    ) {}

    @RabbitSubscribe({
        exchange: 'order-status-check',
        routingKey: 'order-status-check-route',
        queue: 'order-status-check-route-queue', // Ensure the queue name is unique for this consumer
    })

    async checkStatusFromOrderService(orderId: any){
        const orderCheck = await this.deliveryModel.findOne({ orderId: orderId }).exec();
        if (!orderCheck) {
            this.amqpConnection.publish('order-status-check', 'order-status-check-route', { type: 'order-status-check', orderId });
        }
    }
}
