import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import NoPermission from './NoPermission';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission, 
  fallbackPath = '/admin' 
}) => {
  const { hasPermission, isAdmin, loading, userInfo } = usePermissions();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Nếu không có user info, chuyển về trang login
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có yêu cầu permission cụ thể và user không có quyền
  if (requiredPermission) {
    if (requiredPermission === 'admin') {
      if (!isAdmin()) {
        return <NoPermission message="Bạn cần quyền admin để truy cập trang này" />;
      }
    } else if (!hasPermission(requiredPermission)) {
      return <NoPermission message={`Bạn cần quyền "${requiredPermission}" để truy cập trang này`} />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 