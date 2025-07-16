

// pages/Category.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

interface CategoryItem {
  id: string;
  name: string;
  image: string;
  value: string; // dùng cho lọc hoặc query
}

// Dữ liệu danh mục mẫu
const categories: CategoryItem[] = [
  {
    id: "1",
    name: "Gấu Couple",
    value: "couple",
    image: "/images/categories/couple.jpg",
  },
  {
    id: "2",
    name: "Gấu Mini",
    value: "mini",
    image: "/images/categories/mini.jpg",
  },
  {
    id: "3",
    name: "Gấu Lớn",
    value: "big",
    image: "/images/categories/big.jpg",
  },
];

const Category: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = (categoryValue: string) => {
    // Chuyển đến trang sản phẩm kèm theo query lọc
    navigate(`/products?category=${categoryValue}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        🧸 Danh mục gấu bông
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleClick(cat.value)}
            className="cursor-pointer bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 text-center font-semibold text-lg text-gray-800">
              {cat.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
