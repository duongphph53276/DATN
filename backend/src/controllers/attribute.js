import Attribute from "../models/attribute.js";
import variantAttributeValue from "../models/variantAttributeValue.js";
import attributeValue from "../models/attributeValue.js";

// Tạo Attribute
export const createAttribute = async (req, res) => {
  try {
    let { name, display_name} = req.body;

    if (!name || !display_name) {
      return res.status(400).json({ message: "Tên và tên hiển thị là bắt buộc." });
    }

    // Chuẩn hóa name: trim và lowercase
    name = name.trim().toLowerCase();

    // Kiểm tra trùng name (không phân biệt hoa thường)
    const existing = await Attribute.findOne({ name });
    if (existing) {
      return res.status(400).json({
        message: "Tên thuộc tính đã tồn tại, vui lòng chọn tên khác."
      });
    }

    // Tạo mới attribute với name đã chuẩn hóa
    const attribute = await Attribute.create({ ...req.body, name });
    return res.status(201).json({
      message: "Thêm attribute thành công",
      status: true,
      data: attribute
    });
  } catch (err) {
    return res.status(500).json({
      error: "Tạo attribute thất bại",
      details: err?.errors || err
    });
  }
};
// Lấy tất cả attribute
export const getAllAttributes = async (req, res) => {
    try {
        const attributes = await Attribute.find();
        return res.status(200).json({
            message: "Hiển thị attribute thành công",
            status: true,
            data: attributes
        });
    } catch (err) {
        return res.status(500).json({ error: "Lỗi khi lấy attribute", details: err });
    }
};
export const getAttributeById = async (req, res) => {
    try {
        const attribute = await Attribute.findById(req.params.id);
        if (!attribute) {
            return res.status(404).json({ message: "Không tìm thấy thuộc tính" });
        }
        return res.status(200).json({
            message: "Lấy thuộc tính thành công",
            status: true,
            data: attribute
        });
    } catch (err) {
        return res.status(500).json({ message: "Lỗi khi lấy thuộc tính", error: err });
    }
};
export const updateAttribute = async (req, res) => {
    try {
        const attribute = await Attribute.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.json(attribute);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi cập nhật thuộc tính", error });
    }
};

export const deleteAttribute = async (req, res) => {
    const attributeId = req.params.id;

    try {
        // 1. Kiểm tra xem Attribute có đang được sử dụng trong biến thể không
        const usedInVariants = await variantAttributeValue.exists({ attribute_id: attributeId });
        if (usedInVariants) {
            return res.status(400).json({
                message: "Không thể xóa thuộc tính vì đang được sử dụng trong biến thể sản phẩm."
            });
        }

        // 2. Xóa các AttributeValue liên quan
        await attributeValue.deleteMany({ attribute_id: attributeId });

        // 3. Xóa Attribute
        const deleted = await Attribute.findByIdAndDelete(attributeId);
        if (!deleted) return res.status(404).json({ message: "Không tìm thấy thuộc tính" });

        return res.json({ message: "Đã xoá thuộc tính" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi xoá thuộc tính", error });
    }
};




