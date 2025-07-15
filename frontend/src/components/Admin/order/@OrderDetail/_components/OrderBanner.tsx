import styles from '../OrderDetail.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function OrderBanner() {
  return (
    <div className={cx('banner')}>
      <div>
        <h2>Chi Tiết Đơn Hàng</h2>
        <p>Trang chủ • <span>Đơn Hàng</span></p>
      </div>
      <img src="https://modernize-angular-minisidebar.netlify.app/assets/images/breadcrumb/ChatBc.png" alt="" />
    </div>
  )
}
