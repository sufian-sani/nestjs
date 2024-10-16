import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @EventPattern('my_queue') // Listens to 'my_queue'
  handleMessage(@Payload() data: any) {
    this.logger.log(`Received message: ${JSON.stringify(data)}`);
    // Process the received message here
  }
}
