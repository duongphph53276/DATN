import Attribute from "../models/attribute";
import AttributeValue from "../models/attributeValue";

// Tạo Attribute
export const createAttribute = async (req, res) => {
    try {
        const { name, display_name, type } = req.body;
        const attribute = await Attribute.create({ name, display_name, type });
        res.status(201).json(attribute).json({
            message: "Thêm attribute thành công",
            status: true,
            data: attribute
        });
    } catch (err) {
        res.status(500).json({ error: "Tạo attribute thất bại", details: err });
    }
};

// Lấy tất cả attributes
export const getAllAttributes = async (_req, res) => {
    try {
        const attributes = await Attribute.find();
        res.status(200).json(attributes).json({
            message: "Hiện thị attribute thành công",
            status: true,
            data: attributes
        });
    } catch (err) {
        res.status(500).json({ error: "Lỗi khi lấy attribute" });
    }
};

// Tạo giá trị cho một Attribute cụ thể
export const createAttributeValue = async (req, res) => {
    try {
        const { attributeId } = req.params;
        const { value } = req.body;

        const attrValue = await AttributeValue.create({
            attribute: attributeId,
            value,
        });

        res.status(201).json(attrValue);
    } catch (err) {
        res.status(500).json({ error: "Tạo attribute value thất bại", details: err });
    }
};

// Lấy tất cả giá trị thuộc về một attribute
export const getAttributeValues = async (req, res) => {
    try {
        const { attributeId } = req.params;

        const values = await AttributeValue.find({ attribute: attributeId });
        res.status(200).json(values);
    } catch (err) {
        res.status(500).json({ error: "Lỗi khi lấy danh sách value", details: err });
    }
};
