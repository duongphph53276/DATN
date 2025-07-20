import React, { useEffect, useState } from 'react';
import api from '../../../middleware/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ICategory, ICategoryResponse, ISingleCategoryResponse, IAddCategoryRequest } from '../../../interfaces/category';

const EditCategory: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [parentId, setParentId] = useState<string | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await api.get<ISingleCategoryResponse>(`admin/category/${id}`);
        if (response.data.status && response.data.data) {
          setName(response.data.data.name);
          setParentId(typeof response.data.data.parent_id === 'string' ? response.data.data.parent_id : response.data.data.parent_id?._id || null);
        } else {
          setError(response.data.message);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải danh mục');
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get<ICategoryResponse>('admin/category');
        if (response.data.status) {
          // Lọc bỏ danh mục hiện tại để không cho phép chọn chính nó làm danh mục cha
          setCategories(response.data.data.filter(category => category._id !== id) || []);
        } else {
          setError(response.data.message);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải danh mục cha');
      }
    };

    fetchCategory();
    fetchCategories();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Tên danh mục không được để trống');
      return;
    }

    try {
      const response = await api.put<ICategoryResponse>(
        `admin/category/edit/${id}`,
        { name, parent_id: parentId || null } as IAddCategoryRequest,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      if (response.data.status) {
        alert('Cập nhật danh mục thành công');
        navigate('/admin/category');
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Cập nhật danh mục thất bại';
      setError(errorMessage);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sửa danh mục</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Tên danh mục
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="parentId" className="block text-sm font-medium">
            Danh mục cha
          </label>
          <select
            id="parentId"
            value={parentId || ''}
            onChange={(e) => setParentId(e.target.value || null)}
            className="mt-1 p-2 border rounded w-full"
          >
            <option value="">Không có</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default EditCategory;