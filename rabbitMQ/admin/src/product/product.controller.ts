import {Controller, Get, Inject, Post, Body} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";

@Controller('product')
export class ProductController {
    constructor(
        @Inject('PRODUCT_SERVICE') private readonly client:ClientProxy
    ) {}
    @Post()
    all(@Body() data: any){
        // console.log(data);
        this.client.emit('hello',data)
        return {
            message: 'Hello, this is a simple JSON response!',
        }
    }
}
