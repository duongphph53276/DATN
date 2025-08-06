import { VoucherModel } from '../models/Voucher.js';
import Product from '../models/product.js';
import * as yup from 'yup';

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