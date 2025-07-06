import { FaFacebookF, FaInstagram, FaMapMarkerAlt, FaShopify, FaTiktok, FaYoutube } from "react-icons/fa";


const Footer = () => {
  return (
    <div className="mt-auto">
      {/* Section: Hệ thống cửa hàng */}
      <section className="py-10 bg-white">
        <h2 className="text-center text-rose-500 font-bold text-3xl mb-4">
          HỆ THỐNG CỬA HÀNG
        </h2>
        <div className="w-20 h-[2px] bg-cyan-400 mx-auto mb-8" />

        <div className="flex flex-wrap justify-center gap-6 px-4">
          {/* Cửa hàng 1 */}
          <div className="w-[280px] text-center">
            <img
              src="https://gaubongonline.vn/wp-content/uploads/2025/05/bemori-bach-mai-13.webp"
              alt="Cửa hàng 1"
              className="rounded-lg object-cover w-full h-[250px]"
            />
            <h3 className="mt-3 font-semibold text-base">161 Xuân Thủy, Cầu Giấy</h3>
            <p className="text-gray-600 text-sm">033.876.6616</p>
          </div>

          {/* Cửa hàng 2 */}
          <div className="w-[280px] text-center">
            <img
              src="https://gaubongonline.vn/wp-content/uploads/2025/05/bemori-nguyen-trai.jpg"
              alt="Cửa hàng 2"
              className="rounded-lg object-cover w-full h-[250px]"
            />
            <h3 className="mt-3 font-semibold text-base">104 - 106 Cầu Giấy</h3>
            <p className="text-gray-600 text-sm">03.9799.6616</p>
          </div>

          {/* Cửa hàng 3 */}
          <div className="w-[280px] text-center">
            <img
              src="https://gaubongonline.vn/wp-content/uploads/2025/05/cua-hang-nguyen-van-cu.webp"
              alt="Cửa hàng 3"
              className="rounded-lg object-cover w-full h-[250px]"
            />
            <h3 className="mt-3 font-semibold text-base">1028 Đường Láng, Đống Đa</h3>
            <p className="text-gray-600 text-sm">035.369.6616</p>
          </div>
        </div>
      </section>

      {/* Section: Chuyện Nhà Gấu */}
      <section className="py-10 bg-white">
        <h2 className="text-center text-rose-500 font-bold text-3xl mb-4">
          CHUYỆN NHÀ GẤU
        </h2>
        <div className="w-20 h-[2px] bg-cyan-400 mx-auto mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 max-w-6xl mx-auto">
          {/* Bài viết 1 */}
          <div className="flex gap-4">
            <img
              src="https://upload.bemori.vn/chuyen-nha-gau/grand-opening-bemori-161-xuan-thuy/khai-truong-bemori-161-xuan-thuy-1.webp"
              alt="Bài viết 1"
              className="w-36 h-24 object-cover rounded-md flex-shrink-0"
            />
            <div>
              <h3 className="font-semibold text-lg leading-snug">
                Grand Opening Bemori 161 Xuân Thủy – Mua Capybara 1K, Chụp Photobooth Miễn Phí
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Tin vui cho những tín đồ yêu gấu bông tại Cầu Giấy! 💓 Bemori chính thức khai trương cửa hàng mới tại 161 Xuân Thủy...
              </p>
            </div>
          </div>

          {/* Bài viết 2 */}
          <div className="flex gap-4">
            <img
              src="https://gaubongonline.vn/wp-content/uploads/2024/04/shop-gau-bong-tai-HN.jpg"
              alt="Bài viết 2"
              className="w-36 h-24 object-cover rounded-md flex-shrink-0"
            />
            <div>
              <h3 className="font-semibold text-lg leading-snug">
                Shop Gấu Bông Đẹp, Giá Rẻ Bất Ngờ “Đốn Tim” Giới Trẻ Tại Hà Nội
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Trên những con phố náo nhiệt của thủ đô Hà Nội, có một thế giới gấu bông lấp lánh và đáng yêu đang chờ đón giới trẻ...
              </p>
            </div>
          </div>

          {/* Bài viết 3 */}
          <div className="flex gap-4">
            <img
              src="https://gaubongonline.vn/wp-content/uploads/2024/03/shop-capybara-3.jpg"
              alt="Bài viết 3"
              className="w-36 h-24 object-cover rounded-md flex-shrink-0"
            />
            <div>
              <h3 className="font-semibold text-lg leading-snug">
                Choáng Ngợp Bộ Trưởng Capybara Xâm Chiếm Nhà Bemori
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Gương mặt nổi rần rần khuấy đảo giới trẻ chính là ngài bộ trưởng Capybara siêu dễ thương...
              </p>
            </div>
          </div>

          {/* Bài viết 4 */}
          <div className="flex gap-4">
            <img
              src="https://gaubongonline.vn/wp-content/uploads/2024/05/gau-bong-capybara-nuoc-mui-rut-1-1.jpg"
              alt="Bài viết 4"
              className="w-36 h-24 object-cover rounded-md flex-shrink-0"
            />
            <div>
              <h3 className="font-semibold text-lg leading-snug">
                7 Mẫu Gấu Bông Capybara Dễ Thương Hot Nhất Hiện Nay
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Capybara trở thành một trong những mẫu gấu bông được yêu thích nhất nhờ ngoại hình dễ thương...
              </p>
            </div>
          </div>  
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-rose-300 text-white py-10 text-sm">
  <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-white">
    
    {/* Hệ thống cửa hàng */}
    <div>
      <h3 className="font-bold uppercase mb-2">Hệ thống cửa hàng</h3>
      <p className="font-semibold">Hà Nội | 8:30 - 23:00</p>
      <ul className="space-y-1 mt-2">
        <li>📍 275 Bạch Mai - 0979896616</li>
        <li>📍 368 Nguyễn Trãi - 033.567.6616</li>
        <li>📍 411 Nguyễn Văn Cừ - 034.369.6616</li>
        <li>📍 161 Xuân Thủy - 033.876.6616</li>
        <li>📍 104 - 106 Cầu Giấy - 03.9799.6616</li>
        <li>📍 1028 Đường Láng - 035.369.6616</li>
      </ul>

      <p className="font-semibold mt-4">Hồ Chí Minh | 8:30 - 23:00</p>
      <p>📍 228 Lê Văn Sỹ, P.1, Tân Bình - 097 989 6616</p>

      <p className="mt-4 font-semibold">Mua sỉ: 03.9797.6616</p>
      <p>Hotline SP/DV: 039.333.6616</p>
    </div>

    {/* Chuyển khoản */}
    <div>
      <h3 className="font-bold uppercase mb-2">Chuyển khoản online</h3>
      <p className="font-semibold">+ Techcombank</p>
      <p>STK: <span className="font-bold">13324816911019</span></p>
      <p>Chủ TK: Nguyễn Phương Hoa – CN Láng Hạ</p>
      <p className="italic mt-1">+ Xem chi tiết các TK ngân hàng</p>
      <p className="mt-1">+ Paypal / Momo / Shopee Pay</p>
    </div>

    {/* Hỗ trợ khách hàng */}
    <div>
      <h3 className="font-bold uppercase mb-2">Hỗ trợ khách hàng</h3>
      <ul className="space-y-1">
        <li>Chính sách bán buôn – sỉ</li>
        <li>Chính sách chung</li>
        <li>Chính sách bảo mật thông tin</li>
        <li>Bảo hành & Đổi trả</li>
        <li>Giới thiệu & Liên hệ</li>
      </ul>

      <div className="mt-4">
        <h3 className="font-bold uppercase mb-1">Hộ kinh doanh Bemori</h3>
        <p>
          Số 19 ngõ 23 Nguyễn Khuyến, TDP 5, P. Văn Quán, Q. Hà Đông, Hà Nội
        </p>
        <p>SĐT: 0979836886</p>
        <p>Mã số ĐKKD: 0108977908-001</p>
        <p>Email: <a href="mailto:gaubongonline6@gmail.com">gaubongonline6@gmail.com</a></p>
      </div>
    </div>

    {/* Mạng xã hội */}
    <div>
      <h3 className="font-bold uppercase mb-2">Fanpage</h3>
      <p>Follow nhà Gấu nhé!</p>
      <p>Gấu Bông Online</p>

      <h3 className="font-bold uppercase mt-4 mb-2">Xem Gấu Bông Với</h3>
   <div className="flex flex-wrap gap-3">
  <a
    href="https://facebook.com"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 bg-cyan-300 rounded-full flex items-center justify-center text-white text-xl hover:bg-cyan-400 transition"
  >
    <FaFacebookF />
  </a>
  <a
    href="https://instagram.com"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 bg-cyan-300 rounded-full flex items-center justify-center text-white text-xl hover:bg-cyan-400 transition"
  >
    <FaInstagram />
  </a>
  <a
    href="https://youtube.com"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 bg-cyan-300 rounded-full flex items-center justify-center text-white text-xl hover:bg-cyan-400 transition"
  >
    <FaYoutube />
  </a>
  <a
    href="https://shopee.vn"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 bg-cyan-300 rounded-full flex items-center justify-center text-white text-xl hover:bg-cyan-400 transition"
  >
    <FaShopify />
  </a>
  <a
    href="https://tiktok.com"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 bg-cyan-300 rounded-full flex items-center justify-center text-white text-xl hover:bg-cyan-400 transition"
  >
    <FaTiktok />
  </a>
  <a
    href="https://maps.google.com"
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 bg-cyan-300 rounded-full flex items-center justify-center text-white text-xl hover:bg-cyan-400 transition"
  >
    <FaMapMarkerAlt />
  </a>
</div>
    </div>

  </div>
</footer>

    </div>
  );
};

export default Footer;
