import Attribute from "../models/attribute.js";
import AttributeValue from "../models/attributeValue.js";

// Tạo Attribute
export const createAttribute = async (req, res) => {
    try {
        const { attribute_id, name, display_name, type } = req.body;
        const attribute = await Attribute.create({ attribute_id, name, display_name, type });
        return res.status(201).json({
            message: "Thêm attribute thành công",
            status: true,
            data: attribute
        });
    } catch (err) {
        return res.status(500).json({ error: "Tạo attribute thất bại", details: err });
    }
};


// Lấy tất cả attributes
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


// Tạo giá trị cho một Attribute cụ thể
export const createAttributeValue = async (req, res) => {
    try {
        const { attributeValue_id, attribute_id, value } = req.body;
        const attributeValue = await AttributeValue.create({ attributeValue_id, attribute_id, value });
        return res.status(201).json({
            message: "Thêm AttributeValue thành công",
            status: true,
            data: attributeValue
        });
    } catch (err) {
        return res.status(500).json({ error: "Tạo AttributeValue thất bại", details: err });
    }
};


// Lấy tất cả giá trị thuộc về một attribute
export const getAttributeValues = async (req, res) => {
    try {
        const { attributeId } = req.params;
        const values = await AttributeValue.find({ attribute: attributeId });
        return res.status(200).json({
            message: "Hiển thị danh sách giá trị thành công",
            status: true,
            data: values
        });
    } catch (err) {
        return res.status(500).json({ error: "Lỗi khi lấy danh sách value", details: err });
    }
};

