import Product from "../models/product.js";
import ProductVariant from "../models/productVariant.js";
import VariantAttributeValue from "../models/variantAttributeValue.js";
import { generateSku } from "../utils/generateSku.js";

export const createProduct = async (req, res) => {
  try {
    console.log("Payload received:", req.body); // Log payload để debug

    // Nếu không truyền SKU thì generate tự động
    if (!req.body.sku || req.body.sku.trim() === "") {
      req.body.sku = await generateSku();
    }

    const { name, description, category_id, variants } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !category_id || !variants || !Array.isArray(variants)) {
      throw new Error("Dữ liệu đầu vào không hợp lệ: name, category_id hoặc variants không tồn tại.");
    }

    // Tạo sản phẩm
    const product = await Product.create({
      name,
      description,
      category_id,
      images: req.body.images || "",
      album: req.body.album || [],
      sku: req.body.sku,
      status: req.body.status || "active",
    });
    console.log("Product created:", product); // Log để kiểm tra

    // Tạo các biến thể
    const variantPromises = variants.map(async (variant, index) => {
      try {
        console.log(`Processing variant ${index}:`, variant); // Log từng variant
        if (!variant.price || !variant.quantity || !variant.attributes || !Array.isArray(variant.attributes)) {
          throw new Error(`Dữ liệu biến thể không hợp lệ tại index ${index}: ${JSON.stringify(variant)}`);
        }

        const newVariant = await ProductVariant.create({
          product_id: product._id,
          price: variant.price,
          quantity: variant.quantity,
          image: variant.image || "",
        });
        console.log("Variant created:", newVariant); // Log để kiểm tra

        // Tạo mối quan hệ thuộc tính cho biến thể
        const attributePromises = variant.attributes.map(async (attr, attrIndex) => {
          console.log(`Processing attribute ${attrIndex} for variant ${index}:`, attr); // Log từng attribute
          if (!attr || !attr.attribute_id || !attr.value_id) {
            throw new Error(`Thuộc tính không hợp lệ tại index ${attrIndex} của variant ${index}: ${JSON.stringify(attr)}`);
          }
          const createdAttr = await VariantAttributeValue.create({
            variant_id: newVariant._id,
            attribute_id: attr.attribute_id,
            value_id: attr.value_id,
          });
          console.log("Attribute created:", createdAttr); // Log để kiểm tra
          return createdAttr;
        });
        await Promise.all(attributePromises);

        // Lấy attributes từ VariantAttributeValue
        const attributes = await VariantAttributeValue.find({ variant_id: newVariant._id })
          .populate("attribute_id value_id")
          .lean(); // Sử dụng lean để tránh vấn đề với Mongoose documents

        return {
          ...newVariant.toObject(),
          attributes: attributes.map((attr) => ({
            attribute_id: attr.attribute_id?._id || null,
            value_id: attr.value_id?._id || null,
            attribute_name: attr.attribute_id?.name || "Unknown",
            value: attr.value_id?.value || "Unknown",
          })),
        };
      } catch (variantErr) {
        console.error(`Lỗi tạo biến thể tại index ${index}:`, variantErr.stack || variantErr);
        throw variantErr; // Ném lỗi để xử lý ở cấp cao hơn
      }
    });

    const createdVariants = await Promise.all(variantPromises);

    return res.status(201).json({
      message: "Thêm sản phẩm và biến thể thành công",
      data: { product, variants: createdVariants },
    });
  } catch (err) {
    console.error("Lỗi createProduct:", err.stack || err); // Log stack trace để debug
    return res.status(500).json({ message: "Lỗi server", error: err.message || err.toString() });
  }
};

// Lấy danh sách tất cả sản phẩm
export const getAllProducts = async (req, res) => {
  try {
    
    const products = await Product.find().populate("category_id").lean();

    const productIds = products.map((p) => p._id);

    const variants = await ProductVariant.find({ product_id: { $in: productIds } }).lean();

    // Lấy toàn bộ VariantAttributeValue
    const variantIds = variants.map(v => v._id);
    
    const attributeValues = await VariantAttributeValue.find({ variant_id: { $in: variantIds } })
      .populate("attribute_id value_id")
      .lean();

    // Gắn attributes cho từng variant
    const variantsWithAttrs = variants.map((variant) => {
      const attrs = attributeValues.filter(attr => attr.variant_id.toString() === variant._id.toString());
      return {
        ...variant,
        attributes: attrs.map(attr => ({
          attribute_id: attr.attribute_id?._id || null,
          value_id: attr.value_id?._id || null,
          attribute_name: attr.attribute_id?.name || "Unknown",
          value: attr.value_id?.value || "Unknown",
        }))
      };
    });

    // Gộp biến thể vào sản phẩm
    const productsWithVariants = products.map((product) => ({
      ...product,
      variants: variantsWithAttrs.filter(v => v.product_id.toString() === product._id.toString())
    }));

    return res.status(200).send({
      message: "Lấy danh sách sản phẩm thành công",
      status: true,
      data: productsWithVariants,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error });
  }
};

export const getProductById = async (req, res) => {
  try {
    console.log("Request ID:", req.params.id);
    const product = await Product.findById(req.params.id).populate("category_id").lean();
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    const variants = await ProductVariant.find({ product_id: req.params.id }).lean();
    console.log("Raw variants from DB:", variants); // Log raw variants

    const variantIds = variants.map(v => v._id);
    const attributeValues = await VariantAttributeValue.find({ variant_id: { $in: variantIds } })
      .populate("attribute_id value_id")
      .lean();
    console.log("Attribute values:", attributeValues); // Log attributes

    const variantsWithAttrs = variants.map((variant) => {
      const attrs = attributeValues.filter(attr => attr.variant_id.toString() === variant._id.toString());
      return {
        ...variant,
        attributes: attrs.map(attr => ({
          attribute_id: attr.attribute_id?._id || null,
          value_id: attr.value_id?._id || null,
        })),
      };
    });

    console.log("Variants with attrs:", variantsWithAttrs); // Log final variants
    return res.json({ data: { product, variants: variantsWithAttrs } });
  } catch (err) {
    console.error("Lỗi getProductById:", err);
    return res.status(500).json({ message: "Lỗi lấy sản phẩm", error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { variants, ...productData } = req.body; // Tách variants ra khỏi product data
    const productId = req.params.id;

    // Cập nhật sản phẩm
    const product = await Product.findByIdAndUpdate(productId, productData, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    // Xử lý biến thể
    if (variants && Array.isArray(variants)) {
      // Lấy danh sách _id của các biến thể hiện có
      const existingVariants = await ProductVariant.find({ product_id: productId }).lean();
      const existingVariantIds = existingVariants.map((v) => v._id.toString());

      // Cập nhật hoặc tạo mới biến thể
      const variantPromises = variants.map(async (variant) => {
        let variantId = variant._id;
        let updatedVariant;

        if (variantId) {
          // Cập nhật biến thể hiện có
          updatedVariant = await ProductVariant.findByIdAndUpdate(
            variantId,
            {
              price: variant.price,
              quantity: variant.quantity,
              image: variant.image || "",
            },
            { new: true, runValidators: true }
          );
          if (!updatedVariant) {
            throw new Error(`Không tìm thấy biến thể với ID ${variantId}`);
          }
        } else {
          // Tạo mới biến thể nếu không có _id
          updatedVariant = await ProductVariant.create({
            product_id: productId,
            price: variant.price,
            quantity: variant.quantity,
            image: variant.image || "",
          });
          variantId = updatedVariant._id;
        }

        // Xử lý attributes
        await VariantAttributeValue.deleteMany({ variant_id: variantId }); // Xóa attributes cũ
        const attributePromises = variant.attributes.map(async (attr) => {
          if (attr.attribute_id && attr.value_id) {
            return await VariantAttributeValue.create({
              variant_id: variantId,
              attribute_id: attr.attribute_id,
              value_id: attr.value_id,
            });
          }
        });
        await Promise.all(attributePromises);

        return {
          ...updatedVariant.toObject(),
          attributes: variant.attributes, // Trả về attributes từ form
        };
      });
      const updatedVariants = await Promise.all(variantPromises);

      // Xóa các biến thể không còn trong danh sách
      const newVariantIds = variants.map((v) => v._id?.toString()).filter(Boolean);
      const variantsToDelete = existingVariantIds.filter((id) => !newVariantIds.includes(id));
      if (variantsToDelete.length > 0) {
        await ProductVariant.deleteMany({ _id: { $in: variantsToDelete } });
        await VariantAttributeValue.deleteMany({ variant_id: { $in: variantsToDelete } });
      }

      return res.status(200).json({
        message: "Cập nhật sản phẩm và biến thể thành công",
        status: true,
        data: { product, variants: updatedVariants },
      });
    }

    return res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      status: true,
      data: product,
    });
  } catch (err) {
    console.error("Lỗi updateProduct:", err.stack || err);
    return res.status(500).json({ message: "Lỗi cập nhật sản phẩm", error: err.message || err.toString() });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    // Xóa các biến thể liên quan
    await ProductVariant.deleteMany({ product_id: req.params.id });
    await VariantAttributeValue.deleteMany({ variant_id: { $in: await ProductVariant.find({ product_id: req.params.id }).distinct("_id") } });

    return res.json({ message: "Đã xóa sản phẩm và biến thể thành công" });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi xóa sản phẩm", error: err });
  }
};