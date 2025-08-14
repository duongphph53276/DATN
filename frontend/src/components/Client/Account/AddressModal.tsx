import React, { useEffect, useState } from 'react';
import { Address } from '../../../interfaces/user';
import { getAddress, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '../../../services/api/address';
import { getProvinces } from '../../../services/api/shipping';
import { FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, FaStar, FaTimes, FaCheck } from 'react-icons/fa';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: Address) => void;
  currentAddress?: Address | null;
}

const AddressModal: React.FC<AddressModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectAddress, 
  currentAddress 
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    postal_code: '',
    country: 'Việt Nam',
    is_default: false
  });
  const [provinces, setProvinces] = useState<string[]>([]);

  // Fetch addresses when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('🚀 Modal mở, bắt đầu fetch data...');
      fetchAddresses();
      fetchProvinces();
    }
  }, [isOpen]);

  // Debug provinces state
  useEffect(() => {
    console.log('🏛️ Provinces state updated:', provinces);
  }, [provinces]);

  const fetchProvinces = async () => {
    try {
      console.log('🔄 Đang tải danh sách tỉnh thành...');
      const response = await getProvinces();
      console.log('📦 Response provinces:', response);
      if (response.status === 200) {
        const provincesData = response.data.data || [];
        console.log('🏛️ Danh sách tỉnh thành:', provincesData);
        setProvinces(provincesData);
      }
    } catch (err) {
      console.error('❌ Lỗi khi tải danh sách tỉnh thành:', err);
    }
  };

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await getAddress();
      if (response.status === 200) {
        setAddresses(response.data.data || []);
      }
    } catch (err) {
      setError('Lỗi khi tải danh sách địa chỉ');
    } finally {
      setLoading(false);
    }
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingAddress) {
        const response = await updateAddress(editingAddress._id, formData);
        if (response.status === 200) {
          setAddresses(prev => 
            prev.map(addr => 
              addr._id === editingAddress._id ? response.data.data : addr
            )
          );
          setSuccess('Cập nhật địa chỉ thành công');
        }
      } else {
        const response = await createAddress(formData);
        if (response.status === 201) {
          setAddresses(prev => [...prev, response.data.data]);
          setSuccess('Thêm địa chỉ thành công');
        }
      }
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;

    try {
      await deleteAddress(addressId);
      setAddresses(prev => prev.filter(addr => addr._id !== addressId));
      setSuccess('Xóa địa chỉ thành công');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi xóa địa chỉ');
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId);
      setAddresses(prev => 
        prev.map(addr => ({
          ...addr,
          is_default: addr._id === addressId
        }))
      );
      setSuccess('Đặt địa chỉ mặc định thành công');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi đặt địa chỉ mặc định');
    }
  };

  const handleEdit = (address: Address) => {
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

  const handleSelectAndClose = (address: Address) => {
    onSelectAddress(address);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center">
            🏠 <span className="ml-2">Quản lý địa chỉ giao hàng</span>
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
              <span className="mr-2">❌</span>
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
              <span className="mr-2">✅</span>
              {success}
            </div>
          )}

          {/* Add Address Button */}
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Chọn địa chỉ giao hàng ({addresses.length}/5)
            </h3>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 transition-all"
              disabled={addresses.length >= 5}
            >
              <FaPlus /> Thêm địa chỉ
            </button>
          </div>

          {/* Address Form */}
          {showForm && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-6 border-2 border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-800">
                  {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
                </h4>
                <button
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ chi tiết <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                      placeholder="Số nhà, tên đường..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thành phố/Tỉnh <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                      required
                    >
                      <option value="">Chọn tỉnh thành ({provinces.length} tỉnh)</option>
                      {provinces.map((province, index) => (
                        <option key={index} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã bưu điện
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                      placeholder="100000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quốc gia <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Đặt làm địa chỉ mặc định
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-2 rounded-full font-semibold transition-all disabled:opacity-50"
                  >
                    {loading ? 'Đang xử lý...' : (editingAddress ? 'Cập nhật' : 'Thêm địa chỉ')}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full font-semibold transition-all"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Address List */}
          <div className="space-y-4">
            {loading && !showForm ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Đang tải...</p>
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <FaMapMarkerAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Chưa có địa chỉ nào</p>
                <p className="text-gray-400 text-sm">Hãy thêm địa chỉ đầu tiên để tiếp tục</p>
              </div>
            ) : (
              addresses.map((address) => (
                <div
                  key={address._id}
                  className={`border-2 rounded-2xl p-4 transition-all cursor-pointer hover:shadow-lg ${
                    currentAddress?._id === address._id
                      ? 'border-pink-500 bg-pink-50'
                      : address.is_default
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSelectAndClose(address)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FaMapMarkerAlt className="text-pink-500" />
                        {address.is_default && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                            <FaStar className="text-xs" />
                            Mặc định
                          </span>
                        )}
                        {currentAddress?._id === address._id && (
                          <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                            <FaCheck className="text-xs" />
                            Đang chọn
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-800 font-semibold text-lg mb-1">{address.street}</p>
                      <p className="text-gray-600">
                        {address.city}, {address.country}
                        {address.postal_code && ` - ${address.postal_code}`}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {!address.is_default && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetDefault(address._id);
                          }}
                          className="text-yellow-600 hover:text-yellow-700 p-2 hover:bg-yellow-50 rounded-full transition-colors"
                          title="Đặt làm mặc định"
                        >
                          <FaStar />
                        </button>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(address);
                        }}
                        className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-full transition-colors"
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(address._id);
                        }}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
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
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full font-semibold transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
