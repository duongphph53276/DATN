// src/pages/GraduationBearPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Good } from '../../../file/Good';

const goodProduct : Good[]=[
{ id: '13',
    img: 'https://gaubongonline.vn/wp-content/uploads/2025/06/gau-mac-bo-tot-nghiep-lua-2.jpg',
    name: 'Gấu Trắng Mặc Bộ Tốt Nghiệp Lụa',
    price: '125.000₫',
    size: ['25cm'],
  },
  { id: '14',
    img: 'https://gaubongonline.vn/wp-content/uploads/2025/06/gau-tot-nghiep-canh-cut-4.jpg',
    name: 'Gấu Bông Tốt Nghiệp Hoạt Hình – Cánh Cụt',
    price: '155.000₫',
    size: ['30cm'],
  },
  { id: '15',
    img: 'https://gaubongonline.vn/wp-content/uploads/2024/05/gau-bong-tot-nghiep-1.jpg',
    name: 'Gấu Tốt Nghiệp',
    price: '95.000₫',
    size: ['20cm', '30cm', '40cm'],
  },
  { id: '16',
    img: 'https://gaubongonline.vn/wp-content/uploads/2024/05/head-tot-nghiep-ao-lua-1.jpg',
    name: 'Gấu Bông Head Lông Xoắn Áo Lụa Tốt Nghiệp',
    price: '125.000₫',
    size: ['25cm', '35cm'],
  },
 ]

const GraduationBearPage: React.FC = () => {
  return (
    <div className="px-6 py-10 bg-white min-h-screen">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-10">
        🎓 Gấu Bông Tốt Nghiệp 🎓
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {goodProduct.map((item) => (
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
                {item.price}
              </p>

              <div className="mt-auto">
                <Link
                  to="/checkout"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:from-yellow-500 hover:to-amber-600 focus:outline-none"
                >
                  Mua ngay
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="my-12 text-center">
        <h2 className="text-2xl font-bold text-amber-500">🎓 Món quà ý nghĩa cho ngày lễ tốt nghiệp</h2>
        <p className="text-gray-600 mt-2">
          Hãy dành tặng những chú gấu bông tốt nghiệp như lời chúc mừng thành công rực rỡ! 🎁
        </p>

        <img
          src="https://upload.bemori.vn/gau-bong-tot-nghiep/gau-tot-nghiep-khung-anh/gau-tot-nghiep-khung-anh-13.webp"
          alt="Graduation Bear"
          className="mx-auto mt-6 w-72 h-auto object-contain"
        />

        <div className="flex justify-center mt-6">
          <div className="w-24 h-1 bg-amber-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default GraduationBearPage;
