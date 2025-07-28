import React from 'react';
import { Link } from 'react-router-dom';
import { Good } from '../../../file/Good';
import { Kid } from '../../../file/Kid';

const kidProducts : Kid[] = [
    {
      id: '21',
    img: 'https://gaubongonline.vn/wp-content/uploads/2025/05/tui-mu-khong-lo-1.jpg',
    name: 'Túi Mù Khổng Lồ',
    price: '399.000₫',
    oldPrice: '599.000₫',
    size: [],
  },
  { id: '22',
    img: 'https://gaubongonline.vn/wp-content/uploads/2025/05/avt-bo-thu-me-con.jpg',
    name: 'Bộ Thú Bông Mẹ Con',
    price: '325.000₫',
    size: ['30cm'],
  },
  { id: '23',
    img: 'https://gaubongonline.vn/wp-content/uploads/2025/05/bo-thu-cam-xuc-1.jpg',
    name: 'Bộ Thú Bông Cảm Xúc',
    price: '225.000₫',
    size: ['35cm', '55cm', '75cm'],
  },
  {   id: '24',
    img: 'https://gaubongonline.vn/wp-content/uploads/2025/05/avt_bo-thu-trai-cay-1.jpg',
    name: 'Bộ Thú Bông Trái Cây',
    price: '425.000₫',
    size: ['35cm'],
  },
]

const KidPage: React.FC = () => {
  return (
    <div className="px-6 py-10 bg-white min-h-screen">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-10">
        🧸 Gấu Bông Dễ Thương Cho Bé 🧸
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {kidProducts.map((item) => (
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
              <p className="text-pink-500 text-lg font-semibold mb-3">
                {item.price}
              </p>

              <div className="mt-auto">
                <Link
                  to="/checkout"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:from-rose-500 hover:to-pink-600 focus:outline-none"
                >
                  Mua ngay
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="my-12 text-center">
        <h2 className="text-2xl font-bold text-pink-500">👶 Món quà ngọt ngào cho bé yêu nhà bạn</h2>
        <p className="text-gray-600 mt-2">
          Gấu bông giúp bé cảm thấy an toàn, vui vẻ và ngủ ngon hơn mỗi ngày 💗 
        </p>

        <img
          src="https://product.hstatic.net/200000350831/product/z4062727338478_cfcadf4b7200e9c991d17b4270059772_7e58ba14fce04720b88bdf01f538de51_grande.jpg"
          alt="Gift for kids"
          className="mx-auto mt-6 w-72 h-auto object-contain"
        />

        <div className="flex justify-center mt-6">
          <div className="w-24 h-1 bg-pink-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default KidPage;
