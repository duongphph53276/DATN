import { useState, useEffect } from 'react';
import { Package, MapPin, Phone, User, Calendar, DollarSign, CheckCircle, Tag } from 'lucide-react';
import { formatCurrency } from '../../utils/convert';
import { getVietnameseStatus } from '../../utils/constant';
import { calculateDiscountedAmount } from '../../utils/currency';
import instance from '../../../api/instance';
import { toast } from 'react-hot-toast';
import { Address } from '../../interfaces/user';

interface Order {
  _id: string;
  user_id: string;
  status: string;
  quantity: number;
  total_amount: number;
  shipping_fee?: number;
  payment_method: string;
  created_at: string;
  delivered_at: string | null;
  cancel_reason: string | null;
  voucher_id?: string | null;
  voucher?: {
    _id: string;
    code: string;
    discount_type: 'percentage' | 'fixed';
    value: number;
  } | null;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  address: Address;
  order_details: Array<{
    name: string;
    price: number;
    quantity: number;
    image: string;
    variant?: {
      _id: string;
      attributes: Array<{
        attribute_id: string;
        value_id: string;
        attribute_name: string;
        value: string;
      }>;
    };
  }>;
}

interface Props {
  status?: 'shipping' | 'delivered' | 'cancelled';
}

const ShipperOrders = ({ status }: Props) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [cancelReason, setCancelReason] = useState<string>('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const shipperId = user._id || user.id;

  const getVariantAttributesDisplay = (variant: any) => {
    if (!variant || !variant.attributes || variant.attributes.length === 0) {
      return null;
    }

    return (
      <div className="mt-1">
        {variant.attributes.map((attr: any, index: number) => (
          <span key={index} className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded mr-1">
            {attr.attribute_name}: {attr.value}
          </span>
        ))}
      </div>
    );
  };

  // Tính tổng tiền sản phẩm trước khi giảm giá
  const calculateSubtotal = (order: Order) => {
    return order.order_details.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // Tính số tiền giảm giá
  const calculateDiscountAmount = (order: Order) => {
    if (!order.voucher) return 0;
    
    const subtotal = calculateSubtotal(order);
    const { discount } = calculateDiscountedAmount(order.voucher.discount_type, order.voucher.value, subtotal);
    return discount;
  };

  // Tính số tiền cần thu từ khách hàng
  const calculateAmountToCollect = (order: Order) => {
    // Nếu thanh toán qua VNPay (bank_transfer) thì số tiền cần thu là 0
    if (order.payment_method === 'bank_transfer') {
      return 0;
    }
    // Nếu thanh toán khi nhận hàng (cod) thì số tiền cần thu là tổng tiền đơn hàng (đã bao gồm phí ship)
    return order.total_amount || 0;
  };

  // Lấy tên phương thức thanh toán
  const getPaymentMethodText = (paymentMethod: string) => {
    switch (paymentMethod) {
      case 'cod':
        return 'Thanh toán khi nhận hàng (COD)';
      case 'bank_transfer':
        return 'Chuyển khoản VNPay';
      default:
        return paymentMethod;
    }
  };

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const params: any = { page, limit: 10 };
      if (status) {
        params.status = status;
      }
      
      const response = await instance.get(`/orders/shipper/${shipperId}`, { params });
      
      if (response.data.success) {
        setOrders(response.data.data.orders);
        setTotalPages(response.data.data.pagination.total_pages);
        setCurrentPage(response.data.data.pagination.current_page);
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string = 'delivered', reason?: string) => {
    try {
      setUpdating(orderId);
      const requestData: any = { status: newStatus };
      
      if (reason) {
        requestData.cancel_reason = reason;
      }
      
      const response = await instance.patch(`/orders/shipper/${shipperId}/${orderId}/status`, requestData);
      
      if (response.data.success) {
        const message = newStatus === 'delivered' 
          ? 'Cập nhật trạng thái thành công' 
          : 'Hủy giao hàng thành công';
        toast.success(message);
        fetchOrders(currentPage); // Refresh danh sách
      }
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    } finally {
      setUpdating(null);
    }
  };

  const handleCancelDelivery = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (!cancelReason.trim()) {
      toast.error('Vui lòng nhập lý do hủy giao hàng');
      return;
    }
    
    updateOrderStatus(selectedOrderId, 'cancelled', cancelReason);
    setShowCancelModal(false);
    setSelectedOrderId('');
    setCancelReason('');
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
    setSelectedOrderId('');
    setCancelReason('');
  };

  useEffect(() => {
    if (shipperId) {
      fetchOrders();
    }
  }, [shipperId, status]);

  const handlePageChange = (page: number) => {
    fetchOrders(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Không có đơn hàng</h3>
        <p className="mt-1 text-sm text-gray-500">
          {status === 'shipping' 
            ? 'Chưa có đơn hàng nào đang giao'
            : status === 'delivered' 
            ? 'Chưa có đơn hàng nào đã giao'
            : status === 'cancelled'
            ? 'Chưa có đơn hàng nào đã hủy'
            : 'Chưa có đơn hàng nào được giao'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {orders.map((order) => {
          const subtotal = calculateSubtotal(order);
          const discountAmount = calculateDiscountAmount(order);
          
          return (
            <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Đơn hàng #{order._id.slice(-8)}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar size={16} />
                          <span>{new Date(order.created_at).toLocaleString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign size={16} />
                          <span className="font-medium text-green-600">
                            {formatCurrency(order.total_amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'shipping' 
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {getVietnameseStatus(order.status)}
                    </span>
                    {order.status === 'shipping' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateOrderStatus(order._id)}
                          disabled={updating === order._id}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <CheckCircle size={16} />
                          <span>
                            {updating === order._id ? 'Đang cập nhật...' : 'Đã giao hàng'}
                          </span>
                        </button>
                        <button
                          onClick={() => handleCancelDelivery(order._id)}
                          disabled={updating === order._id}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <span>Hủy giao hàng</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Thông tin khách hàng</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-gray-400" />
                        <span>{order.user.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone size={16} className="text-gray-400" />
                        <span>{order.user.phone}</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin size={16} className="text-gray-400 mt-0.5" />
                        <span>
                          {order.address.street}, {order.address.city}{order.address.postal_code ? `, ${order.address.postal_code}` : ''}, {order.address.country}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Sản phẩm ({order.quantity} items)</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {order.order_details.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 text-sm">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <div className="flex-1">
                            <div>
                              <span className="text-gray-900">{item.name}</span>
                              <span className="text-gray-500 ml-2">x{item.quantity}</span>
                            </div>
                            {getVariantAttributesDisplay(item.variant)}
                          </div>
                          <span className="text-gray-600">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Payment Information and Amount to Collect */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <DollarSign size={16} className="mr-2 text-blue-600" />
                      Thông tin thanh toán
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Phương thức thanh toán:</span>
                        <span className={`font-medium px-2 py-1 rounded text-xs ${
                          order.payment_method === 'bank_transfer' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {getPaymentMethodText(order.payment_method)}
                        </span>
                      </div>
                      
                      {/* Hiển thị chi tiết thanh toán */}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng tiền hàng:</span>
                        <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                      </div>
                      
                      {order.voucher && (
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Tag size={14} className="text-green-500" />
                            <span className="text-gray-600">Mã giảm giá ({order.voucher.code}):</span>
                          </div>
                          <span className="text-green-600 font-medium">
                            -{formatCurrency(discountAmount)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Phí vận chuyển:</span>
                        {order.shipping_fee === 0 ? (
                          <span className="text-green-600 font-medium">🚚 Miễn phí</span>
                        ) : (
                          <span className="text-gray-900">{formatCurrency(order.shipping_fee)}</span>
                        )}
                      </div>
                      
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-medium text-gray-900">Tổng cộng:</span>
                        <span className="font-bold text-green-600 text-lg">
                          {formatCurrency(order.total_amount)}
                        </span>
                      </div>
                      
                      {/* Số tiền cần thu */}
                      <div className="flex justify-between pt-2 border-t-2 border-blue-200 bg-blue-100 rounded-lg p-2">
                        <span className="font-bold text-blue-900">Số tiền cần thu:</span>
                        <span className={`font-bold text-lg ${
                          calculateAmountToCollect(order) === 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {calculateAmountToCollect(order) === 0 
                            ? 'Đã thanh toán (Chuyển khoản)' 
                            : formatCurrency(calculateAmountToCollect(order))
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {order.delivered_at && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Đã giao lúc:</span>{' '}
                      {new Date(order.delivered_at).toLocaleString('vi-VN')}
                    </div>
                  </div>
                )}

                {order.status === 'cancelled' && order.cancel_reason && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm">
                      <span className="font-medium text-red-700">Lý do hủy:</span>{' '}
                      <span className="text-red-600">{order.cancel_reason}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                page === currentPage
                  ? 'bg-green-600 text-white'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hủy giao hàng</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do hủy giao hàng *
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={4}
                placeholder="Nhập lý do hủy giao hàng..."
              />
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={handleCancelModalClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={!cancelReason.trim()}
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipperOrders;
