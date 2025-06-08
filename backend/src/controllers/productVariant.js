
import ProductVariant from "../models/productVariant.js";
import VariantAttributeValue from "../models/attribute.js";


// Tạo biến thể sản phẩm
export const createVariant = async (req, res) => {
    try {
        const { product, price, quantity, image, attributes } = req.body;

        const variant = await ProductVariant.create({ product, price, quantity, image });

        // Gắn thuộc tính vào biến thể
        for (const attribute of attributes) {
            await VariantAttributeValue.create({
                variant: variant._id,
                attribute: attribute.attribute,
                value: attribute.value,
            });
        }

        res.status(201).json({
            message: "Thêm biến thể thành công",
            status: true,
            data: variant
        });
    } catch (error) {
        res.status(500).json({ error: "Tạo biến thể thất bại", details: error });
    }
};

// Lấy biến thể theo product_id
export const getVariantsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const variants = await ProductVariant.find({ product: productId });

        res.status(200).json({
            message: "Lấy biến thể thành công",
            status: true,
            data: variants
        });
    } catch (error) {
        res.status(500).json({ error: "Không thể lấy biến thể" });
    }
};
