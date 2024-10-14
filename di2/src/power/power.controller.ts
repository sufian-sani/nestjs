import {Controller, Get} from '@nestjs/common';
import {PowerService} from "./power.service";

@Controller('power')
export class PowerController {
    constructor(private powerService: PowerService) {}
}
