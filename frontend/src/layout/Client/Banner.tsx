import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="relative banner">
    <img
        className="w-full h-auto object-cover"
        src="https://thumbs.dreamstime.com/b/toy-store-advertising-banner-template-teddy-bear-duck-hare-ship-flat-cartoon-vector-illustration-355954678.jpg"
        alt="Banner"
      />

      {/* Tiêu đề trên banner */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-lg shadow-lg">
        🎮 Chào mừng đến với FuzzyHug - Nơi có những chú gấu bông siêu đáng yêu!
      </div>

      {/* Nav Links (dùng Link thay button) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <Link
          to="/"
          className="bg-transparent hover:bg-gray-600 text-black px-8 py-4 rounded-md shadow-md transition border-x border-white border-opacity-30"
        >
          Trang chủ
        </Link>
        <Link
          to="/support"
          className="bg-transparent hover:bg-gray-600 text-black px-8 py-4 rounded-md shadow-md transition border-x border-white border-opacity-30"
        >
          Góp ý
        </Link>
        <Link
          to="/policy"
          className="bg-transparent hover:bg-gray-600 text-black px-8 py-4 rounded-md shadow-md transition border-x border-white border-opacity-30"
        >
          Chính sách
        </Link>
        <Link
          to="/contact"
          className="bg-transparent hover:bg-gray-600 text-black px-8 py-4 rounded-md shadow-md transition border-x border-white border-opacity-30"
        >
          Liên hệ
        </Link>
      </div>
    </div>
  );
};

export default Banner;
