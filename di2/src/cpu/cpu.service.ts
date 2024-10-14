import { Injectable } from '@nestjs/common';
import {PowerService} from "../power/power.service";

@Injectable()
export class CpuService {
    constructor(private powerService: PowerService) {}
    getCpuService(watt: number) {
        this.powerService.getPower(watt)
        console.log('Cpu Service')
        return 'from cpu service';
    }
}
