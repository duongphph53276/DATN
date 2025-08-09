// _components/OrderHeader/index.tsx
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { stateOrder } from '../../../../../interfaces/orderApi'
import { statusOptions, getVietnameseStatus } from '../../../../../utils/constant'
import { getAvailableStatuses } from '../../../../../utils/orderStatusValidation'
import { getShippers, Shipper } from '../../../../../services/api/shipper'

interface Props {
  orderId: string
  orderStatus: stateOrder['status']
  onChangeStatus: (e: React.ChangeEvent<HTMLSelectElement>, shipperId?: string, cancelReason?: string) => void
}

export default function OrderHeader({ orderId, orderStatus, onChangeStatus }: Props) {
  const [shippers, setShippers] = useState<Shipper[]>([])
  const [selectedShipper, setSelectedShipper] = useState<string>('')
  const [showShipperSelect, setShowShipperSelect] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState<string>('')
  
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
      } catch (error) {
        console.error('Error fetching shippers:', error)
        console.error('Error details:', error.response?.data)
      }
    }

    fetchShippers()
  }, [])

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as stateOrder['status']
    
    // Nếu chọn shipping, hiển thị dropdown shipper
    if (newStatus === 'shipping') {
      setShowShipperSelect(true)
      return
    }
    
    // Nếu chọn cancelled, hiển thị modal lý do hủy
    if (newStatus === 'cancelled') {
      setShowCancelModal(true)
      return
    }
    
    // Nếu không phải shipping hoặc cancelled, gọi onChangeStatus ngay
    onChangeStatus(e)
  }

  const handleShipperSelect = () => {
    if (!selectedShipper) {
      alert('Vui lòng chọn shipper để giao hàng')
      return
    }
    
    // Tạo một event giả lập với value là 'shipping'
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
        
        {!showShipperSelect ? (
          <select 
            value={orderStatus} 
            onChange={handleStatusChange} 
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={availableStatuses.length <= 1} 
          >
            {availableStatuses.map(status => (
              <option key={status} value={status}>
                {getVietnameseStatus(status)}
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

      {/* Cancel Modal */}
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
    </div>
  )
}