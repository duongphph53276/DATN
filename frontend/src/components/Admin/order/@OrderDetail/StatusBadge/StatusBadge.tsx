import classNames from 'classnames/bind'
import styles from './StatusBadge.module.scss'

const cx = classNames.bind(styles)

interface StatusBadgeProps {
    status: 'pending' | 'preparing' | 'shipping' | 'delivered' | 'cancelled' | 'processing'
}

const statusLabel: Record<StatusBadgeProps['status'], string> = {
    pending: 'Chờ xử lý',
    preparing: 'Đang chuẩn bị',
    processing: 'Đang xử lý',
    shipping: 'Đang giao hàng',
    delivered: 'Đã giao',
    cancelled: 'Đã huỷ'
}

function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span className={cx('badge', status)}>
            {statusLabel[status]}
        </span>
    )
}

export default StatusBadge
