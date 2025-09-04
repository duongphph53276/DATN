/**
 * Middleware để bảo vệ admin khỏi việc tự thay đổi role và status của mình
 */

export const preventAdminSelfModification = (req, res, next) => {
  try {
    const { role_id, status } = req.body;
    const targetUserId = req.params.id || req.user.id;
    const currentUserId = req.user.id;

    // Chỉ áp dụng khi user đang cố gắng chỉnh sửa chính mình
    if (targetUserId === currentUserId) {
      // Kiểm tra xem user hiện tại có phải admin không
      if (req.user.role === 'admin') {
        // Ngăn admin tự thay đổi role
        if (role_id !== undefined) {
          return res.status(403).json({
            status: false,
            message: 'Admin không thể tự thay đổi role của mình'
          });
        }

        // Ngăn admin tự khóa tài khoản
        if (status !== undefined && status === 'block') {
          return res.status(403).json({
            status: false,
            message: 'Admin không thể tự khóa tài khoản của mình'
          });
        }
      }
    }

    next();
  } catch (error) {
    console.error('Error in preventAdminSelfModification middleware:', error);
    next();
  }
};

/**
 * Middleware để ngăn user thay đổi role_id qua profile update
 */
export const preventRoleChangeInProfile = (req, res, next) => {
  try {
    const { role_id, status } = req.body;

    // Ngăn user thay đổi role_id qua profile update
    if (role_id !== undefined) {
      return res.status(403).json({
        status: false,
        message: 'Không thể thay đổi role qua cập nhật profile'
      });
    }

    // Ngăn user thay đổi status qua profile update
    if (status !== undefined) {
      return res.status(403).json({
        status: false,
        message: 'Không thể thay đổi trạng thái tài khoản qua cập nhật profile'
      });
    }

    next();
  } catch (error) {
    console.error('Error in preventRoleChangeInProfile middleware:', error);
    next();
  }
};
