import { Connection } from 'mongoose';
import {DeliverySchema} from "./schemas/delivery.schema";


export const modelProviders = [
    {
        provide: 'DELIVERY_MODEL',
        useFactory: (connection: Connection) => connection.model('Delivery', DeliverySchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
