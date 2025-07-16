import { FC } from "react";
import styles from "./OrderFilterModule.module.scss";
import classnames from "classnames/bind";
import { OrderFilterProps } from "../../../../interfaces/props";
import { paymentMethods, statuses } from "../../../../utils/constant";

const cx = classnames.bind(styles);

const OrderFilterModule: FC<OrderFilterProps> = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className={cx("filterBox")}>
      <div className={cx("inputSearch")}>
        <input
          type="text"
          placeholder="Tìm theo tên sản phẩm..."
          value={filters.name}
          onChange={(e) => handleFilterChange("name", e.target.value)}
        />
      </div>

      <div className={cx("selectFilter")}>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      <div className={cx("selectFilter")}>
        <select
          value={filters.payment_method}
          onChange={(e) => handleFilterChange("payment_method", e.target.value)}
        >
          <option value="">Tất cả thanh toán</option>
          {paymentMethods.map((p) => (
            <option key={p} value={p}>
              {p.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      <div className={cx("dateFilter")}>
        <input
          type="date"
          value={filters.created_at}
          onChange={(e) => handleFilterChange("created_at", e.target.value)}
        />
      </div>
    </div>
  );
};

export default OrderFilterModule;