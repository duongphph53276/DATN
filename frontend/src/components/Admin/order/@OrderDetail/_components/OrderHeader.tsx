// _components/OrderHeader/index.tsx
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { stateOrder } from '../../../../../interfaces/orderApi'
import { statusOptions } from '../../../../../utils/constant'
import { getAvailableStatuses } from '../../../../../utils/orderStatusValidation'
import { getShippers, Shipper } from '../../../../../services/api/shipper'
import { handleCancelRequest, handleReturnRequest } from '../../../../../services/api/OrderApi'
import { ToastSucess, ToastError } from '../../../../../utils/toast'

interface Props {
  orderId: string
  orderStatus: stateOrder['status']
  onChangeStatus: (e: React.ChangeEvent<HTMLSelectElement>, shipperId?: string, cancelReason?: string) => void
  order?: any 
}

export default function OrderHeader({ orderId, orderStatus, onChangeStatus, order }: Props) {
  const [shippers, setShippers] = useState<Shipper[]>([])
  const [selectedShipper, setSelectedShipper] = useState<string>('')
  const [showShipperSelect, setShowShipperSelect] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState<string>('')
  const [showCancelRequestModal, setShowCancelRequestModal] = useState(false)
  const [cancelRequestAction, setCancelRequestAction] = useState<'approve' | 'reject'>('approve')
  const [adminNote, setAdminNote] = useState<string>('')
  const [showReturnRequestModal, setShowReturnRequestModal] = useState(false)
  const [returnRequestAction, setReturnRequestAction] = useState<'approve' | 'reject'>('approve')
  const [returnAdminNote, setReturnAdminNote] = useState<string>('')
  
  const availableStatuses = getAvailableStatuses(orderStatus, [...statusOptions])

  useEffect(() => {
    const fetchShippers = async () => {
      try {
        console.log('Fetching shippers...')
        const response = await getShippers()
        console.log('Shippers response:', response)
        if (response.status) {
          console.log('Shippers data:', response.data)
          setShippers(response.data)
        } else {
          console.log('Failed to fetch shippers:', response.message)
        }
      } catch (error: any) {
        console.error('Error fetching shippers:', error)
        console.error('Error details:', error.response?.data)
      }
    }

    fetchShippers()
  }, [])

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as stateOrder['status']
    
    if (newStatus === 'shipping') {
      setShowShipperSelect(true)
      return
    }
    
    if (newStatus === 'cancelled') {
      setShowCancelModal(true)
      return
    }
    
    onChangeStatus(e)
  }

  const handleShipperSelect = () => {
    if (!selectedShipper) {
      alert('Vui lòng chọn shipper để giao hàng')
      return
    }
    
    const fakeEvent = {
      target: { value: 'shipping' }
    } as React.ChangeEvent<HTMLSelectElement>
    
    onChangeStatus(fakeEvent, selectedShipper)
    setShowShipperSelect(false)
    setSelectedShipper('')
  }

  const handleCancelShipperSelect = () => {
    setShowShipperSelect(false)
    setSelectedShipper('')
  }

  const handleCancelOrder = () => {
    if (!cancelReason.trim()) {
      alert('Vui lòng nhập lý do hủy đơn hàng')
      return
    }
    
    // Tạo một event giả lập với value là 'cancelled' và lý do hủy
    const fakeEvent = {
      target: { value: 'cancelled' }
    } as React.ChangeEvent<HTMLSelectElement>
    
    // Cập nhật hàm onChangeStatus để nhận thêm cancelReason
    onChangeStatus(fakeEvent, undefined, cancelReason)
    setShowCancelModal(false)
    setCancelReason('')
  }

  const handleCancelModalClose = () => {
    setShowCancelModal(false)
    setCancelReason('')
  }

  const handleCancelRequestAction = async () => {
    if (cancelRequestAction === 'reject' && !adminNote.trim()) {
      ToastError('Vui lòng nhập lý do từ chối yêu cầu hủy đơn hàng')
      return
    }

    try {
      const result = await handleCancelRequest({
        orderId,
        action: cancelRequestAction,
        admin_note: adminNote
      });

      if (result.success) {
        ToastSucess(`Đã ${cancelRequestAction === 'approve' ? 'chấp nhận' : 'từ chối'} yêu cầu hủy đơn hàng`)
        setShowCancelRequestModal(false)
        setAdminNote('')
        setCancelRequestAction('approve')
        
        window.location.reload()
      } else {
        ToastError(result.message || 'Có lỗi xảy ra khi xử lý yêu cầu hủy đơn hàng')
      }
    } catch (error: any) {
      console.error('Error handling cancel request:', error)
      ToastError(error.message || 'Có lỗi xảy ra khi xử lý yêu cầu hủy đơn hàng')
    }
  }

  const handleCancelRequestModalClose = () => {
    setShowCancelRequestModal(false)
    setAdminNote('')
    setCancelRequestAction('approve')
  }

  const handleReturnRequestAction = async () => {
    if (returnRequestAction === 'reject' && !returnAdminNote.trim()) {
      ToastError('Vui lòng nhập lý do từ chối yêu cầu hoàn hàng')
      return
    }

    try {
      const result = await handleReturnRequest({
        orderId,
        action: returnRequestAction,
        admin_note: returnAdminNote
      });

      if (result.success) {
        ToastSucess(`Đã ${returnRequestAction === 'approve' ? 'chấp nhận' : 'từ chối'} yêu cầu hoàn hàng thành công`)
        setShowReturnRequestModal(false)
        setReturnAdminNote('')
        setReturnRequestAction('approve')
        
        window.location.reload()
      } else {
        ToastError(result.message || 'Có lỗi xảy ra khi xử lý yêu cầu hoàn hàng')
      }
    } catch (error: any) {
      console.error('Error handling return request:', error)
      ToastError(error.message || 'Có lỗi xảy ra khi xử lý yêu cầu hoàn hàng')
    }
  }

  const handleReturnRequestModalClose = () => {
    setShowReturnRequestModal(false)
    setReturnAdminNote('')
    setReturnRequestAction('approve')
  }

  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-sm border">
      <h3 className="text-xl font-semibold text-gray-900">#{orderId.slice(-15).toUpperCase()}</h3>
      <div className="flex items-center gap-3">
        <Link 
          to="/admin/order-list" 
          className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors font-medium"
        >
          Về trang danh sách
        </Link>
        
        {order?.cancel_request && order.cancel_request.status && (
          <div className="flex items-center gap-2">
            <div className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-200">
              <span className="text-sm font-medium">
                Yêu cầu hủy: {order.cancel_request.status === 'pending' ? 'Chờ xử lý' : 
                               order.cancel_request.status === 'approved' ? 'Đã chấp nhận' : 'Đã từ chối'}
              </span>
            </div>
            {order.cancel_request.status === 'pending' && (
              <button
                onClick={() => setShowCancelRequestModal(true)}
                className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                Xử lý yêu cầu
              </button>
            )}
          </div>
        )}

        {order?.return_request && order.return_request.status && (
          <div className="flex items-center gap-2">
            <div className="px-3 py-2 bg-green-100 text-green-800 rounded-lg border border-green-200">
              <span className="text-sm font-medium">
                Yêu cầu hoàn hàng: {order.return_request.status === 'pending' ? 'Chờ xử lý' : 
                                   order.return_request.status === 'approved' ? 'Đã chấp nhận' : 'Đã từ chối'}
              </span>
            </div>
            {order.return_request.status === 'pending' && (
              <button
                onClick={() => setShowReturnRequestModal(true)}
                className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
              >
                Xử lý yêu cầu
              </button>
            )}
          </div>
        )}
        
        {!showShipperSelect ? (
          <select 
            value={orderStatus} 
            onChange={handleStatusChange} 
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={availableStatuses.length <= 1} 
          >
            {availableStatuses.map(status => (
              <option key={status} value={status}>
                {status === 'pending' ? 'Chờ xử lý' :
                 status === 'preparing' ? 'Đang chuẩn bị' :
                 status === 'shipping' ? 'Đang giao hàng' :
                 status === 'delivered' ? 'Đã giao hàng' :
                 status === 'cancelled' ? 'Đã hủy' :
                 status === 'returned' ? 'Đã hoàn hàng' :
                 status}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex items-center gap-2">
            <select 
              value={selectedShipper} 
              onChange={(e) => setSelectedShipper(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
            >
              <option value="">Chọn shipper giao hàng</option>
              {shippers.map(shipper => (
                <option key={shipper._id} value={shipper._id}>
                  {shipper.name} - {shipper.phone}
                </option>
              ))}
            </select>
            <button 
              onClick={handleShipperSelect}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              disabled={!selectedShipper}
            >
              Xác nhận
            </button>
            <button 
              onClick={handleCancelShipperSelect}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Hủy
            </button>
          </div>
        )}
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hủy đơn hàng</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do hủy đơn hàng *
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={4}
                placeholder="Nhập lý do hủy đơn hàng..."
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
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={!cancelReason.trim()}
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Xử lý yêu cầu hủy đơn hàng</h3>
            
            {order?.cancel_request && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Lý do từ khách hàng:</strong> {order.cancel_request.reason}
                </p>
                {order.cancel_request.images && order.cancel_request.images.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-700 mb-1"><strong>Ảnh đính kèm:</strong></p>
                    <div className="flex gap-2 flex-wrap">
                      {order.cancel_request.images.map((image: string, index: number) => (
                        <img key={index} src={image} alt={`Ảnh ${index + 1}`} className="w-12 h-12 object-cover rounded border" />
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  <strong>Thời gian yêu cầu:</strong> {new Date(order.cancel_request.requested_at).toLocaleString('vi-VN')}
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hành động *
              </label>
              <select
                value={cancelRequestAction}
                onChange={(e) => setCancelRequestAction(e.target.value as 'approve' | 'reject')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="approve">Chấp nhận hủy đơn hàng</option>
                <option value="reject">Từ chối yêu cầu</option>
              </select>
            </div>

            {cancelRequestAction === 'reject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do từ chối *
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Nhập lý do từ chối yêu cầu hủy đơn hàng..."
                />
              </div>
            )}

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={handleCancelRequestModalClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={handleCancelRequestAction}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  cancelRequestAction === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                disabled={cancelRequestAction === 'reject' && !adminNote.trim()}
              >
                {cancelRequestAction === 'approve' ? 'Chấp nhận' : 'Từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReturnRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Xử lý yêu cầu hoàn hàng</h3>
            
            {order?.return_request && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Lý do từ khách hàng:</strong> {order.return_request.reason}
                </p>
                {order.return_request.images && order.return_request.images.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-700 mb-1"><strong>Ảnh đính kèm:</strong></p>
                    <div className="flex gap-2 flex-wrap">
                      {order.return_request.images.map((image: string, index: number) => (
                        <img key={index} src={image} alt={`Ảnh ${index + 1}`} className="w-12 h-12 object-cover rounded border" />
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  <strong>Thời gian yêu cầu:</strong> {new Date(order.return_request.requested_at).toLocaleString('vi-VN')}
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hành động *
              </label>
              <select
                value={returnRequestAction}
                onChange={(e) => setReturnRequestAction(e.target.value as 'approve' | 'reject')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="approve">Chấp nhận hoàn hàng</option>
                <option value="reject">Từ chối yêu cầu</option>
              </select>
            </div>

            {returnRequestAction === 'reject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do từ chối *
                </label>
                <textarea
                  value={returnAdminNote}
                  onChange={(e) => setReturnAdminNote(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Nhập lý do từ chối yêu cầu hoàn hàng..."
                />
              </div>
            )}

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={handleReturnRequestModalClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={handleReturnRequestAction}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  returnRequestAction === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                disabled={returnRequestAction === 'reject' && !returnAdminNote.trim()}
              >
                {returnRequestAction === 'approve' ? 'Chấp nhận' : 'Từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}