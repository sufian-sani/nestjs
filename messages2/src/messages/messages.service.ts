import { writeFile, readFile } from 'fs/promises';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class MessagesService {
    async getAllMessages() {
        const data = await readFile('data.json', 'utf-8');
        return JSON.parse(data);
    }
    async createMessage(body: string){
        const data = await readFile('data.json', 'utf-8');
        const messages = JSON.parse(data);
        const id = Math.floor(Math.random()*999)
        messages[id] = {id, body}
        writeFile('data.json', JSON.stringify(messages))
        return messages[id]
    }
    async getMessageById(id){
        const data = await readFile('data.json', 'utf-8');
        const messages = JSON.parse(data);
        const message = messages[id]
        if (!message){
            throw new NotFoundException("ID didn't found");
        }
        return message
    }
}
