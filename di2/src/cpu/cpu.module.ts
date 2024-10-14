import { Module } from '@nestjs/common';
import { CpuController } from './cpu.controller';
import { CpuService } from './cpu.service';
import {PowerModule} from "../power/power.module";

@Module({
  imports: [PowerModule],
  controllers: [CpuController],
  providers: [CpuService],
  exports: [CpuService],
})
export class CpuModule {}
