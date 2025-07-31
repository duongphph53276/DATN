// backend/src/controllers/user/address.js
import { AddressModel } from '../../models/User/address.js';
import { UserModel } from '../../models/User/user.js';

export const createAddress = async (req, res) => {
  const { user_id, street, city, postal_code, country, is_default } = req.body;
  try {
    const user = await UserModel.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User không tìm thấy' });
    }

    // Nếu là địa chỉ mặc định, đặt các địa chỉ khác của user thành không mặc định
    if (is_default) {
      await AddressModel.updateMany({ user_id }, { is_default: false });
    }

    const address = new AddressModel({ user_id, street, city, postal_code, country, is_default });
    await address.save();
    res.status(201).json({
      status: true,
      message: 'Tạo địa chỉ thành công',
      data: address,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: 'Lỗi khi tạo địa chỉ',
      error: error.message,
    });
  }
};

export const getAddressesByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const addresses = await AddressModel.find({ user_id }).populate('user_id');
    if (!addresses.length) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }
    res.status(200).json({
      status: true,
      message: 'Lấy danh sách địa chỉ thành công',
      data: addresses,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Lỗi server khi lấy danh sách địa chỉ',
      error: error.message,
    });
  }
};

export const getAddressById = async (req, res) => {
  const { id } = req.params;
  try {
    const address = await AddressModel.findById(id).populate('user_id');
    if (!address) {
      return res.status(404).json({ message: 'Địa chỉ không tìm thấy' });
    }
    res.status(200).json({
      status: true,
      message: 'Lấy thông tin địa chỉ thành công',
      data: address,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Lỗi server khi lấy thông tin địa chỉ',
      error: error.message,
    });
  }
};

export const updateAddress = async (req, res) => {
  const { id } = req.params;
  const { street, city, postal_code, country, is_default } = req.body;
  try {
    const address = await AddressModel.findById(id);
    if (!address) {
      return res.status(404).json({ message: 'Địa chỉ không tìm thấy' });
    }

    if (is_default && address.is_default !== is_default) {
      await AddressModel.updateMany({ user_id: address.user_id, _id: { $ne: id } }, { is_default: false });
    }

    const updatedAddress = await AddressModel.findByIdAndUpdate(
      id,
      { street, city, postal_code, country, is_default, updated_at: Date.now() },
      { new: true, runValidators: true }
    ).populate('user_id');
    res.status(200).json({
      status: true,
      message: 'Cập nhật địa chỉ thành công',
      data: updatedAddress,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: 'Lỗi khi cập nhật địa chỉ',
      error: error.message,
    });
  }
};

export const deleteAddress = async (req, res) => {
  const { id } = req.params;
  try {
    const address = await AddressModel.findByIdAndDelete(id);
    if (!address) {
      return res.status(404).json({ message: 'Địa chỉ không tìm thấy' });
    }
    res.status(200).json({
      status: true,
      message: 'Xóa địa chỉ thành công',
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Lỗi khi xóa địa chỉ',
      error: error.message,
    });
  }
};