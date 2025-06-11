import { useEffect, useState } from 'react';
import { getCategories, deleteCategory } from '../../../api/category.api';
import { useNavigate } from 'react-router-dom';

const ListCategory = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.data);
    } catch (error) {
      alert('Lỗi tải danh sách');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      await deleteCategory(id);
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderCategories = () => {
    const parentCategories = categories.filter((cat: any) => !cat.parent_id);
    const childCategories = categories.filter((cat: any) => cat.parent_id);

    const getChildCategories = (parentId: string) =>
      childCategories.filter((cat: any) => cat.parent_id === parentId);

    return parentCategories.map((parent: any) => (
      <div key={parent._id} className="rounded-md overflow-hidden shadow-sm border border-gray-200 bg-white mb-4">
        {/* Danh mục cha */}
        <div className="flex justify-between items-center px-4 py-3 bg-gray-100">
          <div className="font-semibold text-gray-800">
            📁 {parent.name}
            <span className="text-gray-400 text-sm ml-2">Slug: {parent.slug}</span>
            <span className="text-gray-400 text-sm ml-4">ID: {parent.category_id}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/admin/category/edit/${parent._id}`)}
              className="text-sm text-blue-600 hover:underline"
            >
              Sửa
            </button>
            <button
              onClick={() => handleDelete(parent._id)}
              className="text-sm text-red-600 hover:underline"
            >
              Xóa
            </button>
          </div>
        </div>

        {/* Danh mục con */}
        {getChildCategories(parent._id).map((child: any) => (
          <div
            key={child._id}
            className="flex justify-between items-center px-6 py-2 border-t border-gray-100 bg-white hover:bg-gray-50 transition"
          >
            <div className="text-gray-700">
                └─ {child.name}
                <span className="text-gray-400 text-sm ml-2">Slug: {child.slug}</span>
                <span className="text-gray-400 text-sm ml-4">ID: {child.category_id}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/admin/category/edit/${child._id}`)}
                className="text-sm text-blue-500 hover:underline"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(child._id)}
                className="text-sm text-red-500 hover:underline"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📚 Danh sách danh mục</h1>
        <button
          onClick={() => navigate('/admin/category/add')}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Thêm danh mục
        </button>
      </div>

      {categories.length > 0 ? (
        renderCategories()
      ) : (
        <div className="text-gray-500 text-center py-10">
          Không có danh mục nào.
        </div>
      )}
    </div>
  );
};

export default ListCategory;
