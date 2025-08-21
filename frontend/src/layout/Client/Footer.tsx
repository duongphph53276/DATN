import { FaFacebookF, FaInstagram, FaMapMarkerAlt, FaShopify, FaTiktok, FaYoutube, FaPhoneAlt, FaEnvelope, FaHeart, FaGift, FaShieldAlt, FaTruck, FaCreditCard, FaHeadset } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="mt-auto">
      {/* Section: Hệ thống cửa hàng */}
      <section className="py-12 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-rose-600 font-bold text-3xl mb-4">
            🏪 HỆ THỐNG CỬA HÀNG
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-rose-500 mx-auto mb-10 rounded-full" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cửa hàng 1 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <img
                src="https://gaubongonline.vn/wp-content/uploads/2025/05/bemori-bach-mai-13.webp"
                alt="Cửa hàng 1"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-2">161 Xuân Thủy, Cầu Giấy</h3>
                <p className="text-rose-600 font-semibold flex items-center">
                  <FaPhoneAlt className="mr-2" />
                  033.876.6616
                </p>
              </div>
            </div>

            {/* Cửa hàng 2 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <img
                src="https://gaubongonline.vn/wp-content/uploads/2025/05/bemori-nguyen-trai.jpg"
                alt="Cửa hàng 2"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-2">104 - 106 Cầu Giấy</h3>
                <p className="text-rose-600 font-semibold flex items-center">
                  <FaPhoneAlt className="mr-2" />
                  03.9799.6616
                </p>
              </div>
            </div>

            {/* Cửa hàng 3 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <img
                src="https://gaubongonline.vn/wp-content/uploads/2025/05/cua-hang-nguyen-van-cu.webp"
                alt="Cửa hàng 3"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-2">1028 Đường Láng, Đống Đa</h3>
                <p className="text-rose-600 font-semibold flex items-center">
                  <FaPhoneAlt className="mr-2" />
                  035.369.6616
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Chuyện Nhà Gấu */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-rose-600 font-bold text-3xl mb-4">
            📖 CHUYỆN NHÀ GẤU
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-rose-500 mx-auto mb-10 rounded-full" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bài viết 1 */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex gap-4">
                <img
                  src="https://upload.bemori.vn/chuyen-nha-gau/grand-opening-bemori-161-xuan-thuy/khai-truong-bemori-161-xuan-thuy-1.webp"
                  alt="Bài viết 1"
                  className="w-32 h-24 object-cover rounded-xl flex-shrink-0"
                />
                <div>
                  <h3 className="font-bold text-lg leading-snug text-gray-800 mb-2">
                    Grand Opening Bemori 161 Xuân Thủy
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Tin vui cho những tín đồ yêu gấu bông tại Cầu Giấy! 💓 Bemori chính thức khai trương cửa hàng mới...
                  </p>
                </div>
              </div>
            </div>

            {/* Bài viết 2 */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex gap-4">
                <img
                  src="https://gaubongonline.vn/wp-content/uploads/2024/04/shop-gau-bong-tai-HN.jpg"
                  alt="Bài viết 2"
                  className="w-32 h-24 object-cover rounded-xl flex-shrink-0"
                />
                <div>
                  <h3 className="font-bold text-lg leading-snug text-gray-800 mb-2">
                    Shop Gấu Bông Đẹp, Giá Rẻ Bất Ngờ
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Trên những con phố náo nhiệt của thủ đô Hà Nội, có một thế giới gấu bông lấp lánh...
                  </p>
                </div>
              </div>
            </div>

            {/* Bài viết 3 */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex gap-4">
                <img
                  src="https://gaubongonline.vn/wp-content/uploads/2024/03/shop-capybara-3.jpg"
                  alt="Bài viết 3"
                  className="w-32 h-24 object-cover rounded-xl flex-shrink-0"
                />
                <div>
                  <h3 className="font-bold text-lg leading-snug text-gray-800 mb-2">
                    Choáng Ngợp Bộ Trưởng Capybara
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Gương mặt nổi rần rần khuấy đảo giới trẻ chính là ngài bộ trưởng Capybara siêu dễ thương...
                  </p>
                </div>
              </div>
            </div>

            {/* Bài viết 4 */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex gap-4">
                <img
                  src="https://gaubongonline.vn/wp-content/uploads/2024/05/gau-bong-capybara-nuoc-mui-rut-1-1.jpg"
                  alt="Bài viết 4"
                  className="w-32 h-24 object-cover rounded-xl flex-shrink-0"
                />
                <div>
                  <h3 className="font-bold text-lg leading-snug text-gray-800 mb-2">
                    7 Mẫu Gấu Bông Capybara Dễ Thương
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Capybara trở thành một trong những mẫu gấu bông được yêu thích nhất nhờ ngoại hình dễ thương...
                  </p>
                </div>
              </div>
            </div>  
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-gradient-to-r from-rose-400 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Hệ thống cửa hàng */}
            <div className="space-y-4">
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-pink-200" />
                Hệ thống cửa hàng
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-pink-100 mb-2">🏙️ Hà Nội | 8:30 - 23:00</p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-pink-200 text-xs" />
                      275 Bạch Mai - 0979896616
                    </li>
                    <li className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-pink-200 text-xs" />
                      368 Nguyễn Trãi - 033.567.6616
                    </li>
                    <li className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-pink-200 text-xs" />
                      411 Nguyễn Văn Cừ - 034.369.6616
                    </li>
                    <li className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-pink-200 text-xs" />
                      161 Xuân Thủy - 033.876.6616
                    </li>
                    <li className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-pink-200 text-xs" />
                      104 - 106 Cầu Giấy - 03.9799.6616
                    </li>
                    <li className="flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-pink-200 text-xs" />
                      1028 Đường Láng - 035.369.6616
                    </li>
                  </ul>
                </div>
                
              </div>
            </div>

            {/* Chuyển khoản */}
            <div className="space-y-4">
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <FaCreditCard className="mr-2 text-pink-200" />
                Chuyển khoản online
              </h3>
              <div className="space-y-3">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="font-semibold text-pink-100 mb-2">🏦 Techcombank</p>
                  <p className="text-sm">STK: <span className="font-bold">13324816911019</span></p>
                  <p className="text-sm">Chủ TK: Nguyễn Phương Hoa – CN Láng Hạ</p>
                </div>
                
              </div>
            </div>

            {/* Hỗ trợ khách hàng */}
            <div className="space-y-4">
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <FaHeadset className="mr-2 text-pink-200" />
                Hỗ trợ khách hàng
              </h3>
              <div className="space-y-3">
                <ul className="space-y-2">
                  <li>
                    <Link 
                      to="/chinh-sach-chung"
                      className="flex items-center text-sm hover:text-pink-200 transition-colors cursor-pointer"
                    >
                      <FaShieldAlt className="mr-2 text-pink-200" />
                      Chính sách chung
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/chinh-sach-bao-mat"
                      className="flex items-center text-sm hover:text-pink-200 transition-colors cursor-pointer"
                    >
                      <FaShieldAlt className="mr-2 text-pink-200" />
                      Chính sách bảo mật thông tin
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/bao-hanh-doi-tra"
                      className="flex items-center text-sm hover:text-pink-200 transition-colors cursor-pointer"
                    >
                      <FaTruck className="mr-2 text-pink-200" />
                      Bảo hành & Đổi trả
                    </Link>
                  </li>
                  <li className="flex items-center text-sm hover:text-pink-200 transition-colors cursor-pointer">
                    <FaEnvelope className="mr-2 text-pink-200" />
                    Giới thiệu & Liên hệ
                  </li>
                </ul>

                
              </div>
            </div>

            {/* Mạng xã hội */}
            <div className="space-y-4">
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <FaHeart className="mr-2 text-pink-200" />
                Kết nối với chúng tôi
              </h3>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-bold text-pink-100 mb-2">📘 Fanpage</h4>
                  <p className="text-sm mb-2">Follow nhà Gấu nhé!</p>
                  <p className="text-sm font-semibold">Gấu Bông Online</p>
                </div>

                
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-sm text-pink-100">
              © 2024 FuzzyBear - Shop Gấu Bông Online. Made with ❤️ for teddy bear lovers everywhere!
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
