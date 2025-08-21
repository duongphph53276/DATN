// src/layout/Client/Banner.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { getSystemConfig } from '../../services/api/systemConfig';

interface Slide {
  bgGradient: string;
  title: string;
  images?: string[];
  image?: string;
  isActive?: boolean;
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
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Load banner config from API
  const [bannerConfig, setBannerConfig] = useState({
    banners: slides,
    autoSlideInterval: 5
  });

  // Load config from API on component mount
  useEffect(() => {
    const loadBannerConfig = async () => {
      try {
        setLoading(true);
        const config = await getSystemConfig();
        console.log('Banner config from API:', config);
        const activeBanners = config.banners.filter((banner: any) => banner.isActive);
        console.log('Active banners:', activeBanners);
        setBannerConfig({
          banners: activeBanners.length > 0 ? activeBanners : slides,
          autoSlideInterval: config.autoSlideInterval
        });
      } catch (error) {
        console.error('Error loading banner config:', error);
        // Fallback to default slides
        setBannerConfig({
          banners: slides,
          autoSlideInterval: 5
        });
      } finally {
        setLoading(false);
      }
    };

    loadBannerConfig();

    // Poll for updates every 30 seconds
    const interval = setInterval(loadBannerConfig, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const activeSlides = bannerConfig?.banners || slides;
  const slide = activeSlides[current] || activeSlides[0] || slides[0];

  const prev = () => setCurrent((i) => (i === 0 ? activeSlides.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === activeSlides.length - 1 ? 0 : i + 1));

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  // Auto-slide effect
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    if (!isPaused && activeSlides.length > 1) {
      const interval = bannerConfig?.autoSlideInterval || 5;
      intervalRef.current = setInterval(() => {
        setCurrent((i) => (i === activeSlides.length - 1 ? 0 : i + 1));
      }, interval * 1000); // Convert to milliseconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, bannerConfig?.autoSlideInterval, activeSlides.length]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative overflow-hidden h-[400px] md:h-[500px] bg-gradient-to-r from-purple-200 via-pink-200 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Safety check - if no slide is available, show a fallback
  if (!slide) {
    return (
      <div className="relative overflow-hidden h-[400px] md:h-[500px] bg-gradient-to-r from-purple-200 via-pink-200 to-purple-50 flex items-center justify-center">
        <p className="text-gray-600">Không có banner nào</p>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden h-[400px] md:h-[500px] ${slide?.bgGradient || 'bg-gradient-to-r from-purple-200 via-pink-200 to-purple-50'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ảnh Banner */}
      <div className="absolute inset-0">
        {(() => { console.log('Current slide:', slide); return null; })()}
        {slide.images ? (
          // Original banner format with multiple images
          <div className="flex items-center justify-center gap-4 w-full h-full px-4">
            {slide.images.map((src: string, i: number) => (
              <img
                key={i}
                src={src}
                alt={`banner-${i}`}
                className={`object-contain transition-all duration-500 ${
                  i < 2 
                    ? 'h-[380px] md:h-[480px]' 
                    : 'h-[280px] md:h-[380px]'
                }`}
                style={{
                  maxWidth: i < 2 ? '75%' : '35%'
                }}
              />
            ))}
          </div>
        ) : slide.image ? (
          // New banner format with single image
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={slide.image}
              alt={slide.title || 'banner'}
              className="w-full h-full object-cover transition-all duration-500"
              onError={(e) => {
                console.error('Image failed to load:', slide.image);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        ) : (
          // Fallback - show title if no image
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-4xl font-bold text-gray-700">{slide.title}</h1>
          </div>
        )}
      </div>

      {/* Nút điều khiển - chỉ hiển thị khi có nhiều hơn 1 banner */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-3 hover:scale-110 transition-all duration-200 z-10 shadow-lg"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full p-3 hover:scale-110 transition-all duration-200 z-10 shadow-lg"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        </>
      )}

      {/* Indicator dots - chỉ hiển thị khi có nhiều hơn 1 banner */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {activeSlides.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 shadow-lg ${
                index === current 
                  ? 'bg-white scale-125 shadow-xl' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75 hover:scale-110'
              }`}
            />
          ))}
        </div>
      )}

      {/* Overlay gradient for better text readability (optional) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Banner;
