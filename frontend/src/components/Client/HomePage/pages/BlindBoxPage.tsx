// src/pages/BlindBoxPage.tsx
import React from 'react';
import { Blindbox } from '../../../file/BlindBox';
import { Link } from 'react-router-dom';
 const blindboxProduct : Blindbox []=[
  {id: '1',
    img: 'https://gaubongonline.vn/wp-content/uploads/2025/04/Blindbox-Baby-Three-Day-Treo-Dien-Thoai-5.jpg',
    name: 'Blindbox Baby Three Dây Treo Điện Thoại' ,
    price: '165.000₫',
    size: ['13cm'],
  },
  { id: '2',
    img: 'https://gaubongonline.vn/wp-content/uploads/2025/02/Gau-Bong-Baby-Three-1000-Bigsize-3.jpg',
    name: 'Blindbox Baby Three 1000% Big Size',
    price: '5.250.000₫',
  },
  { id: '3',
    img: 'https://gaubongonline.vn/wp-content/uploads/2024/12/Blindbox_Baby_Three_Tho_Macaron-1.jpg',
    name: 'Blindbox Baby Three Thỏ Macaron',
    price: '390.000₫',
  },
  { id: '4',
    img: 'https://gaubongonline.vn/wp-content/uploads/2025/04/Blindbox-Baby-Three-Happy-Day-3.jpg',
    name: 'Blindbox Baby Three Happy Day',
    price: '276.500₫',
    size: ['25cm'],
  },
 ];

const BlindBoxPage: React.FC = () => {
  return (
<div className="px-6 py-10 bg-white min-h-screen">
  <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-10">
    ✨ Sản phẩm Blindbox ✨
  </h1>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
  {blindboxProduct.map((item) => (
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
        <p className="text-green-500 text-lg font-semibold mb-3">
          {item.price.toLocaleString()}₫
        </p>

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
  <h2 className="text-2xl font-bold text-pink-500">🎁 Bạn đã chọn được hộp quà nào chưa?</h2>
  <p className="text-gray-600 mt-2">
    Mỗi blindbox là một món quà bất ngờ, dễ thương và đầy cảm xúc 💝
  </p>

  <img
    src="https://png.pngtree.com/png-clipart/20240819/original/pngtree-glass-gift-box-with-ribbon-and-teddy-beaar-in-it-png-image_15804178.png"
    alt="Blindbox Surprise"
    className="mx-auto mt-6 w-72 h-auto object-contain"
  />

  <div className="flex justify-center mt-6">
    <div className="w-24 h-1 bg-pink-400 rounded-full animate-pulse"></div>
  </div>
</div>

</div>


  );
};

export default BlindBoxPage;
