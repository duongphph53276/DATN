import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { usePermissions } from '../../../hooks/usePermissions';

interface ICartItem {
  product_id: {
    name: string;
    price: number;
  };
  quantity: number;
}

interface ICart {
  _id: string;
  user_id: {
    name: string;
    email: string;
  };
  items: ICartItem[];
  createdAt: string;
  status: string;
}

const ListCart: React.FC = () => {
  const { hasPermission, isAdmin } = usePermissions();
  const [carts, setCarts] = useState<ICart[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/cart');
        if (response.data.status) {
          setCarts(response.data.data || []);
        } else {
          setError(response.data.message);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải danh sách giỏ hàng');
      }
    };

    fetchCarts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa giỏ hàng này?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/cart/${id}`);
        if (response.data.status) {
          setCarts(carts.filter((cart) => cart._id !== id));
        } else {
          setError(response.data.message);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Xóa giỏ hàng thất bại');
      }
    }
  };

  const getTotalQuantity = (cart: ICart) =>
    cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const getTotalPrice = (cart: ICart) =>
    cart.items.reduce((sum, item) => sum + item.quantity * item.product_id.price, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách giỏ hàng</h1>
      <Link
        to="/admin/cart/add"
        className="mb-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Thêm giỏ hàng
      </Link>
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Khách hàng</th>
            <th className="py-2 px-4 border">Số sản phẩm</th>
            <th className="py-2 px-4 border">Tổng tiền</th>
            <th className="py-2 px-4 border">Ngày tạo</th>
            <th className="py-2 px-4 border">Trạng thái</th>
            <th className="py-2 px-4 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {carts.map((cart) => (
            <tr key={cart._id}>
              <td className="py-2 px-4 border">{cart.user_id?.name || 'Ẩn danh'}</td>
              <td className="py-2 px-4 border">{getTotalQuantity(cart)}</td>
              <td className="py-2 px-4 border">{getTotalPrice(cart).toLocaleString()} đ</td>
              <td className="py-2 px-4 border">{new Date(cart.createdAt).toLocaleDateString()}</td>
              <td className="py-2 px-4 border">{cart.status}</td>
              <td className="py-2 px-4 border">
                <Link
                  to={`/admin/cart/edit/${cart._id}`}
                  className="text-blue-500 hover:underline mr-2"
                >
                  Sửa
                </Link>
                {(isAdmin() || hasPermission('delete_cart')) && (
                  <button
                    onClick={() => handleDelete(cart._id)}
                    className="text-red-500 hover:underline"
                  >
                    Xoá
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListCart;
