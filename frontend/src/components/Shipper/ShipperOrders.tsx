import { useState, useEffect } from 'react';
import { Package, MapPin, Phone, User, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/convert';
import { getVietnameseStatus } from '../../utils/constant';
import instance from '../../../api/instance';
import { toast } from 'react-hot-toast';
import { Address } from '../../interfaces/user';

interface Order {
  _id: string;
  user_id: string;
  status: string;
  quantity: number;
  total_amount: number;
  created_at: string;
  delivered_at: string | null;
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
  }>;
}

interface Props {
  status?: 'shipping' | 'delivered';
}

const ShipperOrders = ({ status }: Props) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const shipperId = user.id;

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

  const updateOrderStatus = async (orderId: string) => {
    try {
      setUpdating(orderId);
      const response = await instance.patch(`/orders/shipper/${shipperId}/${orderId}/status`, {
        status: 'delivered'
      });
      
      if (response.data.success) {
        toast.success('Cập nhật trạng thái thành công');
        fetchOrders(currentPage); // Refresh danh sách
      }
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    } finally {
      setUpdating(null);
    }
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
            : 'Chưa có đơn hàng nào được giao'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {orders.map((order) => (
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
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {getVietnameseStatus(order.status)}
                  </span>
                  {order.status === 'shipping' && (
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
                          <span className="text-gray-900">{item.name}</span>
                          <span className="text-gray-500 ml-2">x{item.quantity}</span>
                        </div>
                        <span className="text-gray-600">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
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
            </div>
          </div>
        ))}
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
    </div>
  );
};

export default ShipperOrders;
