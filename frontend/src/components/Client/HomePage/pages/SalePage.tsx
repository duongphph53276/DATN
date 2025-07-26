// src/pages/SalePage.tsx
import React from "react";
import { Link } from "react-router-dom";

interface SaleProduct {
  id: string;
  img: string;
  name: string;
  price: string;
  oldPrice?: string;
  size?: string[];
}

const saleProducts: SaleProduct[] = [
  {
    id: "25",
    img: "https://gaubongonline.vn/wp-content/uploads/2024/10/Gau-Bong-Raisca-Khung-Long-6.jpg",
    name: "Gấu Bông Raisca cosplay Khủng long",
    price: "142.500₫",
    oldPrice: "285.000₫",
    size: ["30cm", "40cm"],
  },
  {
    id: "26",
    img: "https://gaubongonline.vn/wp-content/uploads/2025/02/Blindbox-Baby-Three-Tho-Macaron-V2-9.jpg",
    name: "Blindbox Baby Three Macaron Ver 2",
    price: "245.000₫",
    oldPrice: "350.000₫",
    size: [],
  },
  {
    id: "27",
    img: "https://gaubongonline.vn/wp-content/uploads/2024/05/Capybara-doi-vit-deo-tui-2.jpg",
    name: "Chuột Capybara Đội Vịt Đeo Túi",
    price: "206.000₫",
    oldPrice: "295.000₫",
    size: ["35cm", "45cm"],
  },
  {
    id: "28",
    img: "https://gaubongonline.vn/wp-content/uploads/2025/01/Baby-Three-Tho-Long-Min-3.jpg",
    name: "Gấu Bông Baby Three Thỏ Đứng Đội Nơ",
    price: "92.500₫",
    oldPrice: "105.000₫",
    size: ["30cm", "40cm", "55cm", "75cm"],
  },
];

const SalePage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen px-4 py-10 sm:px-6 lg:px-12">
      <h1 className="text-3xl font-extrabold text-center text-rose-500 mb-10">
        💥 SIÊU SALE CUỐI TUẦN - GIẢM ĐẾN 50% 💥
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {saleProducts.map((item) => (
          <div
  key={item.id}
  className="bg-white border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 flex flex-col justify-between text-center h-full"
>
  <img
    src={item.img}
    alt={item.name}
    className="w-full h-52 object-cover rounded-xl mb-4 transform hover:scale-105 transition"
  />
  <div className="flex-1 flex flex-col">
    <h2 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h2>
    <div className="mb-3">
      <p className="text-red-500 text-lg font-semibold">
        {item.price} <span className="line-through text-gray-400 ml-2 text-sm">{item.oldPrice}</span>
      </p>
    </div>
    <div className="mt-auto">
      <Link
        to="/checkout"
        className="w-full inline-block rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:from-orange-500 hover:to-red-600"
      >
        Mua ngay
      </Link>
    </div>
  </div>
</div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-rose-500">🎁 Săn sale cực hời!</h2>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto">
          Gấu bông giảm giá siêu sốc, số lượng có hạn! Ưu đãi chỉ áp dụng trong thời gian ngắn.
        </p>

        <img
          src="https://upload.bemori.vn/thu-bong/gau-truc-bong/gau-truc-doi-qua/gau-truc-doi-hoa-1.webp"
          alt="Sale Teddy"
          className="mx-auto mt-6 w-72 h-auto object-contain"
        />

        <div className="flex justify-center mt-6">
          <div className="w-24 h-1 bg-rose-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SalePage;
