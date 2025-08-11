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
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
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
      {order.delivered_at && (
        <div>
          <p className={cx('label')}>Thời gian giao hàng:</p>
          <p className="text-green-600 font-semibold">
            {new Date(order.delivered_at).toLocaleDateString('vi-VN', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
      )}
      {order.voucher && (
        <div>
          <p className={cx('label')}>Mã giảm giá:</p>
          <div className="space-y-1">
            <p className="text-green-600 font-semibold">{order.voucher.code}</p>
            <p className="text-sm text-gray-600">
              Giảm {order.voucher.value}{order.voucher.type === 'percentage' ? '%' : '₫'}
            </p>
            <p className="text-xs text-gray-500">
              {order.voucher.type === 'percentage' ? 'Giảm theo phần trăm' : 'Giảm theo số tiền cố định'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
