// src/pages/CoupleBearPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ProductCardProps } from '../../../file/ProductCard';



const coupleProducts: ProductCardProps[] = [
  { id: '5',
    img: 'https://gaubongonline.vn/wp-content/uploads/2025/02/Gau-Bong-Cap-Doi-BearHug-Gau-Hugo-Rosie-13.jpg',
    name: 'Gấu Bông Cặp Đôi Hugo & Rosie',
    price: '285.000₫',
    size: ['25cm'],
  },
  { id: '6',
    img: 'https://gaubongonline.vn/wp-content/uploads/2025/02/Gau-Bong-Dau-Re-Capyboo-9.jpg',
    name: 'Gấu Bông Dâu Rể Capyboo',
    price: '295.000₫',
    size: ['28cm'],
  },
  { id: '7',
    img: 'https://gaubongonline.vn/wp-content/uploads/2025/01/Gau-Bong-Couple-Dau-Re-Tho-Snowy-7.jpg',
    name: 'Gấu Bông Dâu Rể Thỏ Snowy',
    price: '295.000₫',
    size: ['25cm'],
  },
   { id: '8',
    img: 'https://gaubongonline.vn/wp-content/uploads/2025/01/Gau-Bong-Cap-Doi-BearHug-Tho-Bunny-Daisy-8.jpg',
    name: 'Gấu Bông Cặp Đôi BearHug – Thỏ Bunny & Daisy ',
    price: '285.000₫',
    size: ['25cm'],
  },

];

const CoupleBearPage: React.FC = () => {
  return (
    <div className="px-6 py-10 bg-white min-h-screen">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-10">
        💑 Gấu Bông Couple Dễ Thương 💑
      </h1>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
  {coupleProducts.map((item) => (
    <div
      key={item.id}
      className="bg-white border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 flex flex-col h-full"
    >
      <img
        src={item.img}
        alt={item.name}
        className="w-full h-52 object-cover rounded-xl mb-4"
      />
      <div className="flex-1 flex flex-col text-center items-center">
        <h2 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h2>
        <p className="text-green-500 text-lg font-semibold mb-3">{item.price}</p>
        
        <div className="mt-auto">
          <Link
            to="/checkout"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-pink-400 to-rose-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:from-pink-500 hover:to-rose-600 focus:outline-none"
          >
            Mua ngay
          </Link>
        </div>
      </div>
    </div>
  ))}
</div>


      <div className="my-12 text-center">
        <h2 className="text-2xl font-bold text-pink-500">💘 Một cặp đôi - Một món quà ý nghĩa 💘</h2>
        <p className="text-gray-600 mt-2">
          Gấu bông couple là món quà tuyệt vời cho những dịp đặc biệt như Valentine, kỷ niệm, sinh nhật 💝
        </p>

        <img
          src="https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m3eqjlhn0v5h95_tn.webp"
          alt="Couple Bear"
          className="mx-auto mt-6 w-72 h-auto object-contain"
        />

        <div className="flex justify-center mt-6">
          <div className="w-24 h-1 bg-pink-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default CoupleBearPage;
