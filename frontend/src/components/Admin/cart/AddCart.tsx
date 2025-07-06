import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Interface đơn giản
interface IProduct {
  _id: string;
  name: string;
}

const AddCart: React.FC = () => {
  const [userId, setUserId] = useState<string>(''); // userId người dùng
  const [productId, setProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<{ data: IProduct[]; status: boolean }>('http://localhost:5000/products');
        if (res.data.status) {
          setProducts(res.data.data);
        } else {
          setError('Không thể tải danh sách sản phẩm');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Lỗi khi tải sản phẩm');
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId.trim() || !productId.trim() || quantity <= 0) {
      setError('Vui lòng điền đầy đủ thông tin hợp lệ');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/cart/add', {
        userId,
        productId,
        quantity,
      });

      if (res.data.status) {
        navigate('/admin/cart'); // Điều hướng về trang giỏ hàng
      } else {
        setError(res.data.message);
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Thêm vào giỏ hàng thất bại';
      setError(msg);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Thêm vào giỏ hàng</h1>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="userId" className="block text-sm font-medium">
            ID Người dùng
          </label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="productId" className="block text-sm font-medium">
            Sản phẩm
          </label>
          <select
            id="productId"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
            required
          >
            <option value="">Chọn sản phẩm</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium">
            Số lượng
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="mt-1 p-2 border rounded w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Thêm vào giỏ hàng
        </button>
      </form>
    </div>
  );
};

export default AddCart;
