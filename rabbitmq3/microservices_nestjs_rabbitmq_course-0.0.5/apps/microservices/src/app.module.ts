import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module, DynamicModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        { name: 'orders', type: 'topic' },
        { name: 'stock', type: 'topic' },
        { name: 'delivery', type: 'topic' },
      ],
      uri: 'amqp://localhost:5672',
    }) as DynamicModule,  // <---- Explicit type cast
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
