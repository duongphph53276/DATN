import styles from '../OrderDetail.module.scss'
import classNames from 'classnames/bind'
import { formatCurrency } from '../../../../../utils/convert'
import VariantAttributesDisplay from '../../../../common/VariantAttributesDisplay'

const cx = classNames.bind(styles)

interface Props {
  items: any[]
}

export default function OrderTable({ items }: Props) {
  const getVariantAttributesDisplay = (variant: any) => {
    if (!variant || !variant.attributes || variant.attributes.length === 0) {
      return <span className="text-gray-400 text-xs">Phiên bản cơ bản</span>;
    }

    return (
      <div className="mt-1">
        {variant.attributes.map((attr: any, index: number) => (
          <span key={index} className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded mr-1 mb-1">
            {attr.attribute_name}: {attr.value}
          </span>
        ))}
      </div>
    );
  };

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
            <td>
              <div>
                <div className="font-medium">{item.name}</div>
                <VariantAttributesDisplay variant={item.variant} size="sm" theme="blue" showIcon={false} />
              </div>
            </td>
            <td>{formatCurrency(item.price)}</td>
            <td>{item.quantity}</td>
            <td>{formatCurrency(item.price * item.quantity)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
