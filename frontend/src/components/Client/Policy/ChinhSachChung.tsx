import { FaShieldAlt, FaHeart, FaUsers, FaHandshake, FaStar, FaCheckCircle } from "react-icons/fa";

const ChinhSachChung = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-400 to-pink-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <FaShieldAlt className="text-6xl text-pink-200" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Chính Sách Chung</h1>
          <p className="text-xl text-pink-100">
            Cam kết của FuzzyBear đối với khách hàng thân yêu
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Tầm nhìn & Sứ mệnh */}
          <section className="p-8 border-b border-gray-100">
            <div className="flex items-center mb-6">
              <FaHeart className="text-3xl text-rose-500 mr-4" />
              <h2 className="text-2xl font-bold text-gray-800">Tầm Nhìn & Sứ Mệnh</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg text-rose-600 mb-3">🎯 Tầm Nhìn</h3>
                <p className="text-gray-700 leading-relaxed">
                  Trở thành thương hiệu gấu bông hàng đầu Việt Nam, mang đến những sản phẩm chất lượng cao 
                  và trải nghiệm mua sắm tuyệt vời cho mọi khách hàng.
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg text-rose-600 mb-3">💝 Sứ Mệnh</h3>
                <p className="text-gray-700 leading-relaxed">
                  Lan tỏa niềm vui và hạnh phúc thông qua những chú gấu bông dễ thương, 
                  đồng thời xây dựng mối quan hệ tin cậy với khách hàng.
                </p>
              </div>
            </div>
          </section>

          {/* Giá trị cốt lõi */}
          <section className="p-8 border-b border-gray-100">
            <div className="flex items-center mb-6">
              <FaStar className="text-3xl text-rose-500 mr-4" />
              <h2 className="text-2xl font-bold text-gray-800">Giá Trị Cốt Lõi</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
                <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-2xl text-white" />
                </div>
                <h3 className="font-bold text-lg text-rose-600 mb-2">Chất Lượng</h3>
                <p className="text-gray-700 text-sm">
                  Cam kết cung cấp sản phẩm chất lượng cao, an toàn cho mọi lứa tuổi
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
                <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="text-2xl text-white" />
                </div>
                <h3 className="font-bold text-lg text-rose-600 mb-2">Khách Hàng</h3>
                <p className="text-gray-700 text-sm">
                  Đặt lợi ích khách hàng lên hàng đầu, phục vụ với tâm huyết và tận tâm
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
                <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHandshake className="text-2xl text-white" />
                </div>
                <h3 className="font-bold text-lg text-rose-600 mb-2">Uy Tín</h3>
                <p className="text-gray-700 text-sm">
                  Xây dựng niềm tin thông qua sự minh bạch và trách nhiệm trong mọi hoạt động
                </p>
              </div>
            </div>
          </section>

          {/* Cam kết với khách hàng */}
          <section className="p-8 border-b border-gray-100">
            <div className="flex items-center mb-6">
              <FaHeart className="text-3xl text-rose-500 mr-4" />
              <h2 className="text-2xl font-bold text-gray-800">Cam Kết Với Khách Hàng</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-rose-600 mb-2">Sản Phẩm Chất Lượng</h3>
                  <p className="text-gray-700">
                    Tất cả sản phẩm đều được kiểm định chất lượng nghiêm ngặt, đảm bảo an toàn 
                    và phù hợp với tiêu chuẩn quốc tế.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-rose-600 mb-2">Dịch Vụ Tận Tâm</h3>
                  <p className="text-gray-700">
                    Đội ngũ nhân viên được đào tạo chuyên nghiệp, sẵn sàng hỗ trợ và tư vấn 
                    để mang đến trải nghiệm mua sắm tốt nhất.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-rose-600 mb-2">Giá Cả Hợp Lý</h3>
                  <p className="text-gray-700">
                    Cam kết cung cấp sản phẩm với giá cả cạnh tranh, phù hợp với chất lượng 
                    và giá trị thực tế của sản phẩm.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-bold text-rose-600 mb-2">Bảo Mật Thông Tin</h3>
                  <p className="text-gray-700">
                    Đảm bảo tuyệt đối bảo mật thông tin cá nhân của khách hàng, 
                    không chia sẻ với bất kỳ bên thứ ba nào.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Quyền lợi khách hàng */}
          <section className="p-8">
            <div className="flex items-center mb-6">
              <FaStar className="text-3xl text-rose-500 mr-4" />
              <h2 className="text-2xl font-bold text-gray-800">Quyền Lợi Khách Hàng</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-rose-500 flex-shrink-0" />
                  <span className="text-gray-700">Miễn phí vận chuyển cho đơn hàng từ 500K</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-rose-500 flex-shrink-0" />
                  <span className="text-gray-700">Đổi trả miễn phí trong 30 ngày</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-rose-500 flex-shrink-0" />
                  <span className="text-gray-700">Bảo hành chính hãng 12 tháng</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-rose-500 flex-shrink-0" />
                  <span className="text-gray-700">Hỗ trợ 24/7 qua hotline và chat</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-rose-500 flex-shrink-0" />
                  <span className="text-gray-700">Tích điểm thưởng cho mọi giao dịch</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-rose-500 flex-shrink-0" />
                  <span className="text-gray-700">Ưu đãi đặc biệt cho khách hàng VIP</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-rose-500 flex-shrink-0" />
                  <span className="text-gray-700">Giao hàng nhanh trong 2-4 giờ</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-rose-500 flex-shrink-0" />
                  <span className="text-gray-700">Thanh toán an toàn, đa dạng</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Contact Info */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Liên Hệ Hỗ Trợ</h3>
          <p className="text-gray-600 mb-6">
            Nếu bạn có bất kỳ thắc mắc nào về chính sách của chúng tôi, 
            đừng ngần ngại liên hệ với đội ngũ hỗ trợ.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
              <div className="text-2xl font-bold text-rose-600 mb-2">📞 Hotline</div>
              <div className="text-gray-700">097.989.6616</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
              <div className="text-2xl font-bold text-rose-600 mb-2">📧 Email</div>
              <div className="text-gray-700">support@fuzzybear.vn</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
              <div className="text-2xl font-bold text-rose-600 mb-2">⏰ Giờ Làm Việc</div>
              <div className="text-gray-700">8:30 - 23:00 (Tất cả các ngày)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChinhSachChung;
