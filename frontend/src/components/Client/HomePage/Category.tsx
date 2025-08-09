import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../../../../api/category.api';
import { ToastSucess, ToastError } from "../../../utils/toast";

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  parent_id: string | null;
}

const Category: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories();
        // Chỉ lấy danh mục cha
        setCategories(response.data?.data.filter((cat: CategoryItem) => !cat.parent_id) || []);
      } catch (error) {
        console.error('Lỗi khi tải danh mục:', error);
        ToastError('Không thể tải danh mục. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleClick = (slug: string) => {
    navigate(`/products?category=${slug}`);
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Đang tải danh mục...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        🧸 Danh mục gấu bông
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {categories.length === 0 ? (
          <p className="text-center text-gray-500">Không có danh mục nào.</p>
        ) : (
          categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => handleClick(cat.slug)}
              className="cursor-pointer bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={cat.image || '/images/placeholder.jpg'}
                alt={cat.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center font-semibold text-lg text-gray-800">
                {cat.name}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Category;