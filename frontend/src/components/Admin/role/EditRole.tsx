import React, { useState, useEffect } from 'react';
import api from '../../../middleware/axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditRole: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await api.get(`/roles/${id}`);
        if (response.data) {
          setName(response.data.name || '');
          setDescription(response.data.description || '');
        }
      } catch (err: any) {
        setError('Failed to fetch role: ' + (err.response?.data?.message || err.message));
      }
    };
    fetchRole();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.put(`/roles/${id}`, { name, description }); // Sửa thành /roles/:id
      if (response.data) {
        navigate('/admin/roles');
      }
    } catch (err: any) {
      setError('Failed to update role: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Chỉnh sửa Role</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên Role</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mô tả</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Cập nhật Role
        </button>
      </form>
    </div>
  );
};

export default EditRole;