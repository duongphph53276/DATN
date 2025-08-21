import { FaShieldAlt, FaLock, FaEye, FaUserSecret, FaDatabase, FaKey, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const ChinhSachBaoMat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-400 to-pink-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <FaLock className="text-6xl text-pink-200" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Chính Sách Bảo Mật Thông Tin</h1>
          <p className="text-xl text-pink-100">
            Cam kết bảo vệ thông tin cá nhân của khách hàng
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Giới thiệu */}
          <section className="p-8 border-b border-gray-100">
            <div className="flex items-center mb-6">
              <FaShieldAlt className="text-3xl text-rose-500 mr-4" />
              <h2 className="text-2xl font-bold text-gray-800">Cam Kết Bảo Mật</h2>
            </div>
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-xl">
              <p className="text-gray-700 leading-relaxed mb-4">
                FuzzyBear cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng. 
                Chúng tôi hiểu rằng việc bảo mật thông tin là vô cùng quan trọng và luôn nỗ lực 
                để đảm bảo an toàn cho dữ liệu của bạn.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Chính sách bảo mật này mô tả cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ 
                thông tin cá nhân của bạn khi sử dụng website và dịch vụ của chúng tôi.
              </p>
            </div>
          </section>

          {/* Thông tin thu thập */}
          <section className="p-8 border-b border-gray-100">
            <div className="flex items-center mb-6">
              <FaEye className="text-3xl text-rose-500 mr-4" />
              <h2 className="text-2xl font-bold text-gray-800">Thông Tin Chúng Tôi Thu Thập</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg text-rose-600 mb-4">📝 Thông Tin Cá Nhân</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <FaCheckCircle className="text-rose-500 mt-1 flex-shrink-0" />
                    <span>Họ tên và thông tin liên hệ</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheckCircle className="text-rose-500 mt-1 flex-shrink-0" />
                    <span>Địa chỉ email và số điện thoại</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheckCircle className="text-rose-500 mt-1 flex-shrink-0" />
                    <span>Địa chỉ giao hàng</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheckCircle className="text-rose-500 mt-1 flex-shrink-0" />
                    <span>Thông tin thanh toán</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg text-rose-600 mb-4">🌐 Thông Tin Kỹ Thuật</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <FaCheckCircle className="text-rose-500 mt-1 flex-shrink-0" />
                    <span>Địa chỉ IP và thông tin trình duyệt</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheckCircle className="text-rose-500 mt-1 flex-shrink-0" />
                    <span>Cookie và dữ liệu phiên làm việc</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheckCircle className="text-rose-500 mt-1 flex-shrink-0" />
                    <span>Thông tin thiết bị và hệ điều hành</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheckCircle className="text-rose-500 mt-1 flex-shrink-0" />
                    <span>Dữ liệu sử dụng website</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Mục đích sử dụng */}
          <section className="p-8 border-b border-gray-100">
            <div className="flex items-center mb-6">
              <FaUserSecret className="text-3xl text-rose-500 mr-4" />
              <h2 className="text-2xl font-bold text-gray-800">Mục Đích Sử Dụng Thông Tin</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-rose-600 mb-2">Xử Lý Đơn Hàng</h3>
                  <p className="text-gray-700">
                    Sử dụng thông tin để xử lý đơn hàng, giao hàng và thanh toán một cách chính xác và an toàn.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-rose-600 mb-2">Hỗ Trợ Khách Hàng</h3>
                  <p className="text-gray-700">
                    Liên hệ và hỗ trợ khách hàng khi cần thiết, giải đáp thắc mắc và xử lý khiếu nại.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-rose-600 mb-2">Cải Thiện Dịch Vụ</h3>
                  <p className="text-gray-700">
                    Phân tích dữ liệu để cải thiện trải nghiệm mua sắm và phát triển sản phẩm tốt hơn.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-bold text-rose-600 mb-2">Marketing & Khuyến Mãi</h3>
                  <p className="text-gray-700">
                    Gửi thông tin về sản phẩm mới, khuyến mãi và ưu đãi đặc biệt (với sự đồng ý của bạn).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Bảo vệ thông tin */}
          <section className="p-8 border-b border-gray-100">
            <div className="flex items-center mb-6">
              <FaKey className="text-3xl text-rose-500 mr-4" />
              <h2 className="text-2xl font-bold text-gray-800">Biện Pháp Bảo Vệ Thông Tin</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl">
                  <h3 className="font-bold text-rose-600 mb-2">🔐 Mã Hóa SSL</h3>
                  <p className="text-gray-700 text-sm">
                    Sử dụng công nghệ mã hóa SSL 256-bit để bảo vệ dữ liệu truyền tải
                  </p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl">
                  <h3 className="font-bold text-rose-600 mb-2">🛡️ Bảo Mật Server</h3>
                  <p className="text-gray-700 text-sm">
                    Hệ thống server được bảo vệ bởi firewall và các biện pháp bảo mật tiên tiến
                  </p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl">
                  <h3 className="font-bold text-rose-600 mb-2">👥 Kiểm Soát Truy Cập</h3>
                  <p className="text-gray-700 text-sm">
                    Chỉ nhân viên được ủy quyền mới có thể truy cập thông tin khách hàng
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl">
                  <h3 className="font-bold text-rose-600 mb-2">📊 Sao Lưu Dữ Liệu</h3>
                  <p className="text-gray-700 text-sm">
                    Thực hiện sao lưu định kỳ để đảm bảo dữ liệu không bị mất mát
                  </p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl">
                  <h3 className="font-bold text-rose-600 mb-2">🔍 Giám Sát Liên Tục</h3>
                  <p className="text-gray-700 text-sm">
                    Hệ thống giám sát 24/7 để phát hiện và ngăn chặn các mối đe dọa
                  </p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl">
                  <h3 className="font-bold text-rose-600 mb-2">📋 Tuân Thủ Pháp Luật</h3>
                  <p className="text-gray-700 text-sm">
                    Tuân thủ nghiêm ngặt các quy định về bảo vệ dữ liệu cá nhân
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Chia sẻ thông tin */}
          <section className="p-8 border-b border-gray-100">
            <div className="flex items-center mb-6">
              <FaExclamationTriangle className="text-3xl text-rose-500 mr-4" />
              <h2 className="text-2xl font-bold text-gray-800">Chia Sẻ Thông Tin</h2>
            </div>
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-xl">
              <h3 className="font-bold text-lg text-rose-600 mb-4">❌ Chúng Tôi KHÔNG Chia Sẻ:</h3>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li className="flex items-start space-x-2">
                  <FaExclamationTriangle className="text-red-500 mt-1 flex-shrink-0" />
                  <span>Thông tin cá nhân với bên thứ ba không liên quan</span>
                </li>
                <li className="flex items-start space-x-2">
                  <FaExclamationTriangle className="text-red-500 mt-1 flex-shrink-0" />
                  <span>Dữ liệu thanh toán với đối tác không được ủy quyền</span>
                </li>
                <li className="flex items-start space-x-2">
                  <FaExclamationTriangle className="text-red-500 mt-1 flex-shrink-0" />
                  <span>Thông tin liên hệ cho mục đích spam hoặc quảng cáo</span>
                </li>
              </ul>
              
              <h3 className="font-bold text-lg text-rose-600 mb-4">✅ Chỉ Chia Sẻ Khi:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start space-x-2">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Có sự đồng ý rõ ràng từ khách hàng</span>
                </li>
                <li className="flex items-start space-x-2">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Yêu cầu bởi cơ quan pháp luật có thẩm quyền</span>
                </li>
                <li className="flex items-start space-x-2">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Cần thiết để xử lý đơn hàng (đối tác vận chuyển, thanh toán)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Quyền của khách hàng */}
          <section className="p-8">
            <div className="flex items-center mb-6">
              <FaUserSecret className="text-3xl text-rose-500 mr-4" />
              <h2 className="text-2xl font-bold text-gray-800">Quyền Của Khách Hàng</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-rose-500 flex-shrink-0" />
                  <span className="text-gray-700">Quyền truy cập và xem thông tin cá nhân</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-rose-500 flex-shrink-0" />
                  <span className="text-gray-700">Quyền chỉnh sửa thông tin không chính xác</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-rose-500 flex-shrink-0" />
                  <span className="text-gray-700">Quyền yêu cầu xóa thông tin cá nhân</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-rose-500 flex-shrink-0" />
                  <span className="text-gray-700">Quyền từ chối nhận thông tin marketing</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-rose-500 flex-shrink-0" />
                  <span className="text-gray-700">Quyền khiếu nại về việc xử lý dữ liệu</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-rose-500 flex-shrink-0" />
                  <span className="text-gray-700">Quyền rút lại sự đồng ý bất cứ lúc nào</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-rose-500 flex-shrink-0" />
                  <span className="text-gray-700">Quyền yêu cầu sao chép dữ liệu cá nhân</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCheckCircle className="text-rose-500 flex-shrink-0" />
                  <span className="text-gray-700">Quyền hạn chế xử lý dữ liệu</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Contact Info */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Liên Hệ Về Bảo Mật</h3>
          <p className="text-gray-600 mb-6">
            Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật hoặc muốn thực hiện quyền của mình, 
            vui lòng liên hệ với chúng tôi.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
              <div className="text-2xl font-bold text-rose-600 mb-2">📞 Hotline</div>
              <div className="text-gray-700">097.989.6616</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
              <div className="text-2xl font-bold text-rose-600 mb-2">📧 Email</div>
              <div className="text-gray-700">privacy@fuzzybear.vn</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
              <div className="text-2xl font-bold text-rose-600 mb-2">⏰ Phản Hồi</div>
              <div className="text-gray-700">Trong vòng 24 giờ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChinhSachBaoMat;
