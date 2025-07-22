import React, { useEffect, useState } from 'react';
import { IVoucher, IVoucherResponse, IErrorResponse } from '../../../interfaces/voucher';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Hàm định dạng tiền VND
const formatVND = (value: number) => {
  return value.toLocaleString('vi-VN') + ' đ';
};

// Hàm hiển thị giá trị theo loại voucher
const formatVoucherValue = (voucher: IVoucher) => {
  if (voucher.discount_type === 'percentage') {
    return `${voucher.value}%`;
  } else {
    return formatVND(voucher.value);
  }
};

// Hàm hiển thị giá trị tối thiểu theo loại voucher
const formatMinOrderValue = (voucher: IVoucher) => {
  if (!voucher.min_order_value || voucher.min_order_value <= 0) {
    return 'Không';
  }
  
  // Luôn hiển thị giá trị tối thiểu bằng tiền VND
  return formatVND(voucher.min_order_value);
};

// Hiển thị tên sản phẩm áp dụng
const formatApplicableProducts = (products: string[], allProducts: any[]) => {
  if (!products || products.length === 0) {
    return 'Tất cả sản phẩm';
  }

  const productNames = products.map(productId => {
    const product = allProducts.find(p => p._id === productId);
    return product ? product.name : 'Không tìm thấy';
  });

  return productNames.length <= 3
    ? productNames.join(', ')
    : `${productNames.slice(0, 3).join(', ')}, +${productNames.length - 3} khác`;
};

const ListVoucher: React.FC = () => {
  const [vouchers, setVouchers] = useState<IVoucher[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const vouchersPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vouchersRes, productsRes] = await Promise.all([
          axios.get<IVoucherResponse>('http://localhost:5000/vouchers'),
          axios.get('http://localhost:5000/product')
        ]);

        if (vouchersRes.data.status) setVouchers(vouchersRes.data.data);
        else setError(vouchersRes.data.message);

        if (productsRes.data.status) setProducts(productsRes.data.data);
      } catch (err) {
        const errorRes = err as IErrorResponse;
        setError(errorRes.message || 'Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa voucher này?')) return;

    try {
      const res = await axios.delete(`http://localhost:5000/vouchers/${id}`);
      if (res.data.status) {
        setVouchers(prev => prev.filter(v => v._id !== id));
        alert('Xóa voucher thành công');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      const errorRes = err as IErrorResponse;
      setError(errorRes.message || 'Lỗi khi xóa voucher');
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/voucher/edit/${id}`);
  };

  const filteredVouchers = vouchers.filter(v =>
    v.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const indexOfLastVoucher = currentPage * vouchersPerPage;
  const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
  const currentVouchers = filteredVouchers.slice(indexOfFirstVoucher, indexOfLastVoucher);
  const totalPages = Math.ceil(filteredVouchers.length / vouchersPerPage);

  if (loading) return <div className="text-center py-10 text-gray-600">Đang tải...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Danh sách Voucher</h1>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm mã..."
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => navigate('/admin/voucher/add')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thêm Voucher
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Mã</th>
                <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Loại</th>
                <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Giá trị</th>
                <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Tối thiểu</th>
                <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Số lượng</th>
                <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Áp dụng</th>
                <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Bắt đầu</th>
                <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Kết thúc</th>
                <th className="py-3 px-4 border-b text-left text-gray-600 font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentVouchers.map((voucher) => (
                <tr key={voucher._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 border-b font-medium text-gray-800">{voucher.code}</td>
                  <td className="py-3 px-4 border-b">
                    {voucher.discount_type === 'percentage' ? 'Phần trăm' : 'Tiền mặt'}
                  </td>
                  <td className="py-3 px-4 border-b font-medium text-green-600">
                    {formatVoucherValue(voucher)}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {formatMinOrderValue(voucher)}
                  </td>
                  <td className="py-3 px-4 border-b">{voucher.quantity}</td>
                  <td className="py-3 px-4 border-b max-w-xs">
                    <div className="truncate" title={formatApplicableProducts(voucher.applicable_products || [], products)}>
                      {formatApplicableProducts(voucher.applicable_products || [], products)}
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b">{new Date(voucher.start_date).toLocaleDateString('vi-VN')}</td>
                  <td className="py-3 px-4 border-b">{new Date(voucher.end_date).toLocaleDateString('vi-VN')}</td>
                  <td className="py-3 px-4 border-b text-sm">
                    <button
                      onClick={() => handleEdit(voucher._id!)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 transition-colors"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(voucher._id!)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              ←
            </button>
            <span className="text-gray-600">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListVoucher;