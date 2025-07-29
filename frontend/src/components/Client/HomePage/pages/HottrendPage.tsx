// src/pages/HotTrendPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Hottrend } from '../../../file/HotTrendProductList';



const hottrendProducts: Hottrend[] = [
  {      id : '17',
        img: "https://gaubongonline.vn/wp-content/uploads/2025/03/Gau-Bong-Canh-Cut-Ca-Tim-3.jpg",
        name: "Gấu Bông Cánh Cụt Cà Tím",
        price: "155.000₫",
        size: ["25cm", "40cm", "70cm"],
      },
      {      id : '18',
        img: "https://gaubongonline.vn/wp-content/uploads/2024/05/Canh-cut-deo-yem-1-1.jpg",
        name: "Cánh Cụt Đeo Yếm",
        price: "135.000₫",
        size: ["30cm", "45cm", "60cm", "80cm", "1m5"],
      },
      {      id : '19',
        img: "https://gaubongonline.vn/wp-content/uploads/2024/08/Gau-Bong-Stitch-Om-Vit-4.jpg",
        name: "Gấu Bông Stitch Ôm Vịt",
        price: "195.000₫",
        size: ["28cm", "45cm", "60cm", "80cm"],
      },
      {      id : '20',
        img: "https://gaubongonline.vn/wp-content/uploads/2024/10/Gau-Bong-Thu-Mo-Vit-6.jpg",
        name: "Gấu Bông Thú Mỏ Vịt",
        price: "535.000₫",
        size: ["1m", "65cm"],
      },

];


const HotTrendPage: React.FC = () => {
  return (
    <div className="px-6 py-10 bg-white min-h-screen">
      <h1 className="text-3xl font-extrabold text-center text-red-500 mb-10">
        🔥 GẤU BÔNG HOT TREND 2025 🔥
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {hottrendProducts.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 flex flex-col items-center text-center"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-52 object-cover rounded-xl mb-4 transform hover:scale-105 transition"
            />
            <h2 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h2>
            <p className="text-green-500 text-lg font-semibold mb-3">{item.price}</p>
            <Link
              to="/checkout"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:from-orange-500 hover:to-red-600 focus:outline-none"
            >
              Mua ngay
            </Link>
          </div>
        ))}
      </div>

      <div className="my-12 text-center">
        <h2 className="text-2xl font-bold text-orange-500">🔥 Đừng bỏ lỡ xu hướng!</h2>
        <p className="text-gray-600 mt-2">
          Những mẫu gấu bông hot trend được yêu thích và viral khắp mạng xã hội. Nhanh tay kẻo hết hàng!
        </p>

        <img
          src="https://upload.bemori.vn/thu-bong/thu-bong-khac/gau-ngoi-om-qua/gau-ngoi-om-qua-2.webp"
          alt="Hot Trend Teddy"
          className="mx-auto mt-6 w-72 h-auto object-contain"
        />

        <div className="flex justify-center mt-6">
          <div className="w-24 h-1 bg-orange-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default HotTrendPage;
