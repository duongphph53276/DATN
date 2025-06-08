import Product from "../models/product.js";


export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      message: "Thêm sản phẩm thành công",
      status: true,
      data: product
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo sản phẩm", err });
  }
};
// Lấy danh sách tất cả sản phẩm
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
    res.status(201).send({ message: "Lấy danh sách sản phẩm thành công", status: true, data: products })
    // .populate("category");
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error });
  }
};
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("attributes");
    const variants = await ProductVariant.find({ product: req.params.id });
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ product, variants });
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy sản phẩm", error: err });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.status(201).json({
      message: "Cập nhật sản phẩm thành công",
      status: true,
      data: updated
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật sản phẩm", error: err });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ message: "Đã xóa sản phẩm thành công"});
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa sản phẩm", error: err });
  }
};