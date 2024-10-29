import * as mongoose from 'mongoose';

export const DeliverySchema = new mongoose.Schema({
  orderId: String,
  status: String,
});
