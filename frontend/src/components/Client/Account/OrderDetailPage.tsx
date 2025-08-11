import { useEffect, useState } from 'react';
import { Heart, Package, MapPin, CreditCard, Calendar, X, Check, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { stateOrder } from '../../../interfaces/orderApi';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { updateOrder } from '../../../store/slices/orderSlice';
import { getOrderById } from '../../../services/api/OrderApi';
import { ToastSucess } from '../../../utils/toast';
import { calculateDiscountedAmount } from '../../../utils/currency';
import { getVietnameseStatus, paymentMethodVietnamese } from '../../../utils/constant';

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
            case 'preparing':
                return 'bg-orange-100 text-orange-800 border-orange-200';
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
        return status ? getVietnameseStatus(status) : 'Không xác định';
    };

    const getVariantAttributesDisplay = (variant: any) => {
        if (!variant || !variant.attributes || variant.attributes.length === 0) {
            return <span className="text-gray-400 text-sm">Phiên bản cơ bản</span>;
        }

        return (
            <div className="mt-2">
                {variant.attributes.map((attr: any, index: number) => (
                    <span key={index} className="inline-block bg-purple-100 text-purple-600 text-sm px-3 py-1 rounded-full mr-2 mb-1">
                        🎀 {attr.attribute_name}: {attr.value}
                    </span>
                ))}
            </div>
        );
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
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
            {/* Header với gradient đẹp */}
            <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-2xl">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                                <Package className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">Chi tiết đơn hàng</h1>
                                <p className="text-white/90 font-medium text-lg">#{orderData?._id?.slice(-8) || 'Loading...'}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/my-orders')}
                            className="flex items-center gap-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 border border-white/30"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8 -mt-6">
                {/* Card trạng thái đơn hàng */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-pink-100/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <Heart className="w-6 h-6 text-white" fill="currentColor" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Trạng thái đơn hàng</h2>
                        </div>
                        <span className={`px-6 py-3 rounded-2xl border-2 font-bold text-sm shadow-lg ${getStatusColor(orderData?.status)}`}>
                            {getStatusText(orderData?.status)}
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border border-pink-200/50">
                                <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-pink-600" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Ngày đặt hàng</p>
                                    <p className="font-semibold text-gray-800">{formatDate(orderData?.created_at)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200/50">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Phương thức thanh toán</p>
                                    <p className="font-semibold text-gray-800">{paymentMethodVietnamese[orderData?.payment_method || ''] || orderData?.payment_method}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Package className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Tổng số lượng</p>
                                    <p className="font-semibold text-gray-800">{orderData?.quantity} sản phẩm</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200/50">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Địa chỉ giao hàng</p>
                                    <p className="font-semibold text-gray-800 text-sm">{orderData?.address?.street}, {orderData?.address?.city}, {orderData?.address?.country}</p>
                                </div>
                            </div>
                            {orderData?.shipper_id && (orderData?.status === 'shipping' || orderData?.status === 'delivered') && (
                                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200/50">
                                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                        <Package className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Shipper giao hàng</p>
                                        <p className="font-semibold text-gray-800">Đã được phân công</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hiển thị lý do hủy nếu đơn hàng bị hủy */}
                    {orderData?.status === 'cancelled' && orderData?.cancel_reason && (
                        <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <X className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-red-800 mb-2 text-lg">Lý do hủy đơn hàng:</h3>
                                    <p className="text-red-700 leading-relaxed">{orderData.cancel_reason}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Card danh sách sản phẩm */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-pink-100/50 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-2xl">🧸</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Danh sách sản phẩm</h2>
                    </div>

                    <div className="space-y-6">
                        {orderData?.order_details.map((item) => (
                            <div key={item._id} className="flex gap-6 p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border border-pink-200/50 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-pink-200 shadow-lg">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                    />
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 text-xl mb-3">{item.name}</h3>
                                    {getVariantAttributesDisplay(item.variant)}
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-6">
                                            <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-pink-200/50">
                                                <span className="text-pink-600 font-bold text-lg">{formatPrice(item.price)}</span>
                                            </div>
                                            <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-pink-200/50">
                                                <span className="text-gray-600 font-semibold">Số lượng: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-purple-600 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-2xl border border-purple-200/50">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Card tổng kết đơn hàng */}
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-pink-100/50 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-2xl">💝</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Tổng kết đơn hàng</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-4 px-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200/50">
                            <span className="text-gray-600 font-medium">Tạm tính:</span>
                            <span className="font-bold text-lg text-gray-800">{formatPrice(calculateTotal(orderData?.order_details))}</span>
                        </div>
                        <div className="flex justify-between items-center py-4 px-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50">
                            <span className="text-gray-600 font-medium">Phí vận chuyển:</span>
                            <span className="font-bold text-lg text-green-600">Miễn phí</span>
                        </div>
                        {orderData?.voucher_id && orderData?.voucher && (
                            <div className="flex justify-between items-center py-4 px-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200/50">
                                <span className="text-gray-600 font-medium">Voucher:</span>
                                <span className="font-bold text-lg text-green-600">- {formatPrice(calculateDiscountedAmount(orderData.voucher.type || (orderData.voucher as any).discount_type, orderData.voucher.value, calculateTotal(orderData.order_details)).discount)} </span>
                            </div>
                        )}

                        <div className="flex justify-between items-center py-6 px-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border-2 border-pink-200 mt-6">
                            <span className="text-2xl font-bold text-gray-800">Tổng cộng:</span>
                            <span className="text-3xl font-bold text-pink-600">{formatPrice(orderData?.total_amount)}</span>
                        </div>
                    </div>
                </div>

                {orderData?.status === 'pending' && (
                    <div className="text-center">
                        <button
                            onClick={() => setShowCancelModal(true)}
                            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-4 px-10 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto border border-red-200/50"
                        >
                            <X className="w-6 h-6" />
                            Hủy đơn hàng
                        </button>
                    </div>
                )}
            </div>

            {showCancelModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-pink-200/50">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-red-200">
                                <X className="w-10 h-10 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Xác nhận hủy đơn hàng</h3>
                            <p className="text-gray-600 leading-relaxed">Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác!</p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 border border-gray-300/50"
                            >
                                Không, giữ lại
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 border border-red-200/50"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang hủy...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
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