import {Body, Controller, Get, NotFoundException, Param, Post} from '@nestjs/common';
import {CreateMessageDto} from "./dtos/create-message.dto";
import {MessagesService} from "./messages.service";

@Controller('messages')
export class MessagesController {
    // messagesService: MessagesService;
    constructor(public  messagesService: MessagesService) {}
    @Get()
    listMessages(){
        return this.messagesService.findAll();
    }
    @Post()
    createMessages(@Body() body:CreateMessageDto){
        return this.messagesService.create(body.content)
    }
    @Get('/:id')
    async getMessage(@Param('id') id:string){
        const message = await this.messagesService.findOne(id);
        if(!message){
            throw new NotFoundException("Not Found");
        }
        return message
    }
}
