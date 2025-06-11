import React, { useState, useEffect } from 'react';
import { addCategory, getCategories } from '../../../api/category.api';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [parentId, setParentId] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories();
      const data = res.data.data;

      setCategories(data);

      const maxId = data.reduce((max: number, cat: any) => (
        cat.category_id > max ? cat.category_id : max
      ), 0);

      setCategoryId(maxId + 1);
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCategory({
        name,
        category_id: categoryId,
        parent_id: parentId || null
      });
      alert('Thêm thành công!');
      navigate('/admin/category');
    } catch (error: any) {
      alert('Lỗi: ' + error.response.data.error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Thêm danh mục mới</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Mã danh mục (category_id)</label>
          <input
            type="number"
            className="w-full p-2 border rounded bg-gray-100 text-gray-500"
            value={categoryId}
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Tên danh mục</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Nhập tên danh mục"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Danh mục cha (nếu có)</label>
          <select
            className="w-full p-2 border rounded"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
          >
            <option value="">-- Không chọn danh mục cha --</option>
            {categories.map((cat: any) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Thêm danh mục
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
