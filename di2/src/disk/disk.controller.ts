import {Controller, Get} from '@nestjs/common';
import {DiskService} from "./disk.service";

@Controller('disk')
export class DiskController {
    constructor(private diskService: DiskService) {}

    // @Get('get-disk')
    // getDiskService(){
    //     return this.diskService.getDiskService()
    // }
}
