import ProductVariant from "../models/productVariant.js";
import VariantAttributeValue from "../models/variantAttributeValue.js";
// Hàm so sánh tổ hợp thuộc tính
function isSameAttributes(existingAttrs, newAttrs) {
  if (existingAttrs.length !== newAttrs.length) return false;

  const sortAttrs = (arr) =>
    [...arr].sort((a, b) =>
      a.attribute_id.toString().localeCompare(b.attribute_id.toString())
    );

  const sortedExisting = sortAttrs(existingAttrs);
  const sortedNew = sortAttrs(newAttrs);

  return sortedExisting.every((attr, index) =>
    attr.attribute_id.toString() === sortedNew[index].attribute_id.toString() &&
    attr.value_id.toString() === sortedNew[index].value_id.toString()
  );
}

// Thêm biến thể sản phẩm (có kiểm tra trùng)
export const createVariant = async (req, res) => {
  try {
    const { attributes, ...variantData } = req.body;

    // ✅ B1: Tìm tất cả biến thể cùng product_id
    const existingVariants = await ProductVariant.find({ product_id: variantData.product_id });

    // ✅ B2: Lặp từng biến thể để lấy thuộc tính và so sánh
    for (let variant of existingVariants) {
      const variantAttrs = await VariantAttributeValue.find({ variant_id: variant._id }).lean();

      if (isSameAttributes(variantAttrs, attributes)) {
        return res.status(400).json({
          message: "Biến thể với tổ hợp thuộc tính này đã tồn tại",
          status: false
        });
      }
    }

    // ✅ B3: Nếu không trùng thì tạo
    const variant = await ProductVariant.create(variantData);

    if (attributes && attributes.length > 0) {
      const variantAttrValues = attributes.map(attr => ({
        variant_id: variant._id,
        attribute_id: attr.attribute_id,
        value_id: attr.value_id,
      }));
      await VariantAttributeValue.insertMany(variantAttrValues);
    }

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

    for (const variant of variants) {
      const variantAttrs = await VariantAttributeValue.find({ variant_id: variant._id })
        .populate('attribute_id')
        .populate('value_id')
        .lean();
      variant.attributes = variantAttrs.map(attr => ({
        attribute_name: attr.attribute_id.display_name || attr.attribute_id.name || "",
        value: attr.value_id.value || "",
      }));
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

    const variantAttrs = await VariantAttributeValue.find({ variant_id: id })
      .populate('attribute_id')
      .populate('value_id')
      .lean();
    variant.attributes = variantAttrs.map(attr => ({
      attribute_name: attr.attribute_id.display_name || attr.attribute_id.name || "",
      value: attr.value_id.value || "",
    }));

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
    const { attributes, ...variantData } = req.body;

    const updated = await ProductVariant.findByIdAndUpdate(id, variantData, { new: true });

    // Xóa các bản ghi cũ trong VariantAttributeValue
    await VariantAttributeValue.deleteMany({ variant_id: id });

    // Thêm lại các bản ghi mới nếu có attributes
    if (attributes && attributes.length > 0) {
      const variantAttrValues = attributes.map(attr => ({
        variant_id: id,
        attribute_id: attr.attribute_id,
        value_id: attr.value_id,
      }));
      await VariantAttributeValue.insertMany(variantAttrValues);
    }

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
    await VariantAttributeValue.deleteMany({ variant_id: id });
    await ProductVariant.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Xoá biến thể thành công",
    });
  } catch (error) {
    return res.status(500).json({ error: "Lỗi xoá biến thể", details: error.message });
  }
};
