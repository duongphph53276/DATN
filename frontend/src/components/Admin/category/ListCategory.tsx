import * as React from 'react';
import { useEffect, useState } from 'react';
import api from '../../../middleware/axios';
import { Link } from 'react-router-dom';
import { ICategory, ICategoryResponse } from '../../../interfaces/category';

const ListCategory: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<ICategoryResponse>('/admin/category');
        if (response.data.status) {
          setCategories(response.data.data || []);
        } else {
          setError(response.data.message);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải danh mục');
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      try {
        const response = await api.delete(`admin/category/${id}`);
        if (response.data.status) {
          setCategories((prev) => prev.filter((c) => c._id !== id));
        } else {
          setError(response.data.message);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Xóa danh mục thất bại');
      }
    }
  };

  // Lấy _id của danh mục cha (có thể là object hoặc string)
  const getParentId = (category: ICategory): string | null => {
    if (!category.parent_id) return null;
    if (typeof category.parent_id === 'string') return category.parent_id;
    return category.parent_id._id;
  };

  // Đệ quy xây cây danh mục
  const buildCategoryTree = (items: ICategory[], parentId: string | null = null, level = 0): JSX.Element[] => {
    return items
      .filter((item) => getParentId(item) === parentId)
      .map((item) => (
        <div key={item._id} className="ml-4">
          <div className="flex justify-between items-center py-2 border-b">
            <div className={`ml-${level * 4}`}>
              <span className={level > 0 ? 'text-gray-700' : 'font-semibold'}>
                {level > 0 && '↳'} {item.name}
              </span>
              <span className="ml-2 text-gray-400 text-sm">({item.slug})</span>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/admin/category/edit/${item._id}`}
                className="text-blue-600 hover:underline"
              >
                Sửa
              </Link>
              <button
                onClick={() => handleDelete(item._id!)}
                className="text-red-500 hover:underline"
              >
                Xóa
              </button>
            </div>
          </div>
          {buildCategoryTree(items, item._id!, level + 1)}
        </div>
      ));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách danh mục</h1>
      <Link
        to="/admin/category/add"
        className="mb-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Thêm danh mục
      </Link>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white shadow rounded p-4">
        {categories.length === 0 ? (
          <p className="text-gray-600">Chưa có danh mục nào.</p>
        ) : (
          buildCategoryTree(categories)
        )}
      </div>
    </div>
  );
};

export default ListCategory;
