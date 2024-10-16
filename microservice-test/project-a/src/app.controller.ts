import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('producer')
export class AppController {
  constructor(@Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy) {}

  @Post('send')
  sendMessage(@Body() data: any) {
    this.client.emit('my_queue', data); // Sends a message to RabbitMQ
    return { status: 'Message sent successfully' };
  }
}
