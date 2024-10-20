import {Controller, Get, Inject, Post, Body} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";

@Controller('product')
export class ProductController {
    constructor(
        @Inject('PRODUCT_SERVICE') private readonly client:ClientProxy,
        @Inject('PRODUCT_SERVICE2') private readonly client2:ClientProxy
    ) {}
    @Post('custom1')
    all(@Body() data: any){
        // console.log(data);
        this.client.emit('hello',data)
        this.client2.emit('hello',data)
        return {
            message: 'Hello, this is a simple JSON response!',
        }
    }
    // @Post('custom1')
    // all2(@Body() data: any){
    //     // console.log(data);
    //     this.client.emit('client2',data)
    //     return {
    //         message: 'Hello, this is a simple JSON response!',
    //     }
    // }
}
