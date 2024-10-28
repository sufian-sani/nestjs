import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module, DynamicModule } from '@nestjs/common';
import { MsBDeliveryController } from './ms-b-delivery.controller';
import { MsBDeliveryService } from './ms-b-delivery.service';
import { StatusFromOrderService } from "./aliseservice/check-order-status-from-service";
import {GetOrderInfoFromOrderService} from "./aliseservice/get-order-info-from-order-service";
import {modelProviders} from "./ms-b-delivery.model.provider";
import {databaseProviders} from "./ms-b-delivery.database.provider";

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'delivery',
          type: 'topic',
        },
      ],
      uri: 'amqp://localhost:5672',
    }) as DynamicModule,
    MsBDeliveryModule,
  ],
  controllers: [MsBDeliveryController],
  providers: [
    MsBDeliveryService,
    StatusFromOrderService,
    GetOrderInfoFromOrderService,
    ...databaseProviders,
      ...modelProviders,
  ],
})
export class MsBDeliveryModule {}
