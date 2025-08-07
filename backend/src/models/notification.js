import mongoose, { Schema } from 'mongoose';

const NotiSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  type: { type: String, required: true },
  is_read: { type: Boolean, default: false }, // Trạng thái đã đọc
  role_id: { type: Schema.Types.ObjectId, ref: 'Role' },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

export const NotiModel = mongoose.model('Notification', NotiSchema);
