import styles from '../OrderDetail.module.scss'
import classNames from 'classnames/bind'
import { formatCurrency } from '../../../../../utils/convert'

const cx = classNames.bind(styles)

interface Props {
  items: any[]
}

export default function OrderTable({ items }: Props) {
  return (
    <table className={cx('table')}>
      <thead>
        <tr>
          <th>Ảnh</th>
          <th>Tên sản phẩm</th>
          <th>Giá</th>
          <th>Số lượng</th>
          <th>Tổng tiền</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item._id}>
            <td><img src={item.image} alt={item.name} width={100} /></td>
            <td>{item.name}</td>
            <td>{formatCurrency(item.price)}</td>
            <td>{item.quantity}</td>
            <td>{formatCurrency(item.price * item.quantity)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
