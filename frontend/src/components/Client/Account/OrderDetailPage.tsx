import { useEffect, useState } from 'react';
import { Heart, Package, MapPin, CreditCard, Calendar, X, Check, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { stateOrder } from '../../../interfaces/orderApi';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { updateOrder } from '../../../store/slices/orderSlice';
import { getOrderById } from '../../../services/api/OrderApi';
import { ToastSucess } from '../../../utils/toast';
import { calculateDiscountedAmount } from '../../../utils/currency';

const OrderDetailPage = () => {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [orderData, setOrderData] = useState<stateOrder | null>(null);
    useEffect(() => {
        const getOrderData = async () => {
            if (id) {
                try {
                    const res = await getOrderById(id);
                    setOrderData(res.data);
                } catch (err) {
                    console.error('Error fetching order:', err);
                }
            }
        };
        getOrderData();
    }, [id, dispatch]);

    const formatPrice = (price: number | undefined) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price!);
    };

    const formatDate = (dateString: string | undefined) => {
        return new Date(dateString!).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string | undefined) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'confirmed':
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

    const getStatusText = (status: string | undefined) => {
        switch (status) {
            case 'pending':
                return 'Chờ xác nhận';
            case 'confirmed':
                return 'Đã xác nhận';
            case 'shipping':
                return 'Đang giao hàng';
            case 'delivered':
                return 'Đã giao hàng';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    const handleCancelOrder = async () => {
        setIsLoading(true);
        try {
            const result = await dispatch(updateOrder({ _id: orderData?._id, order_status: 'cancelled' }));
            const payload = result.payload as any;
            if (payload?.data?.status && orderData) {
                setOrderData({
                    ...orderData,
                    status: payload.data.status
                });
            }
            setShowCancelModal(false);
            ToastSucess('Huỷ thành công đơn hàng');
        } catch (err) {
            console.error('Error canceling order:', err);
            alert('Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };
    function calculateTotal(orderDetails?: any): number {
        const list = orderDetails ?? []
        return list.reduce((total: number, item: any) => total + item.price * item.quantity, 0)
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
            <div className="bg-white shadow-lg border-b-4 border-pink-200">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-pink-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng</h1>
                                <p className="text-pink-600 font-medium">#{orderData?._id.slice(-8)}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/my-orders')}
                            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-pink-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Heart className="w-6 h-6 text-pink-500" fill="currentColor" />
                            <h2 className="text-xl font-bold text-gray-800">Trạng thái đơn hàng</h2>
                        </div>
                        <span className={`px-4 py-2 rounded-full border-2 font-semibold text-sm ${getStatusColor(orderData?.status)}`}>
                            {getStatusText(orderData?.status)}
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Calendar className="w-5 h-5 text-pink-400" />
                                <span>Ngày đặt hàng: <strong>{formatDate(orderData?.created_at)}</strong></span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <CreditCard className="w-5 h-5 text-pink-400" />
                                <span>Phương thức thanh toán: <strong>{orderData?.payment_method}</strong></span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Package className="w-5 h-5 text-pink-400" />
                                <span>Tổng số lượng: <strong>{orderData?.quantity} sản phẩm</strong></span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <MapPin className="w-5 h-5 text-pink-400" />
                                <span className='text-[12px]'>Địa chỉ: <strong>{orderData?.address?.street}, {orderData?.address?.city}, {orderData?.address.country}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-pink-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        🧸 Danh sách sản phẩm
                    </h2>

                    <div className="space-y-4">
                        {orderData?.order_details.map((item) => (
                            <div key={item._id} className="flex gap-4 p-4 bg-pink-50 rounded-xl border border-pink-100 hover:shadow-md transition-shadow duration-300">
                                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 border-pink-200">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                    />
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 text-lg mb-1">{item.name}</h3>
                                    <p className="text-gray-500 text-sm mb-2">{item.product.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="text-pink-600 font-semibold">{formatPrice(item.price)}</span>
                                            <span className="text-gray-500">x {item.quantity}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-purple-600">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-pink-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        💝 Tổng kết đơn hàng
                    </h2>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-pink-100">
                            <span className="text-gray-600">Tạm tính:</span>
                            <span className="font-semibold">{formatPrice(calculateTotal(orderData?.order_details))}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-pink-100">
                            <span className="text-gray-600">Phí vận chuyển:</span>
                            <span className="font-semibold text-green-600">Miễn phí</span>
                        </div>
                        {orderData?.voucher_id && (
                            <div className="flex justify-between items-center py-2 border-b border-pink-100">
                                <span className="text-gray-600">Voucher:</span>
                                <span className="font-semibold text-green-600">- {formatPrice(calculateTotal(orderData.order_details) - calculateDiscountedAmount(orderData?.voucher?.type, orderData?.voucher?.value, calculateTotal(orderData.order_details)).finalAmount)} </span>
                            </div>
                        )}
                        <div className="flex justify-between items-center py-3 border-t-2 border-pink-200">
                            <span className="text-xl font-bold text-gray-800">Tổng cộng:</span>
                            <span className="text-2xl font-bold text-pink-600">{formatPrice(orderData?.total_amount)}</span>
                        </div>
                    </div>
                </div>

                {orderData?.status === 'pending' && (
                    <div className="text-center">
                        <button
                            onClick={() => setShowCancelModal(true)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
                        >
                            <X className="w-5 h-5" />
                            Hủy đơn hàng
                        </button>
                    </div>
                )}
            </div>

            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border-4 border-pink-200">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <X className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Xác nhận hủy đơn hàng</h3>
                            <p className="text-gray-600">Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác!</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                disabled={isLoading}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-colors duration-300 disabled:opacity-50"
                            >
                                Không, giữ lại
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                disabled={isLoading}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang hủy...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Có, hủy đơn
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetailPage;