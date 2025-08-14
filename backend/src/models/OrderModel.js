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
      enum: ['pending', 'preparing', 'shipping', 'delivered', 'cancelled', 'returned'],
      default: 'pending',
    },
    quantity: { type: Number, required: true },
    total_amount: { type: Number, required: true },
    shipping_fee: { type: Number, default: 0 },
    voucher_id: { type: String, default: null },
    payment_method: { type: String, required: true },
    address_id: { type: String, required: true },
    shipper_id: { type: String, default: null }, 
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
