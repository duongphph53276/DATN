import { FaTruck, FaShieldAlt, FaExchangeAlt, FaClock, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaPhoneAlt } from "react-icons/fa";

const BaoHanhDoiTra = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-400 to-pink-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <FaTruck className="text-6xl text-pink-200" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Bảo Hành & Đổi Trả</h1>
          <p className="text-xl text-pink-100">
            Chính sách bảo hành và đổi trả minh bạch, thuận tiện
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
              <h2 className="text-2xl font-bold text-gray-800">Cam Kết Chất Lượng</h2>
            </div>
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-xl">
              <p className="text-gray-700 leading-relaxed mb-4">
                FuzzyBear cam kết mang đến những sản phẩm gấu bông chất lượng cao nhất cho khách hàng. 
                Chúng tôi tự tin về chất lượng sản phẩm và luôn sẵn sàng hỗ trợ khách hàng trong mọi tình huống.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Chính sách bảo hành và đổi trả được thiết kế để đảm bảo quyền lợi tối đa cho khách hàng, 
                đồng thời tạo sự tin tưởng và yên tâm khi mua sắm tại FuzzyBear.
              </p>
            </div>
          </section>

          {/* Chính sách bảo hành */}
          <section className="p-8 border-b border-gray-100">
            <div className="flex items-center mb-6">
              <FaShieldAlt className="text-3xl text-rose-500 mr-4" />
              <h2 className="text-2xl font-bold text-gray-800">Chính Sách Bảo Hành</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg text-rose-600 mb-4">⏰ Thời Gian Bảo Hành</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <FaCheckCircle className="text-rose-500 mt-1 flex-shrink-0" />
                    <span><strong>12 tháng</strong> cho tất cả sản phẩm gấu bông</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheckCircle className="text-rose-500 mt-1 flex-shrink-0" />
                    <span><strong>24 tháng</strong> cho sản phẩm cao cấp</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheckCircle className="text-rose-500 mt-1 flex-shrink-0" />
                    <span>Bảo hành từ ngày mua hàng</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg text-rose-600 mb-4">🔧 Phạm Vi Bảo Hành</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <FaCheckCircle className="text-rose-500 mt-1 flex-shrink-0" />
                    <span>Rách đường may, bung chỉ</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheckCircle className="text-rose-500 mt-1 flex-shrink-0" />
                    <span>Lỗi chất liệu vải, bông</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheckCircle className="text-rose-500 mt-1 flex-shrink-0" />
                    <span>Lỗi phụ kiện đi kèm</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheckCircle className="text-rose-500 mt-1 flex-shrink-0" />
                    <span>Lỗi từ nhà sản xuất</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Chính sách đổi trả */}
          <section className="p-8 border-b border-gray-100">
            <div className="flex items-center mb-6">
              <FaExchangeAlt className="text-3xl text-rose-500 mr-4" />
              <h2 className="text-2xl font-bold text-gray-800">Chính Sách Đổi Trả</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg text-rose-600 mb-4">✅ Điều Kiện Đổi Trả</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <FaCheckCircle className="text-rose-500 mt-1 flex-shrink-0" />
                    <span>Trong vòng <strong>30 ngày</strong> kể từ ngày mua</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheckCircle className="text-rose-500 mt-1 flex-shrink-0" />
                    <span>Sản phẩm còn nguyên vẹn, chưa sử dụng</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheckCircle className="text-rose-500 mt-1 flex-shrink-0" />
                    <span>Còn đầy đủ tem mác, bao bì</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaCheckCircle className="text-rose-500 mt-1 flex-shrink-0" />
                    <span>Có hóa đơn mua hàng</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl">
                <h3 className="font-bold text-lg text-rose-600 mb-4">❌ Không Đổi Trả Khi</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <FaTimesCircle className="text-red-500 mt-1 flex-shrink-0" />
                    <span>Sản phẩm đã qua sử dụng</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaTimesCircle className="text-red-500 mt-1 flex-shrink-0" />
                    <span>Bị hư hỏng do lỗi người dùng</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaTimesCircle className="text-red-500 mt-1 flex-shrink-0" />
                    <span>Mất tem mác, bao bì gốc</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <FaTimesCircle className="text-red-500 mt-1 flex-shrink-0" />
                    <span>Sản phẩm khuyến mãi, giảm giá</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Quy trình đổi trả */}
          <section className="p-8 border-b border-gray-100">
            <div className="flex items-center mb-6">
              <FaClock className="text-3xl text-rose-500 mr-4" />
              <h2 className="text-2xl font-bold text-gray-800">Quy Trình Đổi Trả</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-rose-600 mb-2">Liên Hệ Hỗ Trợ</h3>
                  <p className="text-gray-700">
                    Gọi hotline hoặc chat với nhân viên để thông báo yêu cầu đổi trả. 
                    Cung cấp thông tin đơn hàng và lý do đổi trả.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-rose-600 mb-2">Kiểm Tra Điều Kiện</h3>
                  <p className="text-gray-700">
                    Nhân viên sẽ kiểm tra điều kiện đổi trả và hướng dẫn quy trình tiếp theo. 
                    Xác nhận thông tin và lý do đổi trả.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-rose-600 mb-2">Gửi Sản Phẩm</h3>
                  <p className="text-gray-700">
                    Đóng gói sản phẩm cẩn thận và gửi về trung tâm bảo hành. 
                    Chúng tôi sẽ hỗ trợ phí vận chuyển nếu lỗi từ nhà sản xuất.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg">
                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-bold text-rose-600 mb-2">Xử Lý & Hoàn Tất</h3>
                  <p className="text-gray-700">
                    Kiểm tra và xử lý trong 3-5 ngày làm việc. 
                    Gửi sản phẩm mới hoặc hoàn tiền tùy theo tình huống.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Thời gian xử lý */}
          <section className="p-8 border-b border-gray-100">
            <div className="flex items-center mb-6">
              <FaClock className="text-3xl text-rose-500 mr-4" />
              <h2 className="text-2xl font-bold text-gray-800">Thời Gian Xử Lý</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
                <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1-2</span>
                </div>
                <h3 className="font-bold text-lg text-rose-600 mb-2">Ngày Làm Việc</h3>
                <p className="text-gray-700 text-sm">
                  Xử lý yêu cầu đổi trả và xác nhận
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
                <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">3-5</span>
                </div>
                <h3 className="font-bold text-lg text-rose-600 mb-2">Ngày Làm Việc</h3>
                <p className="text-gray-700 text-sm">
                  Kiểm tra và xử lý sản phẩm
                </p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
                <div className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1-2</span>
                </div>
                <h3 className="font-bold text-lg text-rose-600 mb-2">Ngày Làm Việc</h3>
                <p className="text-gray-700 text-sm">
                  Gửi sản phẩm mới hoặc hoàn tiền
                </p>
              </div>
            </div>
          </section>

          {/* Lưu ý quan trọng */}
          <section className="p-8">
            <div className="flex items-center mb-6">
              <FaExclamationTriangle className="text-3xl text-rose-500 mr-4" />
              <h2 className="text-2xl font-bold text-gray-800">Lưu Ý Quan Trọng</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-yellow-400">
                  <FaExclamationTriangle className="text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-yellow-700 mb-1">Kiểm Tra Kỹ Lưỡng</h3>
                    <p className="text-gray-700 text-sm">
                      Vui lòng kiểm tra sản phẩm ngay khi nhận hàng để phát hiện lỗi sớm nhất
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400">
                  <FaPhoneAlt className="text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-blue-700 mb-1">Liên Hệ Ngay</h3>
                    <p className="text-gray-700 text-sm">
                      Gọi hotline ngay khi phát hiện vấn đề để được hỗ trợ nhanh nhất
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-400">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-green-700 mb-1">Bảo Quản Cẩn Thận</h3>
                    <p className="text-gray-700 text-sm">
                      Giữ nguyên bao bì và tem mác để đảm bảo điều kiện đổi trả
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border-l-4 border-purple-400">
                  <FaShieldAlt className="text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-purple-700 mb-1">Cam Kết Chất Lượng</h3>
                    <p className="text-gray-700 text-sm">
                      Chúng tôi cam kết xử lý mọi vấn đề một cách công bằng và minh bạch
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Contact Info */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Liên Hệ Hỗ Trợ</h3>
          <p className="text-gray-600 mb-6">
            Nếu bạn cần hỗ trợ về bảo hành hoặc đổi trả, vui lòng liên hệ với chúng tôi 
            để được tư vấn và hỗ trợ nhanh chóng.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
              <div className="text-2xl font-bold text-rose-600 mb-2">📞 Hotline</div>
              <div className="text-gray-700">097.989.6616</div>
              <div className="text-sm text-gray-500 mt-1">8:30 - 23:00</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
              <div className="text-2xl font-bold text-rose-600 mb-2">💬 Chat Online</div>
              <div className="text-gray-700">Hỗ trợ 24/7</div>
              <div className="text-sm text-gray-500 mt-1">Trả lời ngay lập tức</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
              <div className="text-2xl font-bold text-rose-600 mb-2">📧 Email</div>
              <div className="text-gray-700">support@fuzzybear.vn</div>
              <div className="text-sm text-gray-500 mt-1">Phản hồi trong 24h</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaoHanhDoiTra;
