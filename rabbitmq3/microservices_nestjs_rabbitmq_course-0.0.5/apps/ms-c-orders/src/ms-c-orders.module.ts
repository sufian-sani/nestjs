import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module, DynamicModule } from '@nestjs/common';
import { MsCOrdersController } from './ms-c-orders.controller';
import { databaseProviders } from './ms-c-orders.database.provider';
import { MsCOrdersService } from './ms-c-orders.service';
import {modelProviders} from "./ms-c-orders.model.provider";
import {StockCheckByServiceService} from "./aliceservice/productstock-check.service";

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
    ...databaseProviders,
    ...modelProviders,
  ],
})
export class MsCOrdersModule { }

