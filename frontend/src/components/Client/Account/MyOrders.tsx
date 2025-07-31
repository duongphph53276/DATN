import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaClock, FaCheckCircle, FaTimesCircle, FaTruck } from 'react-icons/fa';

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    product: {
      name: string;
      image: string;
    };
    quantity: number;
    price: number;
  }>;
}

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Bạn cần đăng nhập để xem đơn hàng');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/orders/my-orders', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.status) {
          setOrders(data.data);
        } else {
          setError(data.message || 'Không thể tải đơn hàng');
        }
      } catch (err) {
        setError('Lỗi khi tải đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'confirmed':
        return <FaCheckCircle className="text-blue-500" />;
      case 'shipped':
        return <FaTruck className="text-purple-500" />;
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'shipped':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-14 px-4">
        <div className="text-center py-10 text-gray-500 text-lg">Đang tải đơn hàng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-14 px-4">
        <div className="text-center py-10 text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-14 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <FaClipboardList className="text-2xl text-rose-500" />
          <h1 className="text-3xl font-bold text-gray-800">Đơn hàng của tôi</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <FaClipboardList className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-gray-500 mb-6">Bạn chưa có đơn hàng nào. Hãy mua sắm để tạo đơn hàng đầu tiên!</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200"
            >
              Mua sắm ngay
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">Đơn hàng:</span>
                    <span className="text-lg font-semibold text-gray-800">{order.orderNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-600">Ngày đặt:</span>
                    <p className="font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Tổng tiền:</span>
                    <p className="font-semibold text-lg text-rose-600">
                      {order.totalAmount.toLocaleString('vi-VN')} ₫
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="font-medium text-gray-800 mb-3">Sản phẩm:</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.product.name}</p>
                          <p className="text-sm text-gray-600">
                            Số lượng: {item.quantity} x {item.price.toLocaleString('vi-VN')} ₫
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">
                            {(item.quantity * item.price).toLocaleString('vi-VN')} ₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders; 