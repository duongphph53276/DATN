import styles from '../OrderDetail.module.scss'
import classNames from 'classnames/bind'
import StatusBadge from '../StatusBadge/StatusBadge'
import { stateOrder } from '../../../../../interfaces/orderApi'

const cx = classNames.bind(styles)

interface Props {
  order: stateOrder
}

export default function OrderInfoGrid({ order }: Props) {
  return (
    <div className={cx('infoGrid')}>
      <div>
        <p className={cx('label')}>Trạng thái:</p>
        <p><StatusBadge status={order.status} /></p>
      </div>
      <div>
        <p className={cx('label')}>Ngày Đặt:</p>
        <p>{new Date(order.created_at).toLocaleDateString('vi-VN', {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        })}</p>
      </div>
      <div>
        <p className={cx('label')}>Hoá Đơn Từ:</p>
        <p>Vuaclass Shop</p>
        <p>support@vuaclass.com</p>
        <p>Ho Chi Minh City, Vietnam</p>
        <p>0123 456 789</p>
      </div>
      <div>
        <p className={cx('label')}>Hoá Đơn Cho:</p>
        <p>{order.user_id}</p>
        <p>customer@example.com</p>
        <p>Address ID: {order.address_id}</p>
        <p>0123 987 654</p>
      </div>
    </div>
  )
}
