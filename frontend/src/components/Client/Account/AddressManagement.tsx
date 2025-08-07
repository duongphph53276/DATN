import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, FaStar, FaStar as FaStarOutline } from 'react-icons/fa';
import { Address } from '../../../interfaces/user';

const AddressManagement: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    postal_code: '',
    country: 'Việt Nam',
    is_default: false
  });

  // Lấy danh sách địa chỉ
  const fetchAddresses = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Bạn cần đăng nhập để quản lý địa chỉ');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/addresses', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.status) {
        setAddresses(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Lỗi khi tải danh sách địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      street: '',
      city: '',
      postal_code: '',
      country: 'Việt Nam',
      is_default: false
    });
    setEditingAddress(null);
    setShowForm(false);
  };

  // Tạo địa chỉ mới
  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5001/addresses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.status) {
        setAddresses([...addresses, data.data]);
        resetForm();
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Lỗi khi tạo địa chỉ');
    }
  };

  // Cập nhật địa chỉ
  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5001/addresses/${editingAddress._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.status) {
        setAddresses(addresses.map(addr => 
          addr._id === editingAddress._id ? data.data : addr
        ));
        resetForm();
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Lỗi khi cập nhật địa chỉ');
    }
  };

  // Xóa địa chỉ
  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5001/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.status) {
        setAddresses(addresses.filter(addr => addr._id !== addressId));
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Lỗi khi xóa địa chỉ');
    }
  };

  // Đặt địa chỉ làm mặc định
  const handleSetDefault = async (addressId: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5001/addresses/${addressId}/default`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.status) {
        setAddresses(addresses.map(addr => ({
          ...addr,
          is_default: addr._id === addressId
        })));
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Lỗi khi đặt địa chỉ mặc định');
    }
  };

  // Bắt đầu chỉnh sửa
  const startEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      street: address.street,
      city: address.city,
      postal_code: address.postal_code || '',
      country: address.country,
      is_default: address.is_default
    });
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500 text-lg">Đang tải...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-14 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 transition-all duration-300 hover:shadow-pink-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Quản lý địa chỉ</h2>
          <button
            onClick={() => setShowForm(true)}
            className="text-sm text-white bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-full shadow transition flex items-center gap-2"
          >
            <FaPlus /> Thêm địa chỉ
          </button>
        </div>

        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

        {/* Form thêm/sửa địa chỉ */}
        {showForm && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </h3>
            <form onSubmit={editingAddress ? handleUpdateAddress : handleCreateAddress} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đường/Phố</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                    placeholder="Nhập tên đường/phố..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố/Tỉnh</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                    placeholder="Nhập thành phố/tỉnh..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã bưu điện</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                    placeholder="Nhập mã bưu điện..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quốc gia</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                    placeholder="Nhập quốc gia..."
                    required
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Đặt làm địa chỉ mặc định</label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="text-sm text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full shadow transition"
                >
                  {editingAddress ? 'Cập nhật' : 'Thêm địa chỉ'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm text-white bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-full shadow transition"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Danh sách địa chỉ */}
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FaMapMarkerAlt className="text-4xl mx-auto mb-4 text-gray-300" />
              <p>Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ đầu tiên!</p>
            </div>
          ) : (
            addresses.map((address) => (
              <div
                key={address._id}
                className={`border rounded-lg p-4 transition-all ${
                  address.is_default
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt className="text-pink-500" />
                      {address.is_default && (
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                          <FaStar className="text-yellow-500" />
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 font-medium">{address.street}</p>
                    <p className="text-gray-600">
                      {address.city}, {address.country}
                      {address.postal_code && ` - ${address.postal_code}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!address.is_default && (
                      <button
                        onClick={() => handleSetDefault(address._id)}
                        className="text-yellow-600 hover:text-yellow-700 p-2"
                        title="Đặt làm mặc định"
                      >
                        <FaStarOutline />
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(address)}
                      className="text-blue-600 hover:text-blue-700 p-2"
                      title="Chỉnh sửa"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address._id)}
                      className="text-red-600 hover:text-red-700 p-2"
                      title="Xóa"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Thông tin giới hạn */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Bạn có thể thêm tối đa 5 địa chỉ. Hiện tại: {addresses.length}/5
        </div>
      </div>
    </div>
  );
};

export default AddressManagement; 