import mongoose, { Schema } from 'mongoose';

const PermissionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
}, {
  timestamps: true
});

export const PermissionModel = mongoose.model('Permission', PermissionSchema);
