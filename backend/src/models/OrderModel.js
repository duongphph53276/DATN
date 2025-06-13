import mongoose, { Schema } from 'mongoose';

const OrderSchema = new Schema(
  {
    user_id: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'shipping', 'delivered', 'canceled'],
      default: 'pending',
    },
    quantity: { type: Number, required: true },
    total_amount: { type: Number, required: true },
    discount_code: { type: String, default: null },
    payment_method: { type: String, required: true },
    address_id: { type: String, required: true },
    delivered_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const OrderModel = mongoose.model('Order', OrderSchema);
