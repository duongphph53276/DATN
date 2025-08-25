import mongoose, { Schema } from 'mongoose';

const OrderSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Tham chiếu đến mô hình User
      required: true,
    },
    // Lưu thông tin user tại thời điểm đặt hàng
    user_info: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      phoneNumber: { type: String, default: null }
    },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'shipping', 'delivered', 'cancelled', 'returned'],
      default: 'pending',
    },
    quantity: { type: Number, required: true },
    total_amount: { type: Number, required: true },
    shipping_fee: { type: Number, default: 0 },
    voucher_id: { type: String, default: null },
    payment_method: { type: String, required: true },
    address_id: { type: String, required: true },
    // Lưu thông tin địa chỉ tại thời điểm đặt hàng
    address_info: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postal_code: { type: String, default: null },
      country: { type: String, required: true }
    },
    shipper_id: { type: String, default: null }, 
    // Lưu thông tin shipper tại thời điểm được phân công
    shipper_info: {
      name: { type: String, default: null },
      email: { type: String, default: null },
      phone: { type: String, default: null },
      phoneNumber: { type: String, default: null }
    },
    delivered_at: { type: Date, default: null },
    cancel_reason: { type: String, default: null }, 
    return_reason: { type: String, default: null },
    cancel_request: {
      reason: { type: String, default: null }, 
      images: [{ type: String }], 
      requested_at: { type: Date, default: null },
      status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: null 
      }, 
      admin_note: { type: String, default: null }, 
      processed_at: { type: Date, default: null }
    },
    return_request: {
      reason: { type: String, default: null },
      images: [{ type: String }], 
      requested_at: { type: Date, default: null }, 
      status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: null 
      }, 
      admin_note: { type: String, default: null }, 
      processed_at: { type: Date, default: null } 
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

OrderSchema.pre('save', function(next) {
  if (this.cancel_request && !this.cancel_request.status) {
    this.cancel_request = undefined;
  }
  
  if (this.return_request && !this.return_request.status) {
    this.return_request = undefined;
  }
  
  next();
});

export const OrderModel = mongoose.model('Order', OrderSchema);
