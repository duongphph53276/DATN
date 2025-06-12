import ProductVariant from "../models/productVariant.js";

// Tạo biến thể sản phẩm
export const createVariant = async (req, res) => {
    try {
        const variant = await ProductVariant.create(req.body);
        return res.status(201).json({
            message: "Thêm biến thể thành công",
            status: true,
            data: variant
        });
    } catch (error) {
        return res.status(500).json({ error: "Tạo biến thể thất bại", details: error });
    }
};

// Lấy biến thể theo product_id
export const getVariantsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const variants = await ProductVariant.find({ product: productId });

        return res.status(200).json({
            message: "Lấy biến thể thành công",
            status: true,
            data: variants
        });
    } catch (error) {
        return res.status(500).json({ error: "Không thể lấy biến thể" });
    }
};
