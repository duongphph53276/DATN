import ProductVariant from "../models/productVariant.js";
import Attribute from "../models/attribute.js";
import AttributeValue from "../models/attributeValue.js";

// Thêm biến thể sản phẩm
export const createVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.create(req.body);
    return res.status(201).json({
      message: "Thêm biến thể thành công",
      status: true,
      data: variant,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Tạo biến thể thất bại",
      details: error.message,
    });
  }
};

// Lấy danh sách biến thể theo product_id
export const getVariantsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const variants = await ProductVariant.find({ product_id: productId }).lean();

    // Gắn tên attribute và value để hiển thị
    for (const variant of variants) {
      for (const attr of variant.attributes) {
        const attribute = await Attribute.findById(attr.attribute_id);
        const value = await AttributeValue.findById(attr.value_id);

        attr.attribute_name = attribute?.display_name || attribute?.name || "";
        attr.value = value?.value || "";
      }
    }

    return res.status(200).json({
      message: "Lấy danh sách biến thể thành công",
      status: true,
      data: variants,
    });
  } catch (error) {
    return res.status(500).json({ error: "Không thể lấy biến thể", details: error.message });
  }
};

// Lấy chi tiết biến thể theo ID
export const getVariantById = async (req, res) => {
  try {
    const { id } = req.params;
    const variant = await ProductVariant.findById(id).lean();

    if (!variant) {
      return res.status(404).json({ message: "Biến thể không tồn tại" });
    }

    for (const attr of variant.attributes) {
      const attribute = await Attribute.findById(attr.attribute_id);
      const value = await AttributeValue.findById(attr.value_id);
      attr.attribute_name = attribute?.display_name || attribute?.name || "";
      attr.value = value?.value || "";
    }

    return res.status(200).json({
      message: "Lấy chi tiết biến thể thành công",
      data: variant,
    });
  } catch (error) {
    return res.status(500).json({ error: "Lỗi lấy chi tiết biến thể", details: error.message });
  }
};

// Cập nhật biến thể
export const updateVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ProductVariant.findByIdAndUpdate(id, req.body, { new: true });

    return res.status(200).json({
      message: "Cập nhật biến thể thành công",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ error: "Lỗi cập nhật biến thể", details: error.message });
  }
};

// Xoá biến thể
export const deleteVariant = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductVariant.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Xoá biến thể thành công",
    });
  } catch (error) {
    return res.status(500).json({ error: "Lỗi xoá biến thể", details: error.message });
  }
};
