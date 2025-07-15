// src/layout/Client/Banner.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Slide {
  bgGradient: string;
  title: string;
  images: string[];
}

const slides: Slide[] = [
  {
    bgGradient: 'bg-gradient-to-r from-purple-200 via-pink-200 to-purple-50',
    title: 'BEMORI 1',
    images: ['src/assets/banner1.png'],
  },
  {
    bgGradient: 'bg-gradient-to-r from-pink-200 via-yellow-200 to-pink-50',
    title: 'BEMORI 2',
    images: ['src/assets/banner2.webp'],
  },
  {
    bgGradient: 'bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-50',
    title: 'BEMORI 3',
    images: ['src/assets/banner3.webp'],
  },
  {
    bgGradient: 'bg-gradient-to-r from-green-100 via-teal-100 to-lime-50',
    title: 'BEMORI 4',
    images: ['src/assets/banner4.webp'],
  },
];



const Banner: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  const prev = () => setCurrent((i) => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === slides.length - 1 ? 0 : i + 1));

  return (
    <div className={`relative overflow-hidden h-[400px] md:h-[500px] ${slide.bgGradient}`}>
      {/* Nội dung text */}
      {/* <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center text-purple-700 drop-shadow-lg">
          {slide.title}
        </h2>
      </div> */}

      {/* Ảnh */}
      <div className="absolute inset-0 flex items-center justify-center gap-4  pointer-events-none">
        {slide.images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`banner-${i}`}
            className={`object-contain transition-opacity duration-500 ${
              i < 2 ? 'w-[1000px] md:w-[2400px]' : 'w-[300px] md:w-[400px]'
            }`}
          />
        ))}
      </div>

      {/* Nút điều khiển */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 rounded-full p-2 hover:bg-opacity-80 transition z-10"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 rounded-full p-2 hover:bg-opacity-80 transition z-10"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default Banner;
