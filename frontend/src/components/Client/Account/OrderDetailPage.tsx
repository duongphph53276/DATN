import { RotateCcw, X, Calendar, CreditCard, Package, MapPin, Heart, ArrowLeft, Upload, Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getOrderById } from '../../../services/api/OrderApi'
import { stateOrder } from '../../../interfaces/orderApi'
import { ToastSucess, ToastError } from '../../../utils/toast'
import { requestCancelOrderWithImageUpload, requestReturnOrderWithImageUpload } from '../../../services/api/OrderApi'
import VariantAttributesDisplay from '../../common/VariantAttributesDisplay'
import { calculateDiscountedAmount } from '../../../utils/currency';
import { paymentMethodVietnamese } from '../../../utils/constant';

const OrderDetailPage = () => {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isReturnLoading, setIsReturnLoading] = useState(false);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState<stateOrder | null>(null);
    
    const [cancelReason, setCancelReason] = useState('');
    const [cancelImages, setCancelImages] = useState<File[]>([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
    const [selectedCancelReason, setSelectedCancelReason] = useState('');

    const [returnReason, setReturnReason] = useState('');
    const [returnImages, setReturnImages] = useState<File[]>([]);
    const [returnImagePreviewUrls, setReturnImagePreviewUrls] = useState<string[]>([]);
    const [selectedReturnReason, setSelectedReturnReason] = useState('');

    const cancelReasons = [
        'Thay đổi ý định mua hàng',
        'Tìm thấy sản phẩm rẻ hơn ở nơi khác',
        'Sản phẩm không đúng mô tả',
        'Vấn đề về chất lượng sản phẩm',
        'Thay đổi địa chỉ giao hàng',
        'Vấn đề về thanh toán',
        'Lý do cá nhân khác'
    ];

    const returnReasons = [
        'Sản phẩm bị lỗi/hỏng',
        'Sản phẩm không đúng mô tả',
        'Sản phẩm không vừa ý',
        'Sản phẩm bị trầy xước/hỏng hộp',
        'Nhận nhầm sản phẩm',
        'Sản phẩm không đúng kích thước',
        'Lý do khác'
    ];

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
    }, [id]);

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
            case 'returned':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string | undefined) => {
        switch (status) {
            case 'pending':
                return 'Chờ xử lý';
            case 'preparing':
                return 'Đang chuẩn bị';
            case 'shipping':
                return 'Đang giao hàng';
            case 'delivered':
                return 'Đã giao hàng';
            case 'cancelled':
                return 'Đã hủy';
            case 'returned':
                return 'Đã hoàn hàng';
            default:
                return 'Không xác định';
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + cancelImages.length > 5) {
            ToastError('Chỉ được upload tối đa 5 ảnh');
            return;
        }

        const newImages = [...cancelImages, ...files];
        setCancelImages(newImages);

        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
    };

    const removeImage = (index: number) => {
        const newImages = cancelImages.filter((_, i) => i !== index);
        const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
        setCancelImages(newImages);
        setImagePreviewUrls(newPreviewUrls);
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
        if (!cancelReason.trim() && !selectedCancelReason) {
            ToastError('Vui lòng chọn hoặc nhập lý do hủy đơn hàng');
            return;
        }

        setIsLoading(true);
        try {
            const result = await requestCancelOrderWithImageUpload({
                orderId: orderData?._id || '',
                user_id: orderData?.user_id || '',
                cancel_reason: cancelReason.trim() || selectedCancelReason,
                cancel_images: cancelImages
            });

            if (result.success) {
                setShowCancelModal(false);
                ToastSucess('Yêu cầu hủy đơn hàng đã được gửi. Vui lòng chờ admin xử lý.');
                
                if (id) {
                    try {
                        const res = await getOrderById(id);
                        setOrderData(res.data);
                    } catch (err) {
                        console.error('Error refreshing order data:', err);
                    }
                }
                
                setCancelReason('');
                setCancelImages([]);
                setImagePreviewUrls([]);
                setSelectedCancelReason('');
            } else {
                ToastError(result.message || 'Có lỗi xảy ra khi gửi yêu cầu hủy đơn hàng');
            }
        } catch (err: any) {
            console.error('Error canceling order:', err);
            ToastError(err.message || 'Có lỗi xảy ra khi gửi yêu cầu hủy đơn hàng. Vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };
    function calculateTotal(orderDetails?: any): number {
        const list = orderDetails ?? []
        return list.reduce((total: number, item: any) => total + item.price * item.quantity, 0)
    }

    const handleReturnImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + returnImages.length > 5) {
            ToastError('Chỉ được upload tối đa 5 ảnh');
            return;
        }

        const newImages = [...returnImages, ...files];
        setReturnImages(newImages);

        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setReturnImagePreviewUrls([...returnImagePreviewUrls, ...newPreviewUrls]);
    };

    const removeReturnImage = (index: number) => {
        const newImages = returnImages.filter((_, i) => i !== index);
        const newPreviewUrls = returnImagePreviewUrls.filter((_, i) => i !== index);
        setReturnImages(newImages);
        setReturnImagePreviewUrls(newPreviewUrls);
    };

    const handleReturnOrder = async () => {
        if (!returnReason.trim() && !selectedReturnReason) {
            ToastError('Vui lòng chọn hoặc nhập lý do hoàn hàng');
            return;
        }

        setIsReturnLoading(true);
        try {
            const result = await requestReturnOrderWithImageUpload({
                orderId: orderData?._id || '',
                return_reason: returnReason.trim() || selectedReturnReason,
                return_images: returnImages,
                user_id: orderData?.user_id || ''
            });

            if (result.success) {
                setShowReturnModal(false);
                ToastSucess('Yêu cầu hoàn hàng đã được gửi. Vui lòng chờ admin xử lý.');
                
                if (id) {
                    try {
                        const res = await getOrderById(id);
                        setOrderData(res.data);
                    } catch (err) {
                        console.error('Error refreshing order data:', err);
                    }
                }
                
                setReturnReason('');
                setReturnImages([]);
                setReturnImagePreviewUrls([]);
                setSelectedReturnReason('');
            } else {
                ToastError(result.message || 'Có lỗi xảy ra khi gửi yêu cầu hoàn hàng');
            }
        } catch (err: any) {
            console.error('Error returning order:', err);
            ToastError(err.message || 'Có lỗi xảy ra khi gửi yêu cầu hoàn hàng. Vui lòng thử lại!');
        } finally {
            setIsReturnLoading(false);
        }
    };

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
                             <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200/50">
                                 <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                     <Heart className="w-5 h-5 text-indigo-600" />
                                 </div>
                                 <div>
                                     <p className="text-gray-500 text-sm">Người nhận</p>
                                     <p className="font-semibold text-gray-800">{orderData?.user?.name}</p>
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
                             <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-200/50">
                                 <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                                     <Package className="w-5 h-5 text-teal-600" />
                                 </div>
                                 <div>
                                     <p className="text-gray-500 text-sm">Số điện thoại</p>
                                     <p className="font-semibold text-gray-800">{orderData?.user?.phone || orderData?.user?.phoneNumber}</p>
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

                    {orderData?.cancel_request && orderData.cancel_request.status && (
                        <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                            <div className="flex items-start gap-3">
                                <Package className="w-5 h-5 text-blue-500 mt-0.5" />
                                <div className="w-full">
                                    <h3 className="font-semibold text-blue-800 mb-2">Yêu cầu hủy đơn hàng:</h3>
                                    <p className="text-blue-700 mb-2"><strong>Lý do:</strong> {orderData.cancel_request.reason}</p>
                                    <p className="text-blue-700 mb-2"><strong>Trạng thái:</strong> 
                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                            orderData.cancel_request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            orderData.cancel_request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {orderData.cancel_request.status === 'pending' ? 'Chờ xử lý' :
                                             orderData.cancel_request.status === 'approved' ? 'Đã chấp nhận' :
                                             'Đã từ chối'}
                                        </span>
                                    </p>
                                    {orderData.cancel_request.admin_note && (
                                        <p className="text-blue-700"><strong>Ghi chú của admin:</strong> {orderData.cancel_request.admin_note}</p>
                                    )}
                                    {orderData.cancel_request.images && orderData.cancel_request.images.length > 0 && (
                                        <div className="mt-3">
                                            <p className="text-blue-700 mb-2"><strong>Ảnh đính kèm:</strong></p>
                                            <div className="flex gap-2 flex-wrap">
                                                {orderData.cancel_request.images.map((image, index) => (
                                                    <img key={index} src={image} alt={`Ảnh ${index + 1}`} className="w-16 h-16 object-cover rounded-lg border-2 border-blue-200" />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {orderData?.return_request && orderData.return_request.status && (
                        <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                            <div className="flex items-start gap-3">
                                <RotateCcw className="w-5 h-5 text-green-500 mt-0.5" />
                                <div className="w-full">
                                    <h3 className="font-semibold text-green-800 mb-2">Yêu cầu hoàn hàng:</h3>
                                    <p className="text-green-700 mb-2"><strong>Lý do:</strong> {orderData.return_request.reason}</p>
                                    <p className="text-green-700 mb-2"><strong>Trạng thái:</strong> 
                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                            orderData.return_request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            orderData.return_request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {orderData.return_request.status === 'pending' ? 'Chờ xử lý' :
                                             orderData.return_request.status === 'approved' ? 'Đã chấp nhận' :
                                             'Đã từ chối'}
                                        </span>
                                    </p>
                                    {orderData.return_request.admin_note && (
                                        <p className="text-green-700"><strong>Ghi chú của admin:</strong> {orderData.return_request.admin_note}</p>
                                    )}
                                    {orderData.return_request.images && orderData.return_request.images.length > 0 && (
                                        <div className="mt-3">
                                            <p className="text-green-700 mb-2"><strong>Ảnh đính kèm:</strong></p>
                                            <div className="flex gap-2 flex-wrap">
                                                {orderData.return_request.images.map((image, index) => (
                                                    <img key={index} src={image} alt={`Ảnh ${index + 1}`} className="w-16 h-16 object-cover rounded-lg border-2 border-green-200" />
                                                ))}
                                            </div>
                                        </div>
                                    )}
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
                                    <h3 className="font-bold text-gray-800 text-lg mb-1">{item.name}</h3>
                                    <p className="text-gray-500 text-sm mb-2">{item.product.description}</p>
                                    <VariantAttributesDisplay variant={item.variant} />
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-4">
                                            <span className="text-pink-600 font-semibold">{formatPrice(item.price)}</span>
                                            <span className="text-gray-500">x {item.quantity}</span>
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

                {(orderData?.status === 'pending' || orderData?.status === 'preparing') && (!orderData?.cancel_request || !orderData?.cancel_request.status) && (
                    <div className="text-center">
                        <button
                            onClick={() => setShowCancelModal(true)}
                            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-4 px-10 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto border border-red-200/50"
                        >
                            <X className="w-5 h-5" />
                            Yêu cầu hủy đơn hàng
                        </button>
                    </div>
                )}

                {orderData?.status === 'delivered' && (!orderData?.return_request || !orderData?.return_request.status) && (
                    <div className="text-center">
                        <button
                            onClick={() => setShowReturnModal(true)}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
                        >
                            <RotateCcw className="w-5 h-5" />
                            Yêu cầu hoàn hàng
                        </button>
                    </div>
                )}
            </div>

            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl border-4 border-pink-200 max-h-[90vh] overflow-y-auto">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <X className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Yêu cầu hủy đơn hàng</h3>
                            <p className="text-gray-600">Vui lòng cung cấp lý do và ảnh đính kèm (nếu có) để admin xem xét yêu cầu của bạn.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Chọn lý do hủy đơn hàng *
                                </label>
                                <select
                                    value={selectedCancelReason}
                                    onChange={(e) => setSelectedCancelReason(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                >
                                    <option value="">Chọn lý do...</option>
                                    {cancelReasons.map((reason, index) => (
                                        <option key={index} value={reason}>{reason}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hoặc nhập lý do khác
                                </label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    rows={3}
                                    placeholder="Nhập lý do hủy đơn hàng..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ảnh đính kèm (tùy chọn, tối đa 5 ảnh)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Click để chọn ảnh hoặc kéo thả ảnh vào đây</p>
                                        <p className="text-xs text-gray-500 mt-1">Hỗ trợ: JPG, PNG, GIF (tối đa 5 ảnh)</p>
                                    </label>
                                </div>
                            </div>

                            {imagePreviewUrls.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ảnh đã chọn ({imagePreviewUrls.length}/5)
                                    </label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {imagePreviewUrls.map((url, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-20 object-cover rounded-lg border-2 border-gray-200"
                                                />
                                                <button
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setCancelReason('');
                                    setCancelImages([]);
                                    setImagePreviewUrls([]);
                                    setSelectedCancelReason('');
                                }}
                                disabled={isLoading}
                                className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 border border-gray-300/50"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                disabled={isLoading || (!cancelReason.trim() && !selectedCancelReason)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang gửi...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Gửi yêu cầu hủy
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showReturnModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl border-4 border-green-200 max-h-[90vh] overflow-y-auto">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <RotateCcw className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Yêu cầu hoàn hàng</h3>
                            <p className="text-gray-600">Vui lòng cung cấp lý do và ảnh đính kèm (nếu có) để admin xem xét yêu cầu của bạn.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Chọn lý do hoàn hàng *
                                </label>
                                <select
                                    value={selectedReturnReason}
                                    onChange={(e) => setSelectedReturnReason(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">Chọn lý do...</option>
                                    {returnReasons.map((reason, index) => (
                                        <option key={index} value={reason}>{reason}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hoặc nhập lý do khác
                                </label>
                                <textarea
                                    value={returnReason}
                                    onChange={(e) => setReturnReason(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    rows={3}
                                    placeholder="Nhập lý do hoàn hàng..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ảnh đính kèm (tùy chọn, tối đa 5 ảnh)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleReturnImageUpload}
                                        className="hidden"
                                        id="return-image-upload"
                                    />
                                    <label htmlFor="return-image-upload" className="cursor-pointer">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Click để chọn ảnh hoặc kéo thả ảnh vào đây</p>
                                        <p className="text-xs text-gray-500 mt-1">Hỗ trợ: JPG, PNG, GIF (tối đa 5 ảnh)</p>
                                    </label>
                                </div>
                            </div>

                            {returnImagePreviewUrls.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ảnh đã chọn ({returnImagePreviewUrls.length}/5)
                                    </label>
                                    <div className="grid grid-cols-5 gap-2">
                                        {returnImagePreviewUrls.map((url, index) => (
                                            <div key={index} className="relative">
                                                <img
                                                    src={url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-20 object-cover rounded-lg border-2 border-gray-200"
                                                />
                                                <button
                                                    onClick={() => removeReturnImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowReturnModal(false);
                                    setReturnReason('');
                                    setReturnImages([]);
                                    setReturnImagePreviewUrls([]);
                                    setSelectedReturnReason('');
                                }}
                                disabled={isReturnLoading}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-colors duration-300 disabled:opacity-50"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleReturnOrder}
                                disabled={isReturnLoading || (!returnReason.trim() && !selectedReturnReason)}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isReturnLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang gửi...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Gửi yêu cầu hoàn hàng
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