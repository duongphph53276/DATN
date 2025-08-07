import mongoose, { Schema } from 'mongoose';

const OrderDetailSchema = new Schema({
  order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  product_id: { type: String, required: true },
  variant_id: { type: String, required: false },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
});

export const OrderDetailModel = mongoose.model('OrderDetail', OrderDetailSchema);
