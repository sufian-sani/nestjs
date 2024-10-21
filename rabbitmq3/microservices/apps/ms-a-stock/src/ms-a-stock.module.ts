import { Module } from '@nestjs/common';
import { MsAStockController } from './ms-a-stock.controller';
import { MsAStockService } from './ms-a-stock.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import {databaseProviders} from "./ms-a-stock.database.provider";

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'mailbox',
          type: 'topic',
        },
      ],
      uri: 'amqp://localhost:5672',
    }),
    MsAStockModule
  ],
  controllers: [MsAStockController],
  providers: [
      MsAStockService,
      ...databaseProviders,
  ],
})
export class MsAStockModule {}
