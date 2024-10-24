import { Connection } from 'mongoose';
import { OrderSchema } from './schemas/order.schema';

export const modelProviders = [
    {
        provide: 'ORDER_MODEL',
        useFactory: (connection: Connection) => connection.model('Order', OrderSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
