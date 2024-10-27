import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module, DynamicModule } from '@nestjs/common';
import { MsCOrdersController } from './ms-c-orders.controller';
import { databaseProviders } from './ms-c-orders.database.provider';
import { MsCOrdersService } from './ms-c-orders.service';
import {modelProviders} from "./ms-c-orders.model.provider";
import {StockCheckByServiceService} from "./aliceservice/productstock-check.service";
import {StockCheckResponse} from "./aliceservice/product-stock-confirmation-message";

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'orders',
          type: 'topic',
        },
      ],
      uri: 'amqp://localhost:5672',
    }) as DynamicModule,
    MsCOrdersModule,
  ],
  controllers: [MsCOrdersController],
  providers: [
    MsCOrdersService,
    StockCheckByServiceService,
    StockCheckResponse,
    ...databaseProviders,
    ...modelProviders,
  ],
})
export class MsCOrdersModule { }

