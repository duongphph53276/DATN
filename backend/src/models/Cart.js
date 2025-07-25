import mongoose, { Schema } from 'mongoose';

const CartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến người dùng
    required: true,
  },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
}, {
  timestamps: true,
});

export const CartModel = mongoose.model('Cart', CartSchema);
