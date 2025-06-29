import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../middleware/axios';

const EditUser: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [user, setUser] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role_id: '',
    address_id: '',
    avatar: '',
    status: 'active',
  });
  const [roles, setRoles] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('ID không hợp lệ');
        return;
      }
      try {
        // Lấy thông tin user
        const userResponse = await api.get(`/admin/users/${id}`);
        if (userResponse.data && userResponse.data.data) {
          const userData = userResponse.data.data;
          setUser({
            email: userData.email || '',
            password: '', // Không lấy password từ API vì đã select('-password')
            name: userData.name || '',
            phone: userData.phone || '',
            role_id: userData.role_id?._id || '',
            address_id: userData.address_id?._id || '',
            avatar: userData.avatar || '',
            status: userData.status || 'active',
          });
        } else {
          setError('Dữ liệu người dùng không hợp lệ');
        }

        // Lấy danh sách role
        const rolesResponse = await api.get('/roles');
        if (rolesResponse.data && Array.isArray(rolesResponse.data)) {
          setRoles(rolesResponse.data);
        } else {
          setError('Dữ liệu role không hợp lệ');
        }
      } catch (err: any) {
        setError('Failed to fetch data: ' + (err.response?.data?.message || err.message));
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      setError('ID không hợp lệ');
      return;
    }
    try {
      await api.put(`/admin/users/${id}`, {
        email: user.email,
        name: user.name,
        phone: user.phone,
        role_id: user.role_id,
        address_id: user.address_id,
        avatar: user.avatar,
        status: user.status,
        // Chỉ gửi password nếu có giá trị mới
        ...(user.password && { password: user.password }),
      });
      alert('User updated successfully');
    } catch (err: any) {
      setError('Failed to update user: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Edit User</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Nhập để thay đổi password"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Phone</label>
          <input
            type="text"
            value={user.phone}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Role</label>
          <select
            value={user.role_id}
            onChange={(e) => setUser({ ...user, role_id: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Chọn Role</option>
            {roles.map((role: any) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Address ID</label>
          <input
            type="text"
            value={user.address_id}
            onChange={(e) => setUser({ ...user, address_id: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Avatar</label>
          <input
            type="text"
            value={user.avatar}
            onChange={(e) => setUser({ ...user, avatar: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Status</label>
          <select
            value={user.status}
            onChange={(e) => setUser({ ...user, status: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="active">Active</option>
            <option value="block">Block</option>
          </select>
        </div>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditUser;