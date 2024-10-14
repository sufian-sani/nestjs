import {Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import {MessagesService} from "./messages.service";
import {CreateMessageDto} from "./dto/create-message.dto";

@Controller('messages')
export class MessagesController {
    constructor(public  messagesService: MessagesService) {}

    @Get()
    getAllMessages(){
        return this.messagesService.getAllMessages();
    }
    @Post()
    createMessage(@Body() body: CreateMessageDto){
        return this.messagesService.createMessage(body.content);
    }
    @Get('/:id')
    getMessageById(@Param('id') id: string){
        return this.messagesService.getMessageById(id);
    }
}
