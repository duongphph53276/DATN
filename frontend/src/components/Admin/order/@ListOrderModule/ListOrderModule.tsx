import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { getOrder } from "../../../../store/slices/orderSlice";
import styles from "./ListOrderModule.module.scss";
import classnames from "classnames/bind";
import { RingLoader } from "react-spinners";
import ReactPaginate from "react-paginate";
import { useLocation, useNavigate } from "react-router-dom";
import OrderFilterModule from "../@FilterOrder/OrderFilterModule";

const cx = classnames.bind(styles);

function ListOrderModule() {
  const dispatch = useAppDispatch();
  const { admin, status } = useAppSelector((state) => state.order);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const pageFromUrl = parseInt(queryParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(pageFromUrl - 1);

  const [filters, setFilters] = useState({
    name: "",
    status: "",
    payment_method: "",
    created_at: "",
  });

  const orders = admin?.orders || [];
  const pagination = admin?.pagination || {
    current_page: 1,
    total_pages: 1,
    per_page: 5,
    total_orders: 0,
  };

  useEffect(() => {
    dispatch(
      getOrder({
        page: currentPage + 1,
        ...filters,
      })
    );
  }, [dispatch, currentPage, filters]);

  const handlePageChange = (e: { selected: number }) => {
    const newPage = e.selected;
    setCurrentPage(newPage);
    queryParams.set("page", (newPage + 1).toString());
    navigate({ search: queryParams.toString() });
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    setCurrentPage(0);
    queryParams.set("page", "1");
    navigate({ search: queryParams.toString() });
  }, [filters]);

  return (
    <div className={cx("wrapper")}>
      <OrderFilterModule
        filters={filters} 
        onFiltersChange={handleFiltersChange}
      />

      {status === "loading" ? (
        <div className={cx("loadingCenter")}>
          <RingLoader color="#36d7b7" size={60} />
        </div>
      ) : (
        <>
          <div className={cx("tableWrapper")}>
            <table className={cx("table")}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Người dùng</th>
                  <th>Trạng thái</th>
                  <th>Số lượng</th>
                  <th>Tổng tiền</th>
                  <th>Giảm giá</th>
                  <th>Thanh toán</th>
                  <th>Ngày tạo</th>
                  <th>Sản phẩm</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className={cx("noData")}>
                      Không có đơn hàng phù hợp
                    </td>
                  </tr>
                ) : (
                  orders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1 + currentPage * pagination.per_page}</td>
                      <td>{order.user_id}</td>
                      <td className={cx("status", order.status)}>
                        {order.status}
                      </td>
                      <td>{order.quantity}</td>
                      <td>{order.total_amount.toLocaleString()}₫</td>
                      <td>{order.discount_code || "—"}</td>
                      <td>{order.payment_method.replace(/_/g, " ")}</td>
                      <td>
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className={cx("productList")}>
                        {order.order_details.map((item) => (
                          <div key={item._id}>
                            • {item.name} ({item.price.toLocaleString()}₫)
                          </div>
                        ))}
                      </td>
                      <td>
                        <button
                          className={cx("button-navigate")}
                          onClick={() => navigate(`/admin/order-detail/${order._id}`)}
                        >
                          Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.total_pages > 1 && (
            <ReactPaginate
              containerClassName={cx("pagination")}
              activeClassName={cx("active")}
              pageCount={pagination.total_pages}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              onPageChange={handlePageChange}
              forcePage={currentPage}
              previousLabel="<"
              nextLabel=">"
            />
          )}
        </>
      )}
    </div>
  );
}

export default ListOrderModule;