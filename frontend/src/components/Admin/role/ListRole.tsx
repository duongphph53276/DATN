import React, { useState, useEffect } from 'react';
import api from '../../../middleware/axios';

const ListRole: React.FC = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get('/roles');
        if (response.data && Array.isArray(response.data)) {
          setRoles(response.data);
        } else {
          setError('Dữ liệu role không hợp lệ');
        }
      } catch (err: any) {
        setError('Failed to fetch roles: ' + (err.response?.data?.message || err.message));
      }
    };
    fetchRoles();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Danh sách Role</h1>
      {error && <p className="text-red-500">{error}</p>}
      {roles.length === 0 && !error && <p>Không có role nào.</p>}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Tên Role</th>
            <th className="p-2 border">Mô tả</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role: any) => (
            <tr key={role._id} className="border">
              <td className="p-2">{role.name}</td>
              <td className="p-2">{role.description || 'N/A'}</td>
              <td className="p-2">
                <a href={`/admin/roles/edit/${role._id}`} className="text-blue-500 hover:underline">Edit</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListRole;