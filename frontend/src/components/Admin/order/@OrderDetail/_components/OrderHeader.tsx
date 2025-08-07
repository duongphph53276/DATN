// _components/OrderHeader/index.tsx
import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import styles from '../OrderDetail.module.scss'
import { stateOrder } from '../../../../../interfaces/orderApi'
import { statusOptions } from '../../../../../utils/constant'
import { getAvailableStatuses } from '../../../../../utils/orderStatusValidation'

const cx = classNames.bind(styles)

interface Props {
  orderId: string
  orderStatus: stateOrder['status']
  onChangeStatus: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export default function OrderHeader({ orderId, orderStatus, onChangeStatus }: Props) {
const availableStatuses = getAvailableStatuses(orderStatus, [...statusOptions])
  
  return (
    <div className={cx('header')}>
      <h3>#{orderId.slice(-15).toUpperCase()}</h3>
      <div className={cx('buttons')}>
        <Link to="/admin/order-list" className={cx('btnOutline')}>Về trang danh sách</Link>
        <select 
          value={orderStatus} 
          onChange={onChangeStatus} 
          className={cx('status-select')}
          disabled={availableStatuses.length <= 1} 
        >
          {availableStatuses.map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}