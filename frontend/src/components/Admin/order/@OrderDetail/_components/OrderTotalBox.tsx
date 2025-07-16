import styles from '../OrderDetail.module.scss'
import classNames from 'classnames/bind'
import { formatCurrency } from '../../../../../utils/convert'

const cx = classNames.bind(styles)

interface Props {
  subtotal: number
  vat: number
  vatPercent: number
  grandTotal: number
}

export default function OrderTotalBox({ subtotal, vat, vatPercent, grandTotal }: Props) {
  return (
    <div className={cx('totalBox')}>
      <div className={cx('line')}>
        <span>Tổng phụ:</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className={cx('line')}>
        <span>Thuế VAT: {vatPercent}%</span>
        <span>{formatCurrency(vat)}</span>
      </div>
      <div className={cx('line', 'grand')}>
        <span>Tổng đơn hàng:</span>
        <span>{formatCurrency(grandTotal)}</span>
      </div>
    </div>
  )
}
