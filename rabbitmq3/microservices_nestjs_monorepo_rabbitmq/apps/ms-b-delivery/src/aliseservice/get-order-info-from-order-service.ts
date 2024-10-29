import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Model} from "mongoose";
import {Delivery} from "../interfaces/delivery.interface";

@Injectable()
export class GetOrderInfoFromOrderService {
    constructor(
        @Inject('DELIVERY_MODEL') private deliveryModel: Model<Delivery>,
    ) {}

    @RabbitSubscribe({
        exchange: 'send-order-detail-service',
        routingKey: 'send-order-detail-service-route',
        queue: 'send-order-detail-service-route-queue', // Ensure the queue name is unique for this consumer
    })
    async handleGetOrderInfoFromOrderService(data: any) {
        try {
            if (data.type === 'send_order_details_service') {
                let orderData = data?.data?.data ?? data?.data
                if(!orderData) {
                    throw new NotFoundException('Order Not Found');
                }
                const newDelivery = new this.deliveryModel(orderData);
                await newDelivery.save()
            }
        } catch (error) {
            console.error(error)
        }
    }
}
