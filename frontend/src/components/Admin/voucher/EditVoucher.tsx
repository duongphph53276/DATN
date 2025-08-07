import React, { useEffect, useState } from 'react';
import { IEditVoucherRequest, ISingleVoucherResponse, IErrorResponse } from '../../../interfaces/voucher';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ExtendedEditVoucherRequest extends IEditVoucherRequest {
  discount_type: 'percentage' | 'fixed';
  quantity: number;
  min_order_value: number;
  max_user_number: number;
  applicable_products: string[];
}

const EditVoucher: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ExtendedEditVoucherRequest>({
    code: '',
    value: 0,
    discount_type: 'percentage',
    start_date: '',
    end_date: '',
    quantity: 0,
    min_order_value: 0,
    max_user_number: 0,
    applicable_products: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const response = await axios.get<ISingleVoucherResponse>(`http://localhost:5001/vouchers/${id}`);
        if (response.data.status && response.data.data) {
          const voucher = response.data.data;
          setFormData({
            code: voucher.code,
            value: voucher.value,
            discount_type: voucher.discount_type,
            start_date: new Date(voucher.start_date).toISOString().split('T')[0],
            end_date: new Date(voucher.end_date).toISOString().split('T')[0],
            quantity: voucher.quantity || 0,
            min_order_value: voucher.min_order_value || 0,
            max_user_number: voucher.max_user_number || 0,
            applicable_products: voucher.applicable_products || [],
          });
        } else {
          setError(response.data.message || 'Không tìm thấy voucher');
        }
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          setError('Không tìm thấy voucher. Vui lòng kiểm tra ID voucher hoặc server backend.');
        } else {
          const errorResponse = err as IErrorResponse;
          setError(errorResponse.message || 'Lỗi khi tải thông tin voucher');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVoucher();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'applicable_products') {
      setFormData(prev => ({
        ...prev,
        [name]: value.split(',').map(id => id.trim()).filter(id => id),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: ['value', 'quantity', 'min_order_value', 'max_user_number'].includes(name)
          ? Number(value)
          : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        type: formData.discount_type, // Map to backend's expected 'type' field
      };
      const response = await axios.put(`http://localhost:5001/vouchers/${id}`, payload);
      if (response.data.status) {
        alert('Cập nhật voucher thành công');
        navigate('/admin/voucher');
      } else {
        setError(response.data.message || 'Không thể cập nhật voucher');
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setError('Không tìm thấy voucher. Vui lòng kiểm tra ID voucher hoặc server backend.');
      } else {
        const errorResponse = err as IErrorResponse;
        setError(errorResponse.message || 'Lỗi khi cập nhật voucher');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Đang tải...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sửa Voucher</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Mã Voucher
            </label>
            <input
              id="code"
              name="code"
              type="text"
              value={formData.code}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
              placeholder="Nhập mã voucher"
            />
          </div>
          <div>
            <label htmlFor="discount_type" className="block text-sm font-medium text-gray-700">
              Loại giảm giá
            </label>
            <select
              id="discount_type"
              name="discount_type"
              value={formData.discount_type}
              onChange={handleChange}
              required
              className="select select-bordered w-full"
            >
              <option value="percentage">Phần trăm</option>
              <option value="fixed">Cố định</option>
            </select>
          </div>
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700">
              Giá trị giảm giá
            </label>
            <input
              id="value"
              name="value"
              type="number"
              value={formData.value}
              onChange={handleChange}
              required
              min="0"
              className="input input-bordered w-full"
              placeholder="Nhập giá trị"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Số lượng
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
              className="input input-bordered w-full"
              placeholder="Nhập số lượng"
            />
          </div>
          <div>
            <label htmlFor="min_order_value" className="block text-sm font-medium text-gray-700">
              Giá trị đơn hàng tối thiểu
            </label>
            <input
              id="min_order_value"
              name="min_order_value"
              type="number"
              value={formData.min_order_value}
              onChange={handleChange}
              required
              min="0"
              className="input input-bordered w-full"
              placeholder="Nhập giá trị tối thiểu"
            />
          </div>
          <div>
            <label htmlFor="max_user_number" className="block text-sm font-medium text-gray-700">
              Số lượng người dùng tối đa
            </label>
            <input
              id="max_user_number"
              name="max_user_number"
              type="number"
              value={formData.max_user_number}
              onChange={handleChange}
              required
              min="0"
              className="input input-bordered w-full"
              placeholder="Nhập số lượng tối đa"
            />
          </div>
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
              Ngày bắt đầu
            </label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
              Ngày kết thúc
            </label>
            <input
              id="end_date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label htmlFor="applicable_products" className="block text-sm font-medium text-gray-700">
              Sản phẩm áp dụng (ID, cách nhau bằng dấu phẩy)
            </label>
            <textarea
              id="applicable_products"
              name="applicable_products"
              value={formData.applicable_products.join(', ')}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              placeholder="Nhập ID sản phẩm, ví dụ: 123, 456"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => navigate('/admin/voucher')}
              className="btn btn-ghost"
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Cập nhật Voucher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVoucher;