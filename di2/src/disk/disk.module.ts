import { Module } from '@nestjs/common';
import { DiskController } from './disk.controller';
import { DiskService } from './disk.service';
import {PowerModule} from "../power/power.module";

@Module({
  imports: [PowerModule],
  controllers: [DiskController],
  providers: [DiskService],
  exports: [DiskService]
})
export class DiskModule {}
