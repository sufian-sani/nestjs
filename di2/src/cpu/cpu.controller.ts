import { Controller, Get } from '@nestjs/common';
import {CpuService} from "./cpu.service";

@Controller('cpu')
export class CpuController {
    constructor(private cpuService: CpuService) {}

    // @Get('/get-cpu')
    // getCpuService(){
    //     return this.cpuService.getCpuService()
    // }

}
