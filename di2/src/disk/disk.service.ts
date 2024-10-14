import { Injectable } from '@nestjs/common';
import {PowerService} from "../power/power.service";

@Injectable()
export class DiskService {
    constructor(private powerService: PowerService) {}
    getDiskService(watt: number){
        this.powerService.getPower(watt)
        console.log('Disk Service')
        return 'from Disk service';
    }
}
