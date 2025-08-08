import React from 'react';
import { Link } from 'react-router-dom';
import { allProducts } from '../../../../mock/allProduct';

interface Service {
  icon: string;
  title: string;
  href: string;
}

interface Banner {
  image: string;
  href: string;
}

const services: Service[] = [
  { icon: 'public/icons/Asset-2.png', title: 'GIAO HÀNG TẬN NHÀ', href: '/shipping' },
  { icon: 'public/icons/Asset-3.png', title: 'BỌC QUÀ GIÁ RẺ', href: '/gift-wrap' },
  { icon: 'public/icons/Asset-4.png', title: 'TẶNG THIỆP MIỄN PHÍ', href: '/free-card' },
  { icon: 'public/icons/Asset-5.png', title: 'GIẶT GẤU BÔNG', href: '/wash' },
  { icon: 'public/icons/Asset-1.png', title: 'NÉN NHỜ GẤU', href: '/bear-compress' },
];

const banners: Banner[] = [
  { image: '  public/banner/gaubong5.png', href: '/gau-tang-ban-gai' },
  { image: 'public/banner/gaubong1.png', href: '/gau-tang-be-yeu' },
  { image: 'public/banner/thu-bong-cute--jpg.webp', href: '/thu-bong-cute' },
  { image: 'public/banner/thu-bong-theo-mau-sac-1.png', href: '/thu-bong-mau-sac' },
  { image: 'public/banner/gaubong4.png', href: '/gau-bong-event' },
  { image: 'public/banner/gaubong3.png', href: '/gau-bong-si-le' },
];

const CategorySection: React.FC = () => {
  return (
    <section className="py-10 bg-white">
      <h2 className="text-center text-rose-500 font-bold text-xl md:text-2xl mb-6">
        FUZZYBEAR - SHOP GẤU BÔNG ĐẸP VÀ CAO CẤP TẠI HÀ NỘI - TPHCM
      </h2>

      {/* Service icons */}
      <div className="flex justify-center flex-wrap gap-6 mb-10">
        {services.map((service, idx) => (
          <a
            key={idx}
            href={service.href}
            className="flex flex-col items-center text-sm font-semibold text-gray-700 hover:text-pink-500 transition transform hover:scale-105"
          >
            <img src={service.icon} alt={service.title} className="w-12 h-12 mb-2" />
            {service.title}
          </a>
        ))}
      </div>

      {/* Banner grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 md:px-10">
        {banners.map((banner, idx) => (
          <a key={idx} href={banner.href} className="block overflow-hidden rounded-xl">
            <img
              src={banner.image}
              alt={`banner-${idx}`}
              className="w-full h-auto rounded-xl transition-transform duration-300 hover:scale-105"
            />
          </a>
        ))}
      </div>
    </section>
  );
};
{
  allProducts.map(product => (
    <Link to={`/product/${product.id}`}>
      <img src={product.image} alt={product.name} className="rounded-lg w-full h-[250px] object-cover" />
      <h3 className="mt-2 font-semibold text-base">{product.name}</h3>
    </Link>
  ))
}
export default CategorySection;
