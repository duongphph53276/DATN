import mongoose, { Schema } from 'mongoose';

const OrderSchema = new Schema(
  {
    user_id: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'shipping', 'delivered', 'cancelled'],
      default: 'pending',
    },
    quantity: { type: Number, required: true },
    total_amount: { type: Number, required: true },
    voucher_id: { type: String, default: null },
    payment_method: { type: String, required: true },
    address_id: { type: String, required: true },
    shipper_id: { type: String, default: null }, // ID của shipper được giao hàng
    delivered_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const OrderModel = mongoose.model('Order', OrderSchema);
