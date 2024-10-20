import {Injectable} from '@nestjs/common';

@Injectable()
export class ProductService {

    getProducts() {
        return 'get all product from main'
    }
}
