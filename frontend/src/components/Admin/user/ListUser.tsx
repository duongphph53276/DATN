import React, { useState, useEffect } from 'react';
import api from '../../../middleware/axios';

const ListUser: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        // Kiểm tra và trích xuất mảng data từ response
        if (response.data && Array.isArray(response.data.data)) {
          setUsers(response.data.data);
        } else {
          setError('Dữ liệu người dùng không hợp lệ');
        }
      } catch (err: any) {
        setError('Failed to fetch users: ' + (err.response?.data?.message || err.message));
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Danh sách User</h1>
      {error && <p className="text-red-500">{error}</p>}
      {users.length === 0 && !error && <p>Không có người dùng nào.</p>}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user._id} className="border">
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role_id?.name || 'N/A'}</td>
              <td className="p-2">{user.status}</td>
              <td className="p-2">
                <a href={`/admin/users/edit/${user._id}`} className="text-blue-500 hover:underline">Edit</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListUser;