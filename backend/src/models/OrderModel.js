import mongoose, { Schema } from 'mongoose';

const OrderSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Tham chiếu đến mô hình User
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'shipping', 'delivered', 'cancelled'],
      default: 'pending',
    },
    quantity: {
      type: Number,
      required: true,
      min: 0, // Ngăn giá trị âm
    },
    total_amount: {
      type: Number,
      required: true,
      min: 0, // Ngăn giá trị âm
    },
    voucher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Voucher', // Tham chiếu đến mô hình Voucher
      default: null,
    },
    payment_method: {
      type: String,
      required: true,
      enum: ['credit_card', 'debit_card', 'bank_transfer', 'e_wallet', 'cod'], // Thêm enum nếu cần
    },
    address_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address', // Tham chiếu đến mô hình Address
      required: true,
    },
    shipper_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Tham chiếu đến mô hình User (shipper là một user)
      default: null,
    },
    delivered_at: {
      type: Date,
      default: null,
    },
    cancel_reason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Thêm index để cải thiện hiệu suất
OrderSchema.index({ user_id: 1 });
OrderSchema.index({ voucher_id: 1 });
OrderSchema.index({ status: 1 });

export const OrderModel = mongoose.model('Order', OrderSchema);