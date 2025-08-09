import styles from '../OrderDetail.module.scss'
import classNames from 'classnames/bind'
import { formatCurrency } from '../../../../../utils/convert'
import { stateOrder } from '../../../../../interfaces/orderApi'
import { calculateDiscountedAmount } from '../../../../../utils/currency'

const cx = classNames.bind(styles)

interface Props {
  order: stateOrder
}

export default function OrderTotalBox({ order }: Props) {
  function calculateTotal(orderDetails?: any): number {
    const list = orderDetails ?? []
    return list.reduce((total: number, item: any) => total + item.price * item.quantity, 0)
  }
  return (
    <div className={cx('totalBox')}>
      <div className={cx('line')}>
        <span>Tổng phụ:</span>
        <span>{formatCurrency(calculateTotal(order.order_details))}</span>
      </div>

      <div className={cx('line')}>
        <span>Giảm giá: </span>
        {order.voucher ? (
          <span>
            {formatCurrency(
              calculateTotal(order.order_details) -
              calculateDiscountedAmount(
                order.voucher.type,
                order.voucher.value,
                calculateTotal(order.order_details)
              ).finalAmount
            )}
          </span>
        ) : 'Không có giảm giá'}

      </div>
      <div className={cx('line', 'grand')}>
        <span>Tổng đơn hàng:</span>
        <span>{formatCurrency(order.total_amount)}</span>
      </div>
    </div>
  )
}
