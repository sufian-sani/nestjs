import { Document } from 'mongoose';

export interface Delivery extends Document {
  readonly orderId: string;
  readonly status: string;
}
