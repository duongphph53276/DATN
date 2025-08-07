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
        <p>FUZZY BEAR</p>
        <p>support@fuzzy.com</p>
        <p>Ha noi, Vietnam</p>
        <p>03828944738</p>
      </div>
      <div>
        <p className={cx('label')}>Hoá Đơn Cho:</p>
        <p>{order.user.name}</p>
        <p>{order.user.email}</p>
        <p>Address: {order.address.street}, {order.address.city}, {order.address.country}</p>
        <p>{order.user.phone}</p>
      </div>
    </div>
  )
}
