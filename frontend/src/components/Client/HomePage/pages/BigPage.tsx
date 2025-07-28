// src/pages/GiantBearPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Good } from '../../../file/Good';
import { Giant } from '../../../file/Giant';

const giantProduct : Giant[]=[
 {      id : '9',
        img:  "https://gaubongonline.vn/wp-content/uploads/2025/03/Gau-Bong-Baby-Three-Cosplay-Capybara-Khong-Lo-2.jpg",
        name: "Gấu Bông Baby Three Cosplay Capybara Khổng Lồ  ",
        price: "1.850.000₫",
    
        size: ["1m5 "],
      },
      {      id : '10',
        img: "https://gaubongonline.vn/wp-content/uploads/2025/03/Gau-Bong-Baby-Three-Cosplay-Gau-Bung-Sao-Khong-Lo-4.jpg",
        name: "Gấu Bông Baby Three Cosplay Gấu Bụng Sao Khổng Lồ ",
        price: "1.850.000₫",
      
        size: ["1m5"],
      },
      {      id : '11',
        img: "https://gaubongonline.vn/wp-content/uploads/2025/03/Gau-Bong-Baby-Three-Cosplay-Tho-Hong-Khong-Lo-1.jpg",
        name: "Gấu Bông Baby Three Cosplay Thỏ Hồng Khổng Lồ ",
        price: "2.450.000₫",
      
        size: ["1m5"],
      },
      {      id : '12',
        img: "https://gaubongonline.vn/wp-content/uploads/2025/03/Canh-Cut-Bong-Deo-Yem-Khong-Lo-5.jpg",
        name: "Gấu Bông Baby Three Thỏ Đứng Đội Nơ ",
        price: "1.650.000₫",
       
         size: ["1m5"],
      },
 ]

const GiantBearPage: React.FC = () => {
  return (
    <div className="px-6 py-10 bg-white min-h-screen">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-10">
        🐻 Gấu Bông Khổng Lồ 🐻
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {giantProduct.map((item) => (
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
              <p className="text-red-500 text-lg font-semibold mb-3">
                {item.price}
              </p>

              <div className="mt-auto">
                <Link
                  to="/checkout"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-red-400 to-orange-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:from-red-500 hover:to-orange-600 focus:outline-none"
                >
                  Mua ngay
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="my-12 text-center">
        <h2 className="text-2xl font-bold text-red-500">💝 Quà tặng khổng lồ – Tình cảm siêu to</h2>
        <p className="text-gray-600 mt-2">
          Gấu bông siêu to khổng lồ – lựa chọn hoàn hảo để thể hiện tình yêu và sự quan tâm 💌
        </p>

        <img
          src="https://anh.quatructuyen.com/media/wysiwyg/quatt/g_u-kh_ng-l_-costco-3.jpg"
          alt="Giant Bear"
          className="mx-auto mt-6 w-72 h-auto object-contain"
        />

        <div className="flex justify-center mt-6">
          <div className="w-24 h-1 bg-red-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default GiantBearPage;
