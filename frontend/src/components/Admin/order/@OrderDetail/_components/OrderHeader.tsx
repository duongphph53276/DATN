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
  onChangeStatus: (e: React.ChangeEvent<HTMLSelectElement>, shipperId?: string) => void
}

export default function OrderHeader({ orderId, orderStatus, onChangeStatus }: Props) {
  const [shippers, setShippers] = useState<Shipper[]>([])
  const [selectedShipper, setSelectedShipper] = useState<string>('')
  const [showShipperSelect, setShowShipperSelect] = useState(false)
  
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
    
    // Nếu chọn shipping, hiển thị dropdown shipper
    if (newStatus === 'shipping') {
      setShowShipperSelect(true)
      return
    }
    
    // Gọi onChangeStatus ngay cho các trạng thái khác
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


    </div>
  )
}