import { Injectable } from '@nestjs/common';
import {CpuService} from "../cpu/cpu.service";
import {DiskService} from "../disk/disk.service";

@Injectable()
export class ComputerService {
    constructor(
        private cpuService: CpuService,
        private diskService: DiskService,
    ) {}
    getComputer(){
        this.cpuService.getCpuService(155)
        this.diskService.getDiskService(177)
    }
}
