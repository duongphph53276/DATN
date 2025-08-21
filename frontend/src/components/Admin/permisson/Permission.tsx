import React, { useState, useEffect } from 'react';
import api from '../../../middleware/axios';
import { usePermissions } from '../../../hooks/usePermissions';

interface Role {
  _id: string;
  name: string;
  description: string;
}

interface Permission {
  _id: string;
  name: string;
  description: string;
}

interface RolePermission {
  _id: string;
  role_id: string;
  permission_id: Permission;
}

const PermissionManagement: React.FC = () => {
  const { hasPermission, isAdmin } = usePermissions();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [rolePermissions, setRolePermissions] = useState<Permission[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDuplicates, setShowDuplicates] = useState(false);

  useEffect(() => {
    fetchPermissions();
    fetchRoles();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      fetchRolePermissions(selectedRole);
      fetchAvailablePermissions(selectedRole);
    }
  }, [selectedRole]);

  const fetchPermissions = async () => {
    try {
      const response = await api.get('/permissions');
      setPermissions(response.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchRolePermissions = async (roleId: string) => {
    try {
      const response = await api.get(`/roles/${roleId}/permissions`);
      setRolePermissions(response.data || []);
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      setRolePermissions([]);
    }
  };

  const fetchAvailablePermissions = async (roleId: string) => {
    try {
      const response = await api.get(`/roles/${roleId}/available-permissions`);
      setAvailablePermissions(response.data || []);
    } catch (error) {
      console.error('Error fetching available permissions:', error);
      setAvailablePermissions([]);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name, description };
    try {
      if (editingId) {
        await api.put(`/permissions/${editingId}`, data);
      } else {
        await api.post('/permissions/create', data);
      }
      setName('');
      setDescription('');
      setEditingId(null);
      fetchPermissions();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (permission: Permission) => {
    setName(permission.name);
    setDescription(permission.description);
    setEditingId(permission._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/permissions/${id}`);
      fetchPermissions();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAssignPermission = async (permissionId: string) => {
    try {
      await api.post('/roles/assign-permission', {
        role_id: selectedRole,
        permission_id: permissionId
      });
      fetchRolePermissions(selectedRole);
      fetchAvailablePermissions(selectedRole);
    } catch (error) {
      console.error('Error assigning permission:', error);
    }
  };

  const handleRemovePermission = async (permissionId: string) => {
    try {
      await api.delete(`/roles/${selectedRole}/permissions/${permissionId}`);
      fetchRolePermissions(selectedRole);
      fetchAvailablePermissions(selectedRole);
    } catch (error) {
      console.error('Error removing permission:', error);
    }
  };

  const handleCleanupDuplicates = async () => {
    try {
      // Tìm permissions trùng lặp dựa trên mô tả
      const descriptionGroups = {};
      permissions.forEach(permission => {
        if (permission.description) {
          const desc = permission.description.trim();
          if (!descriptionGroups[desc]) {
            descriptionGroups[desc] = [];
          }
          descriptionGroups[desc].push(permission);
        }
      });

      // Lọc ra những nhóm có nhiều hơn 1 permission
      const duplicateGroups = Object.values(descriptionGroups).filter(group => group.length > 1);
      
      if (duplicateGroups.length === 0) {
        alert('Không có permissions trùng lặp để dọn dẹp!');
        return;
      }

      const totalDuplicates = duplicateGroups.reduce((sum, group) => sum + group.length - 1, 0);
      const uniqueDescriptions = duplicateGroups.length;

      if (!confirm(`Tìm thấy ${totalDuplicates} permissions trùng lặp (${uniqueDescriptions} loại). Bạn có muốn xóa chúng không?\n\nLưu ý: Hệ thống sẽ tự động chuyển các role permissions sang permission gốc trước khi xóa.`)) {
        return;
      }

      let totalDeleted = 0;

      // Xóa permissions trùng lặp (giữ lại bản đầu tiên)
      for (const group of duplicateGroups) {
        const toKeep = group[0]; // Giữ lại bản đầu tiên
        const toDelete = group.slice(1); // Xóa các bản còn lại

        for (const permission of toDelete) {
          try {
            // Xóa permission (backend sẽ tự động xử lý role permissions)
            await api.delete(`/permissions/${permission._id}`);
            totalDeleted++;
          } catch (error) {
            console.error(`Error deleting permission ${permission._id}:`, error);
          }
        }
      }

      alert(`Đã xóa ${totalDeleted} permissions trùng lặp thành công!`);
      fetchPermissions(); // Refresh danh sách
      fetchRoles(); // Refresh roles nếu cần
    } catch (error) {
      console.error('Error cleaning up duplicates:', error);
      alert('Có lỗi xảy ra khi dọn dẹp permissions!');
    }
  };

  const selectedRoleData = roles.find(role => role && role._id === selectedRole);

  // Tìm permissions trùng lặp dựa trên mô tả
  const descriptionGroups = {};
  permissions.forEach(permission => {
    if (permission.description) {
      const desc = permission.description.trim();
      if (!descriptionGroups[desc]) {
        descriptionGroups[desc] = [];
      }
      descriptionGroups[desc].push(permission);
    }
  });

  const duplicateGroups = Object.values(descriptionGroups).filter(group => group.length > 1);
  const uniqueDuplicates = duplicateGroups.length;
  const totalDuplicates = duplicateGroups.reduce((sum, group) => sum + group.length - 1, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Quản lý Phân quyền</h2>
        <span className="text-gray-500">Xin chào, Admin</span>
      </div>

      {/* Tạo Permission mới */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Tạo Permission mới</h3>
        <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên permission (VD: view_users)"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full md:w-auto bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            {editingId ? 'Cập nhật' : 'Tạo Permission'}
          </button>
        </form>
      </div>

      {/* Danh sách Permission */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Danh sách Permission</h3>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Tổng số: {permissions.filter(perm => perm && perm.name).length}
            </div>
                         {uniqueDuplicates > 0 && (
               <div className="text-sm text-red-600">
                 ⚠️ {totalDuplicates} permissions trùng lặp ({uniqueDuplicates} loại)
               </div>
             )}
                         <button
               onClick={() => {
                 // Debug: In ra tất cả permissions để kiểm tra
                 console.log('All permissions:', permissions);
                 
                 // Tìm trùng lặp theo tên
                 const nameGroups = {};
                 permissions.forEach(permission => {
                   if (permission.name) {
                     const name = permission.name.trim();
                     if (!nameGroups[name]) {
                       nameGroups[name] = [];
                     }
                     nameGroups[name].push(permission);
                   }
                 });
                 
                 const nameDuplicates = Object.values(nameGroups).filter(group => group.length > 1);
                 console.log('Name duplicates:', nameDuplicates);
                 
                 // Tìm trùng lặp theo mô tả
                 const descGroups = {};
                 permissions.forEach(permission => {
                   if (permission.description) {
                     const desc = permission.description.trim();
                     if (!descGroups[desc]) {
                       descGroups[desc] = [];
                     }
                     descGroups[desc].push(permission);
                   }
                 });
                 
                 const descDuplicates = Object.values(descGroups).filter(group => group.length > 1);
                 console.log('Description duplicates:', descDuplicates);
                 
                 // Hiển thị kết quả
                 alert(`Tìm thấy:\n- ${nameDuplicates.length} nhóm trùng tên\n- ${descDuplicates.length} nhóm trùng mô tả\n\nKiểm tra console để xem chi tiết!`);
                 
                 setShowDuplicates(!showDuplicates);
               }}
               className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
             >
               {showDuplicates ? 'Ẩn' : 'Xem'} trùng lặp
             </button>
            <button
              onClick={handleCleanupDuplicates}
              className="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600"
            >
              Dọn dẹp trùng lặp
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {permissions.filter(perm => perm && perm.name).map((perm) => (
            <div key={perm._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">{perm.name}</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(perm)}
                    className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                  >
                    Sửa
                  </button>
                  {(isAdmin() || hasPermission('delete_permission')) && (
                    <button
                      onClick={() => handleDelete(perm._id)}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">{perm.description}</p>
            </div>
          ))}
        </div>

                 {/* Hiển thị permissions trùng lặp */}
         {showDuplicates && uniqueDuplicates > 0 && (
           <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
             <h4 className="font-medium text-red-800 mb-3">
               Permissions trùng lặp ({uniqueDuplicates} loại):
             </h4>
             <div className="space-y-3">
               {duplicateGroups.map((group, index) => (
                                 <div key={index} className="border border-red-300 rounded p-3 bg-white">
                   <div className="font-medium text-red-700 mb-2">
                     "{group[0].description}" - {group.length} bản sao:
                   </div>
                   <div className="space-y-1">
                     {group.map((perm, i) => (
                      <div key={perm._id} className="flex justify-between items-center text-sm">
                        <span>
                          {i + 1}. ID: {perm._id} - {perm.description}
                        </span>
                        <span className="text-gray-500">
                          {new Date(perm.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chọn Role và Quản lý Permission */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Phân quyền cho Role</h3>
        
        {/* Chọn Role */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn Role:
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn Role --</option>
            {roles.filter(role => role && role.name).map(role => (
              <option key={role._id} value={role._id}>{role.name}</option>
            ))}
          </select>
        </div>

        {selectedRole && selectedRoleData && selectedRoleData.name && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Permissions đã được gán */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">
                Permissions đã gán cho {selectedRoleData.name}:
              </h4>
              <div className="space-y-2">
                {rolePermissions.filter(permission => permission && permission.name).length > 0 ? (
                  rolePermissions.filter(permission => permission && permission.name).map((permission) => (
                    <div key={permission._id} className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-md">
                      <div>
                        <span className="font-medium text-green-800">{permission.name}</span>
                        <p className="text-sm text-green-600">{permission.description}</p>
                      </div>
                      <button
                        onClick={() => handleRemovePermission(permission._id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        Xóa
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Chưa có permission nào được gán</p>
                )}
              </div>
            </div>

            {/* Permissions có thể gán */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">
                Permissions có thể gán:
              </h4>
              <div className="space-y-2">
                {availablePermissions.filter(permission => permission && permission.name).length > 0 ? (
                  availablePermissions.filter(permission => permission && permission.name).map((permission) => (
                    <div key={permission._id} className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div>
                        <span className="font-medium text-blue-800">{permission.name}</span>
                        <p className="text-sm text-blue-600">{permission.description}</p>
                      </div>
                      <button
                        onClick={() => handleAssignPermission(permission._id)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        Gán
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Tất cả permissions đã được gán</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionManagement;