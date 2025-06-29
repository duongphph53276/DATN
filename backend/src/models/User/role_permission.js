import mongoose, { Schema } from 'mongoose';

const RolePermissionSchema = new Schema({
  role_id: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  permission_id: { type: Schema.Types.ObjectId, ref: 'Permission', required: true },
}, {
  timestamps: true
});

export const RolePermissionModel = mongoose.model('Role_Permission', RolePermissionSchema);
