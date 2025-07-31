import jwt from "jsonwebtoken";
import { UserModel } from '../models/User/user.js';
import { RolePermissionModel } from '../models/User/role_permission.js';
import { PermissionModel } from '../models/User/permission.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send({ message: "Không có token, truy cập bị từ chối", status: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Kiểm tra xem người dùng có bị cấm hay không
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).send({ message: "Người dùng không tồn tại", status: false });
    }

    if (user.status === 'block') {
      // Kiểm tra xem thời gian cấm có hết hạn chưa
      if (user.banUntil && new Date() > user.banUntil) {
        // Thời gian cấm đã hết hạn, tự động mở khóa
        await UserModel.findByIdAndUpdate(user._id, {
          status: 'active',
          banDuration: null,
          banReason: null,
          banUntil: null
        });
      } else {
        // Người dùng vẫn bị cấm
        const banMessage = user.banReason 
          ? `Tài khoản của bạn đã bị cấm. Lý do: ${user.banReason}`
          : 'Tài khoản của bạn đã bị cấm';
        
        if (user.banUntil) {
          banMessage += `. Thời gian cấm đến: ${user.banUntil.toLocaleString('vi-VN')}`;
        } else {
          banMessage += '. Thời gian cấm: Vĩnh viễn';
        }
        
        return res.status(403).send({ 
          message: banMessage, 
          status: false,
          banInfo: {
            reason: user.banReason,
            until: user.banUntil,
            duration: user.banDuration
          }
        });
      }
    }

    req.user = decoded; // Gắn thông tin từ token vào req.user
    next();
  } catch (error) {
    res.status(401).send({ message: "Xác thực thất bại", status: false });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send({ message: "Bạn không có quyền truy cập", status: false });
    }
    next();
  };
};

// Middleware kiểm tra permission cụ thể
export const requirePermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      const user = await UserModel.findById(userId).populate('role_id');
      
      if (!user || !user.role_id) {
        return res.status(403).send({ message: "Bạn không có quyền truy cập", status: false });
      }
      
      const permission = await PermissionModel.findOne({ name: permissionName });
      if (!permission) {
        return res.status(403).send({ message: "Permission không tồn tại", status: false });
      }
      
      const rolePermission = await RolePermissionModel.findOne({
        role_id: user.role_id._id,
        permission_id: permission._id
      });
      
      if (!rolePermission) {
        return res.status(403).send({ message: "Bạn không có quyền truy cập", status: false });
      }
      
      next();
    } catch (error) {
      res.status(500).send({ message: "Lỗi kiểm tra quyền", status: false });
    }
  };
};
