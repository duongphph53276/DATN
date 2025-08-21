import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaClock, FaCheckCircle, FaTimesCircle, FaTruck, FaFilter, FaSearch, FaHeart } from 'react-icons/fa';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { getOrderClient } from '../../../store/slices/orderSlice';
import { GetOrderParams } from '../../../interfaces/orderApi';
import { Link } from 'react-router-dom';
import { formatVNDSymbol } from '../../../utils/currency';
import { getVietnameseStatus, paymentMethodVietnamese } from '../../../utils/constant';

const MyOrders: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { client, status } = useAppSelector((state) => state.order);
  const dispatch = useAppDispatch();

  const itemsPerPage = 10; // Hiển thị 10 đơn hàng mỗi trang
  useEffect(() => {
    const params: GetOrderParams = {
      page: currentPage,
      limit: itemsPerPage,
      status: statusFilter || undefined,
      payment_method: paymentFilter || undefined,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      dispatch(getOrderClient({ id: user._id || user.id, params }));
    }
  }, [dispatch, currentPage, statusFilter, paymentFilter]);

  const getStatusIcon = (orderStatus: string) => {
    switch (orderStatus.toLowerCase()) {
      case 'pending':
        return <FaClock className="text-amber-500" />;
      case 'processing':
        return <FaCheckCircle className="text-blue-500" />;
      case 'shipping':
        return <FaTruck className="text-purple-500" />;
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusText = (orderStatus: string) => {
    return getVietnameseStatus(orderStatus);
  };

  const getStatusColor = (orderStatus: string) => {
    switch (orderStatus.toLowerCase()) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipping':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentMethodText = (method: string) => {
    // Sử dụng mapping từ constant.ts
    const vietnameseMethod = paymentMethodVietnamese[method.toLowerCase()];
    if (vietnameseMethod) {
      return vietnameseMethod;
    }
    
    // Fallback cho các trường hợp đặc biệt
    switch (method.toUpperCase()) {
      case 'VNPAY':
        return 'Thanh toán bằng VNPAY';
      case 'COD':
        return 'Thanh toán khi nhận hàng';
      default:
        return method;
    }
  };

  const getVariantAttributesDisplay = (variant: any) => {
    if (!variant || !variant.attributes || variant.attributes.length === 0) {
      return <span className="text-gray-400 text-xs">Phiên bản cơ bản</span>;
    }

    return (
      <div className="mt-1">
        {variant.attributes.map((attr: any, index: number) => (
          <span key={index} className="inline-block bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full mr-1 mb-1">
            {attr.attribute_name}: {attr.value}
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setStatusFilter('');
    setPaymentFilter('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Sử dụng dữ liệu trực tiếp từ API với phân trang
  const orders = client?.orders || [];
  
  // Filter local chỉ cho search term (vì API không hỗ trợ search)
  const filteredOrders = orders.filter(order => {
    if (!order._id) return false;
    
    const matchesSearch = searchTerm === '' ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.order_details && order.order_details.some(detail =>
        detail.name && detail.name.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    return matchesSearch;
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-6xl mx-auto pt-20 px-4">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-pink-300 border-t-pink-500 mb-4"></div>
            <div className="text-xl text-pink-600 font-medium">Đang tải đơn hàng của bạn... 🐻</div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-6xl mx-auto pt-20 px-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">😢</div>
            <div className="text-xl text-red-500 font-medium">Không thể tải đơn hàng. Vui lòng thử lại!</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-6xl mx-auto pt-20 px-4 pb-10">
        <div className="bg-white shadow-2xl rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-pink-100 p-3 rounded-2xl">
              <FaClipboardList className="text-2xl text-pink-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Đơn hàng của tôi</h1>
              <p className="text-gray-600 mt-1">Theo dõi tất cả đơn hàng gấu bông yêu thích 🐻💕</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaFilter className="text-pink-500" />
              <h3 className="font-semibold text-gray-800">Bộ lọc</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-transparent outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-transparent outline-none bg-white"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="pending">{getVietnameseStatus('pending')}</option>
                <option value="preparing">{getVietnameseStatus('preparing')}</option>
                <option value="shipping">{getVietnameseStatus('shipping')}</option>
                <option value="delivered">{getVietnameseStatus('delivered')}</option>
                <option value="cancelled">{getVietnameseStatus('cancelled')}</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-transparent outline-none bg-white"
              >
                <option value="">Tất cả thanh toán</option>
                <option value="VNPAY">Thanh toán bằng VNPAY</option>
                <option value="cod">Thanh toán khi nhận hàng</option>
                <option value="bank_transfer">Chuyển khoản ngân hàng</option>
                <option value="credit_card">Thẻ tín dụng</option>
                <option value="debit_card">Thẻ ghi nợ</option>
                <option value="e_wallet">Ví điện tử</option>
              </select>

              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              >
                Đặt lại
              </button>
            </div>
          </div>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="bg-white shadow-2xl rounded-3xl p-12 text-center">
            <div className="text-8xl mb-6">🐻</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Chưa có đơn hàng nào</h3>
            <p className="text-gray-600 mb-8 text-lg">Hãy mua những chú gấu bông dễ thương để tạo đơn hàng đầu tiên!</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Mua sắm ngay 🛍️
            </button>
          </div>
        ) : filteredOrders.length === 0 && searchTerm ? (
          <div className="bg-white shadow-2xl rounded-3xl p-12 text-center">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Không tìm thấy đơn hàng</h3>
            <p className="text-gray-600 mb-8 text-lg">Không có đơn hàng nào phù hợp với từ khóa "{searchTerm}"</p>
            <button
              onClick={resetFilters}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Xem tất cả đơn hàng 🔄
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white shadow-xl rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 border border-pink-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-pink-100 p-3 rounded-2xl">
                      <FaHeart className="text-pink-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">Mã đơn hàng:</span>
                        <Link to={`/order-detail/${order._id}`} className="text-lg font-bold text-gray-800">#{order._id ? order._id.slice(-6).toUpperCase() : 'N/A'}</Link>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{formatDate(order.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-2xl">
                    <span className="text-sm text-gray-600 block mb-1">Tổng tiền:</span>
                    <p className="font-bold text-xl text-pink-600">
                      {formatVNDSymbol(order.total_amount)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl">
                    <span className="text-sm text-gray-600 block mb-1">Số lượng:</span>
                    <p className="font-bold text-xl text-blue-600">{order.quantity} sản phẩm</p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl">
                    <span className="text-sm text-gray-600 block mb-1">Thanh toán:</span>
                    <p className="font-bold text-green-600">{getPaymentMethodText(order.payment_method)}</p>
                  </div>
                </div>

                <div className="border-t border-pink-100 pt-6">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>Sản phẩm trong đơn hàng:</span>
                    <span className="text-pink-500">🐻</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.order_details.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-2xl">
                        <img
                          src={item.image || '/placeholder-bear.jpg'}
                          alt={item.name}
                          className="w-16 h-16 rounded-2xl object-cover shadow-md"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 mb-1">{item.name}</p>
                          <p className="text-sm text-gray-600 mb-1">
                            Giá: {formatVNDSymbol(item.price)}
                          </p>
                          {getVariantAttributesDisplay(item.variant)}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-pink-600">
                            {formatVNDSymbol(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {order.delivered_at && (
                  <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <FaCheckCircle />
                      <span className="font-semibold">Đã giao hàng thành công</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Thời gian giao: {formatDate(order.delivered_at)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {client?.pagination && client.pagination.total_pages > 1 && filteredOrders.length > 0 && (
          <div className="bg-white shadow-xl rounded-3xl p-6 mt-8">
            <div className="flex items-center justify-between">
              <div className="text-gray-600">
                Trang {client.pagination.current_page} / {client.pagination.total_pages}
                <span className="ml-2">({client.pagination.total_orders} đơn hàng)</span>
                {searchTerm && (
                  <span className="ml-2 text-pink-600">
                    (Hiển thị {filteredOrders.length} kết quả tìm kiếm)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(client.pagination.current_page - 1)}
                  disabled={!client.pagination.has_prev}
                  className="px-4 py-2 bg-pink-100 text-pink-600 rounded-xl hover:bg-pink-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  Trước
                </button>

                {Array.from({ length: Math.min(5, client.pagination.total_pages) }, (_, i) => {
                  const page = Math.max(1, client.pagination.current_page - 2) + i;
                  if (page > client.pagination.total_pages) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-xl font-medium transition-colors duration-200 ${page === client.pagination.current_page
                        ? 'bg-pink-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(client.pagination.current_page + 1)}
                  disabled={!client.pagination.has_next}
                  className="px-4 py-2 bg-pink-100 text-pink-600 rounded-xl hover:bg-pink-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;