import React, { useEffect, useState } from 'react';
import { IErrorResponse, ISingleVoucherResponse, IExtendedEditVoucherRequest } from '../../../interfaces/voucher';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IProduct } from '../../../interfaces/product';

const EditVoucher = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<IExtendedEditVoucherRequest>({
    code: '',
    value: '',
    discount_type: 'percentage',
    start_date: '',
    end_date: '',
    quantity: 0,
    min_order_value: 0,
    applicable_products: [],
  });

  const [error, setError] = useState<{ message?: string; errors?: Record<string, string> }>({});
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [productSelectionType, setProductSelectionType] = useState<'all' | 'specific'>('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/product');
        if (res.data.status) {
          const list = res.data.data.map((p: any) => ({ ...p, _id: p._id.toString() }));
          setProducts(list);
          setFilteredProducts(list);
        }
      } catch (err) {
        console.error('Lỗi lấy sản phẩm:', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const res = await axios.get<ISingleVoucherResponse>(`http://localhost:5000/vouchers/${id}`);
        if (res.data.status) {
          const v = res.data.data;
          setFormData({
            code: v.code,
            value: v.value,
            discount_type: v.discount_type as 'percentage' | 'fixed',
            start_date: new Date(v.start_date).toISOString().split('T')[0],
            end_date: new Date(v.end_date).toISOString().split('T')[0],
            quantity: v.quantity || 0,
            min_order_value: v.min_order_value || 0,
            applicable_products: v.applicable_products || [],
          });
          if (v.applicable_products?.length) {
            setProductSelectionType('specific');
            setSelectedProducts(v.applicable_products.map(p => String(p)));
          } else {
            setProductSelectionType('all');
            setSelectedProducts([]);
          }
        } else setError({ message: res.data.message || 'Không tìm thấy voucher' });
      } catch (err) {
        const e = err as IErrorResponse;
        setError({ message: e.message || 'Lỗi khi tải voucher' });
      }
    };
    if (id) fetchVoucher();
  }, [id]);

  const formatInputValue = (value: number | string) => {
    if (!value) return '';
    const num = typeof value === 'string' ? parseFloat(value.replace(/\./g, '')) : value;
    return num.toLocaleString('vi-VN');
  };

  const getUnit = () => (formData.discount_type === 'percentage' ? '%' : 'VND');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const cleaned = value.replace(/\./g, '');

    if (name === 'value' || name === 'min_order_value') {
      const numValue = parseFloat(cleaned || '0');
      if (name === 'value' && formData.discount_type === 'percentage' && (numValue < 0 || numValue > 100)) {
        setError({ errors: { value: 'Phần trăm từ 0 đến 100' } });
      } else if (name === 'value' && formData.discount_type === 'fixed' && numValue < 0) {
        setError({ errors: { value: 'Tiền không âm' } });
      } else if (name === 'min_order_value' && formData.discount_type === 'percentage' && numValue < 0) {
        setError({ errors: { min_order_value: 'Giá trị đơn hàng tối thiểu không được nhỏ hơn 0 khi giảm theo phần trăm' } });
      } else if (name === 'min_order_value' && formData.discount_type === 'fixed' && numValue < 0) {
        setError({ errors: { min_order_value: 'Giá trị đơn hàng tối thiểu không được nhỏ hơn 0 khi giảm theo số tiền' } });
      } else {
        setError({});
        setFormData(prev => ({ ...prev, [name]: numValue }));
      }
      return;
    }

    if (['quantity'].includes(name)) {
      const numValue = parseInt(cleaned || '0');
      setFormData(prev => ({ ...prev, [name]: numValue }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setCurrentPage(1);
    const filtered = term
      ? products.filter(p => p.name.toLowerCase().includes(term) || (p.sku?.toLowerCase().includes(term)))
      : products;
    setFilteredProducts(filtered);
  };

  const handleProductSelection = (id: string) => {
    const updated = selectedProducts.includes(id)
      ? selectedProducts.filter(p => p !== id)
      : [...selectedProducts, id];
    setSelectedProducts(updated);
    setFormData(prev => ({ ...prev, applicable_products: updated }));
  };

  const handleProductSelectionTypeChange = (type: 'all' | 'specific') => {
    setProductSelectionType(type);
    if (type === 'all') {
      setSelectedProducts([]);
      setFormData(prev => ({ ...prev, applicable_products: [] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);

    if (start > end) {
      setError({
        message: 'Ngày không hợp lệ',
        errors: {
          start_date: 'Ngày bắt đầu không được lớn hơn ngày kết thúc',
          end_date: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
        },
      });
      return;
    }

    try {
      const payload = {
        ...formData,
        value: Number(formData.value),
        min_order_value: Number(formData.min_order_value),
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        applicable_products: productSelectionType === 'all' ? [] : selectedProducts,
      };

      const res = await axios.put(`http://localhost:5000/vouchers/${id}`, payload);
      if (res.data.status) {
        alert('Cập nhật thành công');
        navigate('/admin/voucher');
      } else {
        setError({ message: res.data.message || 'Không thể cập nhật' });
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const e = err.response.data as IErrorResponse;
        if (e && typeof e.error === 'object') {
          setError({ message: e.message, errors: e.error });
        } else {
          setError({ message: e?.message || 'Lỗi khi cập nhật' });
        }
      } else {
        setError({ message: 'Lỗi không xác định' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Sửa Voucher</h1>
        {error.message && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error.message}
            {error.errors && (
              <ul className="mt-2 list-disc pl-5">
                {Object.entries(error.errors).map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Mã Voucher</label>
              <input
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập mã voucher"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Loại giảm giá</label>
              <select
                name="discount_type"
                value={formData.discount_type}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="percentage">Phần trăm</option>
                <option value="fixed">Tiền mặt</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Giá trị giảm ({getUnit()})</label>
              <input
                name="value"
                value={formatInputValue(formData.value)}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Nhập giá trị giảm (${getUnit()})`}
                onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
              />
              {error.errors?.value && <p className="text-red-500 text-sm mt-1">{error.errors.value}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Số lượng voucher</label>
              <input
                name="quantity"
                value={formatInputValue(formData.quantity)}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập số lượng"
                onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Giá trị đơn hàng tối thiểu (VND)</label>
              <input
                name="min_order_value"
                value={formatInputValue(formData.min_order_value)}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập giá trị tối thiểu (VND)"
                onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
              />
              {error.errors?.min_order_value && <p className="text-red-500 text-sm mt-1">{error.errors.min_order_value}</p>}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Ngày bắt đầu</label>
              <input
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange} required
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {error.errors?.start_date && <p className="text-red-500 text-sm mt-1">{error.errors.start_date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Ngày kết thúc</label>
              <input
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                required
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {error.errors?.end_date && <p className="text-red-500 text-sm mt-1">{error.errors.end_date}</p>}
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={productSelectionType === 'all'}
                  onChange={() => handleProductSelectionTypeChange('all')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Áp dụng cho tất cả sản phẩm</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={productSelectionType === 'specific'}
                  onChange={() => handleProductSelectionTypeChange('specific')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Chọn sản phẩm cụ thể</span>
              </label>
            </div>
          </div>
          {productSelectionType === 'specific' && (
            <div className="col-span-2 space-y-4">
              <input
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500">Đã chọn: {selectedProducts.length} sản phẩm</p>
              <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-4">
                {currentProducts.map(product => (
                  <div key={product._id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(String(product._id))}
                      onChange={() => handleProductSelection(String(product._id))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">
                      {product.name} {product.sku && `(${product.sku})`}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-200"
                >
                  ←
                </button>
                <span className="text-sm text-gray-600">Trang {currentPage} / {totalPages}</span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg disabled:opacity-50 hover:bg-gray-200"
                >
                  →
                </button>
              </div>
            </div>
          )}
          <div className="col-span-2 mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/voucher')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Cập nhật Voucher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVoucher;