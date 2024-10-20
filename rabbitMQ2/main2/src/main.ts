import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice(AppModule, {
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ['amqp://localhost:5672'], // RabbitMQ URL
  //     queue: 'main_queue', // Name of the queue
  //     queueOptions: {
  //       durable: false, // Change to true if you want persistence across restarts
  //     },
  //   },
  // });
  // await app.listenAsync()
  // console.log('Microservice is listening on main_queue')
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'main_queue2',
      queueOptions: {
        durable: false
      },
    },
  });
  await app.listen();
}

bootstrap();
