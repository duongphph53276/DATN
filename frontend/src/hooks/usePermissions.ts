import { useState, useEffect } from 'react';
import api from '../middleware/axios';

interface Permission {
  _id: string;
  name: string;
  description: string;
}

interface UserWithPermissions {
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    status: string;
    role: {
      _id: string;
      name: string;
      description: string;
    };
  };
  permissions: Permission[];
}

export const usePermissions = () => {
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPermissions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Không có token');
        setLoading(false);
        return;
      }

      const response = await api.get('/user/permissions');

      const data: UserWithPermissions = response.data;
      console.log('Raw permissions from API:', data.permissions);
      // Filter out null or undefined permissions
      const validPermissions = data.permissions.filter(permission => permission && permission.name);
      console.log('Valid permissions after filtering:', validPermissions);
      setUserPermissions(validPermissions);
      setUserInfo(data.user);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi lấy thông tin quyền');
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permissionName: string): boolean => {
    return userPermissions.some(permission => permission && permission.name === permissionName);
  };

  const hasAnyPermission = (permissionNames: string[]): boolean => {
    return permissionNames.some(name => hasPermission(name));
  };

  const hasAllPermissions = (permissionNames: string[]): boolean => {
    return permissionNames.every(name => hasPermission(name));
  };

  useEffect(() => {
    fetchUserPermissions();
  }, []);

  return {
    userPermissions,
    userInfo,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refetch: fetchUserPermissions
  };
}; 