import React, { useState, useEffect } from 'react';
import { getCategoryById, editCategory } from '../../../api/category.api';
import { useParams, useNavigate } from 'react-router-dom';

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getCategoryById(id!);
        setName(res.data.data.name);
      } catch (error) {
        alert('Không tìm thấy danh mục');
      }
    };
    fetchCategory();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await editCategory(id!, { name });
      alert('Cập nhật thành công!');
      navigate('/admin/category');
    } catch (error) {
      alert('Cập nhật thất bại');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Chỉnh sửa danh mục</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
