import { Controller, Get } from '@nestjs/common';
import { ProducerService } from './producer.service';

@Controller()
export class AppController {
  constructor(private readonly producerService: ProducerService) {}

  @Get()
  async sendMessage() {
    const message = { text: 'Hello from Producer Service' };
    await this.producerService.sendMessage('message_pattern', message);
    return { status: 'Message sent successfully' };
  }
}
