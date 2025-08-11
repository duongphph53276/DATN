// OrderDetail/index.tsx
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getOrderById } from '../../../../services/api/OrderApi'
import { stateOrder } from '../../../../interfaces/orderApi'
import { RingLoader } from 'react-spinners'
import { useAppDispatch } from '../../../../hooks/useAppDispatch'
import { updateOrder } from '../../../../store/slices/orderSlice'
import { ToastError, ToastSucess } from '../../../../utils/toast'
import OrderBanner from './_components/OrderBanner'
import OrderHeader from './_components/OrderHeader'
import OrderInfoGrid from './_components/OrderInfoGrid'
import OrderTable from './_components/OrderTable'
import OrderTotalBox from './_components/OrderTotalBox'
import { canChangeStatus, getStatusChangeErrorMessage } from '../../../../utils/orderStatusValidation'

export default function OrderDetail() {
    const dispatch = useAppDispatch()
    const { id } = useParams()
    const [order, setOrder] = useState<stateOrder | null>(null)

    useEffect(() => {
        (async () => {
            try {
                const res = await getOrderById(String(id))
                setOrder(res.data)
            } catch (error) {
                console.error("Lỗi khi fetch đơn hàng:", error)
            }
        })()
    }, [id])

    if (!order) return (
        <div className="flex items-center justify-center min-h-screen">
            <RingLoader color="#36d7b7" size={60} />
        </div>
    )

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>, shipperId?: string) => {
        const newStatus = e.target.value as stateOrder['status']
        if (!order) return

        if (!canChangeStatus(order.status, newStatus)) {
            const errorMessage = getStatusChangeErrorMessage(order.status, newStatus)
            ToastError(errorMessage)
            e.target.value = order.status
            return
        }

        try {
            const updateData: any = { _id: order._id, order_status: newStatus }
            
            // Nếu có shipper_id, thêm vào updateData
            if (shipperId) {
                updateData.shipper_id = shipperId
            }
            

            
            const updated: any = await dispatch(updateOrder(updateData)).unwrap()
            ToastSucess(updated.message)
            setOrder({ ...order, status: updated.data.status })
        } catch (err: any) {
            console.error('Lỗi khi cập nhật trạng thái:', err)
            console.error('Response data:', err.response?.data)
            console.error('Response status:', err.response?.status)
            const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái'
            ToastError(errorMessage)
            e.target.value = order.status
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <OrderBanner />
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <OrderHeader orderId={order._id} orderStatus={order.status} onChangeStatus={handleStatusChange} />
                <OrderInfoGrid order={order} />
                <OrderTable items={order.order_details} />
                <OrderTotalBox order={order}  />
            </div>
        </div>
    )
}