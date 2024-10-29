import { Module,DynamicModule } from '@nestjs/common';
import { MsAStockController } from './ms-a-stock.controller';
import { MsAStockService } from './ms-a-stock.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { databaseProviders } from './ms-a-stock.database.provider';
import { modelProviders } from './ms-a-stock.model.provider';
import {StockCheckService} from "./aliceservice/check-product-stock.service";
import {StockConfirmationMessageService} from "./aliceservice/stock-confirmation-message";
import {StockBackService} from "./aliceservice/get-stock-back";

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'stock',
          type: 'topic',
        },
      ],
      uri: 'amqp://localhost:5672',
    }) as DynamicModule,
    MsAStockModule,
  ],
  controllers: [MsAStockController],
  providers: [
    MsAStockService,
    StockCheckService,
    StockConfirmationMessageService,
    StockBackService,
    ...databaseProviders,
    ...modelProviders,
  ],
})
export class MsAStockModule { }