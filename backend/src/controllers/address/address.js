import { AddressModel } from '../../models/User/address.js';

// Lấy tất cả địa chỉ của người dùng
export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await AddressModel.find({ user_id: userId }).sort({ is_default: -1, createdAt: -1 });
    
    res.status(200).json({
      status: true,
      message: "Lấy danh sách địa chỉ thành công",
      data: addresses
    });
  } catch (error) {
    console.log('Error in getUserAddresses:', error);
    res.status(500).json({
      status: false,
      message: "Lỗi server khi lấy danh sách địa chỉ",
      error: error.message
    });
  }
};

// Tạo địa chỉ mới
export const createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { street, city, postal_code, country, is_default } = req.body;

    // Kiểm tra số lượng địa chỉ hiện tại
    const currentAddresses = await AddressModel.find({ user_id: userId });
    if (currentAddresses.length >= 5) {
      return res.status(400).json({
        status: false,
        message: "Bạn đã đạt giới hạn tối đa 5 địa chỉ"
      });
    }

    // Nếu địa chỉ mới là mặc định, bỏ mặc định của các địa chỉ khác
    if (is_default) {
      await AddressModel.updateMany(
        { user_id: userId },
        { is_default: false }
      );
    }

    const newAddress = new AddressModel({
      user_id: userId,
      street,
      city,
      postal_code,
      country,
      is_default: is_default || false
    });

    await newAddress.save();

    res.status(201).json({
      status: true,
      message: "Tạo địa chỉ thành công",
      data: newAddress
    });
  } catch (error) {
    console.log('Error in createAddress:', error);
    res.status(500).json({
      status: false,
      message: "Lỗi server khi tạo địa chỉ",
      error: error.message
    });
  }
};

// Cập nhật địa chỉ
export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;
    const { street, city, postal_code, country, is_default } = req.body;

    const address = await AddressModel.findOne({ _id: addressId, user_id: userId });
    if (!address) {
      return res.status(404).json({
        status: false,
        message: "Địa chỉ không tồn tại"
      });
    }

    // Nếu địa chỉ này được đặt làm mặc định, bỏ mặc định của các địa chỉ khác
    if (is_default && !address.is_default) {
      await AddressModel.updateMany(
        { user_id: userId, _id: { $ne: addressId } },
        { is_default: false }
      );
    }

    // Cập nhật thông tin địa chỉ
    address.street = street || address.street;
    address.city = city || address.city;
    address.postal_code = postal_code || address.postal_code;
    address.country = country || address.country;
    address.is_default = is_default !== undefined ? is_default : address.is_default;

    await address.save();

    res.status(200).json({
      status: true,
      message: "Cập nhật địa chỉ thành công",
      data: address
    });
  } catch (error) {
    console.log('Error in updateAddress:', error);
    res.status(500).json({
      status: false,
      message: "Lỗi server khi cập nhật địa chỉ",
      error: error.message
    });
  }
};

// Xóa địa chỉ
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await AddressModel.findOne({ _id: addressId, user_id: userId });
    if (!address) {
      return res.status(404).json({
        status: false,
        message: "Địa chỉ không tồn tại"
      });
    }

    await AddressModel.findByIdAndDelete(addressId);

    // Nếu địa chỉ bị xóa là mặc định, đặt địa chỉ đầu tiên làm mặc định
    if (address.is_default) {
      const remainingAddresses = await AddressModel.find({ user_id: userId }).sort({ createdAt: 1 });
      if (remainingAddresses.length > 0) {
        remainingAddresses[0].is_default = true;
        await remainingAddresses[0].save();
      }
    }

    res.status(200).json({
      status: true,
      message: "Xóa địa chỉ thành công"
    });
  } catch (error) {
    console.log('Error in deleteAddress:', error);
    res.status(500).json({
      status: false,
      message: "Lỗi server khi xóa địa chỉ",
      error: error.message
    });
  }
};

// Đặt địa chỉ làm mặc định
export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await AddressModel.findOne({ _id: addressId, user_id: userId });
    if (!address) {
      return res.status(404).json({
        status: false,
        message: "Địa chỉ không tồn tại"
      });
    }

    // Bỏ mặc định của tất cả địa chỉ
    await AddressModel.updateMany(
      { user_id: userId },
      { is_default: false }
    );

    // Đặt địa chỉ này làm mặc định
    address.is_default = true;
    await address.save();

    res.status(200).json({
      status: true,
      message: "Đặt địa chỉ mặc định thành công",
      data: address
    });
  } catch (error) {
    console.log('Error in setDefaultAddress:', error);
    res.status(500).json({
      status: false,
      message: "Lỗi server khi đặt địa chỉ mặc định",
      error: error.message
    });
  }
}; 