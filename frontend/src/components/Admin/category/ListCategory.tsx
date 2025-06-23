import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ICategory, ICategoryResponse } from '../../../interfaces/category';

const ListCategory: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<ICategoryResponse>('http://localhost:5000/category');
        if (response.data.status) {
          // Sắp xếp danh mục: danh mục con (có parent_id) ở trên, danh mục cha (parent_id null) ở dưới
          const sortedCategories = response.data.data.sort((a, b) => {
            if (a.parent_id && !b.parent_id) return -1; // Ưu tiên danh mục con
            if (!a.parent_id && b.parent_id) return 1; // Đưa danh mục cha xuống dưới
            return a.name.localeCompare(b.name); // Sắp xếp theo tên nếu cùng cấp
          });
          setCategories(sortedCategories || []);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Không thể tải danh mục');
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/category/${id}`);
        if (response.data.status) {
          setCategories(categories.filter((category) => category._id !== id));
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Xóa danh mục thất bại');
      }
    }
  };

  // Hàm để hiển thị tên danh mục với thụt đầu dòng cho danh mục con
  const renderCategoryName = (category: ICategory) => {
    const indent = category.parent_id ? '— ' : ''; // Thụt đầu dòng cho danh mục con
    return `${indent}${category.name}`;
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
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Danh mục cha</th>
            <th className="py-2 px-4 border">Tên</th>
            <th className="py-2 px-4 border">Slug</th>
            <th className="py-2 px-4 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td className="py-2 px-4 border">
                {typeof category.parent_id === 'object' && category.parent_id ? category.parent_id.name : 'Không có'}
              </td>
              <td className="py-2 px-4 border">{renderCategoryName(category)}</td>
              <td className="py-2 px-4 border">{category.slug}</td>
              <td className="py-2 px-4 border">
                <Link
                  to={`/admin/category/edit/${category._id}`}
                  className="text-blue-500 hover:underline mr-2"
                >
                  Sửa
                </Link>
                <button
                  onClick={() => handleDelete(category._id!)}
                  className="text-red-500 hover:underline"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListCategory;