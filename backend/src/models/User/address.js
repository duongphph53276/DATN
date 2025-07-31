// backend/src/models/User/address.js
import mongoose, { Schema } from 'mongoose';

const AddressSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  postal_code: { type: String },
  country: { type: String, required: true },
  is_default: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export const AddressModel = mongoose.model('Address', AddressSchema);