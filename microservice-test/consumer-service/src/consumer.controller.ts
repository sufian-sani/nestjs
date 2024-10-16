import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class ConsumerController {
    @MessagePattern('message_pattern')
    handleMessage(data: any) {
        console.log('Message received:', data);
    }
}
