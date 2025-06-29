import React, { useEffect, useState } from 'react';
import { IVoucher, IVoucherResponse, IErrorResponse } from '../../../interfaces/voucher';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ListVoucher: React.FC = () => {
  const [vouchers, setVouchers] = useState<IVoucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get<IVoucherResponse>('http://localhost:5000/vouchers');
        if (response.data.status) {
          setVouchers(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        const errorResponse = err as IErrorResponse;
        setError(errorResponse.message || 'Lỗi khi tải danh sách voucher');
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa voucher này?')) {
      try {
        const response = await axios.delete(`http://localhost:5000/vouchers/${id}`);
        if (response.data.status) {
          setVouchers(vouchers.filter(voucher => voucher._id !== id));
          alert('Xóa voucher thành công');
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        const errorResponse = err as IErrorResponse;
        setError(errorResponse.message || 'Lỗi khi xóa voucher');
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/voucher/edit/${id}`);
  };

  if (loading) return <div className="text-center py-10">Đang tải...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Danh sách Voucher</h1>
        <button
          onClick={() => navigate('/admin/voucher/add')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Thêm Voucher
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Mã</th>
              <th className="py-2 px-4 border-b">Loại</th>
              <th className="py-2 px-4 border-b">Giá trị</th>
              <th className="py-2 px-4 border-b">Số lượng</th>
              <th className="py-2 px-4 border-b">Ngày bắt đầu</th>
              <th className="py-2 px-4 border-b">Ngày kết thúc</th>
              <th className="py-2 px-4 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map(voucher => (
              <tr key={voucher._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{voucher.code}</td>
                <td className="py-2 px-4 border-b">{voucher.discount_type}</td>
                <td className="py-2 px-4 border-b">
                  {voucher.discount_type === 'percentage' ? `${voucher.value}%` : `${voucher.value} VND`}
                </td>
                <td className="py-2 px-4 border-b">{voucher.quantity}</td>
                <td className="py-2 px-4 border-b">{new Date(voucher.start_date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{new Date(voucher.end_date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEdit(voucher._id!)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(voucher._id!)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListVoucher;