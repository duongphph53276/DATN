import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role_id: { type: Schema.Types.ObjectId, ref: 'Role' },
  address_id: { type: Schema.Types.ObjectId, ref: 'Address' },
  avatar: { type: String },
  status: { type: String, enum: ['active', 'block'], default: 'active' },
}, {
  timestamps: true
});

export const UserModel = mongoose.model('User', UserSchema);