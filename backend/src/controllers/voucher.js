import { VoucherModel } from '../models/Voucher.js';
import { OrderModel } from '../models/OrderModel.js'; // Đảm bảo đường dẫn đúng
import Product from '../models/product.js';
import * as yup from 'yup';
import mongoose from 'mongoose';

// Schema xác thực đầu vào bằng Yup
const voucherSchema = yup.object().shape({
  code: yup.string().required('Mã voucher là bắt buộc'),
  discount_type: yup.string().oneOf(['percentage', 'fixed'], 'Loại giảm giá không hợp lệ').required(),
  value: yup.number().required().min(0),
  quantity: yup.number().required().min(1),
  min_order_value: yup.number().required().min(0),
  max_user_number: yup.number().required().min(0),
  start_date: yup.date().required(),
  end_date: yup.date().required().min(yup.ref('start_date'), 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu'),
  applicable_products: yup.array().of(yup.string().matches(/^[0-9a-fA-F]{24}$/, 'ID sản phẩm không hợp lệ')),
});

export const ListVoucher = async (req, res) => {
  try {
    const vouchers = await VoucherModel.find();
    res.status(200).send({ message: "Hiển thị danh sách voucher thành công", status: true, data: vouchers });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hiển thị danh sách voucher", error: error.message });
  }
};

export const CreateVoucher = async (req, res) => {
  try {
    await voucherSchema.validate(req.body, { abortEarly: false });
    const { value, min_order_value, applicable_products } = req.body;

    if (min_order_value >= value) {
      return res.status(400).json({
        message: "Giá trị đơn hàng tối thiểu phải nhỏ hơn giá trị giảm giá",
        status: false,
      });
    }

    if (applicable_products && applicable_products.length > 0) {
      const selectedProducts = await Product.find({ _id: { $in: applicable_products } });
      if (selectedProducts.length === 0) {
        return res.status(400).json({
          message: "Không tìm thấy sản phẩm nào trong danh sách applicable_products",
          status: false,
        });
      }
      const minPrice = Math.min(...selectedProducts.map(p => p.price));

      if (value >= minPrice) {
        return res.status(400).json({
          message: `Giá trị giảm giá phải nhỏ hơn giá sản phẩm thấp nhất (${minPrice.toLocaleString('vi-VN')}đ)`,
          status: false,
        });
      }
    }

    const vouchers = await VoucherModel.create(req.body);
    res.status(201).send({
      message: "Tạo voucher thành công",
      status: true,
      data: vouchers,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = error.inner.reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      return res.status(400).json({
        message: 'Dữ liệu không hợp lệ',
        errors,
      });
    }
    if (error.code === 11000 && error.keyPattern.code === 1) {
      return res.status(400).json({
        message: "Mã giảm giá đã tồn tại",
        status: false,
      });
    }
    console.error("Lỗi khi tạo voucher:", error);
    res.status(500).json({ message: "Lỗi tạo voucher", error: error.message });
  }
};

export const UpdateVoucher = async (req, res) => {
  try {
    const validatedData = await voucherSchema.validate(req.body, { abortEarly: false });
    const { id } = req.params;
    const { value, min_order_value, applicable_products } = validatedData;

    if (min_order_value >= value) {
      return res.status(400).json({
        message: 'Giá trị đơn hàng tối thiểu phải nhỏ hơn giá trị giảm giá',
        status: false,
      });
    }

    if (applicable_products && applicable_products.length > 0) {
      const selectedProducts = await Product.find({ _id: { $in: applicable_products } });
      if (selectedProducts.length === 0) {
        return res.status(400).json({
          message: "Không tìm thấy sản phẩm nào trong danh sách applicable_products",
          status: false,
        });
      }
      const minPrice = Math.min(...selectedProducts.map(p => p.price));

      if (value >= minPrice) {
        return res.status(400).json({
          message: `Giá trị giảm giá phải nhỏ hơn giá sản phẩm thấp nhất (${minPrice.toLocaleString('vi-VN')}đ)`,
          status: false,
        });
      }
    }

    const updatedVoucher = await VoucherModel.findByIdAndUpdate(id, validatedData, { new: true });
    if (!updatedVoucher) {
      return res.status(404).json({ message: 'Voucher không tồn tại', status: false });
    }
    res.status(200).send({
      message: 'Cập nhật voucher thành công',
      status: true,
      data: updatedVoucher,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = error.inner.reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      return res.status(400).json({
        message: 'Dữ liệu không hợp lệ',
        status: false,
        errors,
      });
    }
    if (error.code === 11000 && error.keyPattern.code === 1) {
      return res.status(400).json({
        message: "Mã giảm giá đã tồn tại",
        status: false,
      });
    }
    console.error('Lỗi khi cập nhật voucher:', error);
    res.status(500).json({ message: 'Lỗi cập nhật voucher', error: error.message, status: false });
  }
};

export const DeleteVoucher = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVoucher = await VoucherModel.findByIdAndDelete(id);
    if (!deletedVoucher) {
      return res.status(404).json({ message: "Voucher không tồn tại" });
    }
    res.status(200).send({ message: "Xoá voucher thành công", status: true, data: deletedVoucher });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xoá voucher", error: error.message });
  }
};

export const GetVoucherById = async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await VoucherModel.findById(id);
    if (!voucher) {
      return res.status(404).json({ message: "Voucher không tồn tại", status: false });
    }
    res.status(200).json({ message: "Lấy thông tin voucher thành công", status: true, data: voucher });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin voucher", error: error.message });
  }
};

// Sửa lại function ApplyVoucher trong backend để đảm bảo trả về đúng format

export const ApplyVoucher = async (req, res) => {
  try {
    const { code, user_id } = req.body;

    console.log('ApplyVoucher called, Request body:', { code, user_id });

    if (!code || typeof code !== "string") {
      console.log('Invalid code:', code);
      return res.status(400).json({
        status: false,
        message: "Vui lòng cung cấp mã voucher hợp lệ"
      });
    }

    if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
      console.log('Invalid user_id:', user_id);
      return res.status(400).json({
        status: false,
        message: "Vui lòng cung cấp user_id hợp lệ"
      });
    }

    const voucher = await VoucherModel.findOne({ 
      code: { $regex: `^${code.trim()}$`, $options: 'i' }
    });

    console.log('Voucher found:', voucher ? voucher._id : 'null');

    if (!voucher) {
      return res.status(404).json({
        status: false,
        message: "Voucher không tồn tại"
      });
    }

    // Kiểm tra voucher có active không
    if (!voucher.is_active) {
      return res.status(400).json({
        status: false,
        message: "Voucher không còn hiệu lực"
      });
    }

    // Kiểm tra ngày bắt đầu
    if (voucher.start_date && new Date(voucher.start_date) > new Date()) {
      return res.status(400).json({
        status: false,
        message: "Voucher chưa có hiệu lực"
      });
    }

    // Kiểm tra ngày kết thúc
    if (voucher.end_date && new Date(voucher.end_date) < new Date()) {
      return res.status(400).json({
        status: false,
        message: "Voucher đã hết hạn"
      });
    }

    // Kiểm tra số lượng
    if (voucher.quantity <= voucher.used_quantity) {
      return res.status(400).json({
        status: false,
        message: "Voucher đã hết lượt sử dụng"
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(user_id);
    console.log('Converted user_id to ObjectId:', userObjectId);

    // Kiểm tra số lần sử dụng của user
    const userVoucherUsage = await OrderModel.countDocuments({
      user_id: userObjectId,
      voucher_id: voucher._id,
      status: { $ne: 'cancelled' }
    });

    console.log('User voucher usage count:', userVoucherUsage);

    if (userVoucherUsage >= voucher.usage_limit_per_user) {
      return res.status(400).json({
        status: false,
        message: "Bạn đã sử dụng hết lượt áp dụng voucher này"
      });
    }

    // Trả về voucher với các field cần thiết cho frontend (loại bỏ max_discount_amount vì không tồn tại trong schema)
    const voucherResponse = {
      _id: voucher._id,
      code: voucher.code,
      discount_type: voucher.discount_type, // Đảm bảo trả về discount_type
      value: voucher.value,
      min_order_value: voucher.min_order_value,
      start_date: voucher.start_date,
      end_date: voucher.end_date,
      is_active: voucher.is_active,
      quantity: voucher.quantity,
      used_quantity: voucher.used_quantity,
      usage_limit_per_user: voucher.usage_limit_per_user
      // Loại bỏ max_discount_amount để tránh undefined và sai format
    };

    console.log('Voucher response:', voucherResponse);

    return res.status(200).json({
      status: true,
      message: "Áp dụng voucher thành công",
      data: voucherResponse
    });
  } catch (error) {
    console.error('ApplyVoucher error:', error.message);
    return res.status(500).json({
      status: false,
      message: "Lỗi khi áp dụng voucher",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};