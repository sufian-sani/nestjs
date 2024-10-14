import { Injectable } from '@nestjs/common';

@Injectable()
export class PowerService {
    getPower(watt: number) {
        console.log(`Get power ${watt}`);
    }
}
