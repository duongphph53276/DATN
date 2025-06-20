import Product from "../models/product.js";
import ProductVariant from "../models/productVariant.js"
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({
      message: "Thêm sản phẩm thành công",
      status: true,
      data: product
    });
  } catch (err) {
    console.error("Lỗi khi thêm sản phẩm:", err); // thêm dòng này để debug
    return res.status(500).json({ message: "Lỗi tạo sản phẩm", err });
  }
};
// Lấy danh sách tất cả sản phẩm
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
    return res.status(201).send({ message: "Lấy danh sách sản phẩm thành công", status: true, data: products })
    // .populate("category");
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error });
  }
};
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category_id")
      .populate("attributes");
    const variants = await ProductVariant.find({ product: req.params.id });
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    return res.json({ data: { product, variants } });
  } catch (err) {
    console.error("Lỗi getProductById:", err); // 👈 rất quan trọng
    return res.status(500).json({ message: "Lỗi lấy sản phẩm", error: err });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    const updateProduct = await Product.findById(req.params.id);
    return res.status(201).json({
      message: "Cập nhật sản phẩm thành công",
      status: true,
      data: updateProduct
    });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi cập nhật sản phẩm", error: err });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    return res.json({ message: "Đã xóa sản phẩm thành công" });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi xóa sản phẩm", error: err });
  }
};