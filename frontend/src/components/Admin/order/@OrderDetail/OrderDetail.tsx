import classNames from 'classnames/bind'
import styles from './OrderDetail.module.scss'
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

const cx = classNames.bind(styles)

export default function OrderDetail() {
    const dispatch = useAppDispatch()
    const { id } = useParams()
    const [order, setOrder] = useState<stateOrder | null>(null)
    const vatPercent = 10

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

    if (!order) return <div className={cx('loading-page')}><RingLoader color="#36d7b7" size={60} /></div>

    const subtotal = order.order_details.reduce((sum: number, item: any) => sum + item.price, 0)
    const vat = (subtotal * vatPercent) / 100
    const grandTotal = subtotal + vat

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as stateOrder['status']
        if (!order) return
        try {
            const updated: any = await dispatch(updateOrder({ _id: order._id, order_status: newStatus })).unwrap()
            ToastSucess(updated.message)
            setOrder({ ...order, status: updated.data.status })
        } catch (err) {
            console.error('Lỗi khi cập nhật trạng thái:', err)
            ToastError(`Lỗi khi cập nhật trạng thái ${err}`)
        }
    }

    return (
        <div className={cx('wrapper')}>
            <OrderBanner />
            <div className={cx('card')}>
                <OrderHeader orderId={order._id} orderStatus={order.status} onChangeStatus={handleStatusChange} />
                <OrderInfoGrid order={order} />
                <OrderTable items={order.order_details} />
                <OrderTotalBox subtotal={subtotal} vat={vat} vatPercent={vatPercent} grandTotal={grandTotal} />
            </div>
        </div>
    )
}
