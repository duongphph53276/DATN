import mongoose from "mongoose";
import AttributeValue from "../models/attributeValue.js";
// Tạo giá trị cho một Attribute cụ thể
export const createAttributeValue = async (req, res) => {
    try {
        const { attribute_id, value } = req.body;

        // Kiểm tra trùng giá trị (không phân biệt hoa thường)
        const existing = await AttributeValue.findOne({
            attribute_id,
            value: { $regex: new RegExp("^" + value + "$", "i") }
        });

        if (existing) {
            return res.status(400).json({
                status: false,
                message: "Giá trị này đã tồn tại cho thuộc tính"
            });
        }

        const attributeValue = await AttributeValue.create({ attribute_id, value });
        return res.status(201).json({
            message: "Thêm AttributeValue thành công",
            status: true,
            data: attributeValue
        });
    } catch (err) {
        return res.status(500).json({ error: "Tạo AttributeValue thất bại", details: err });
    }
};

// Lấy một AttributeValue theo ID
export const getAttributeValueById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }

        const value = await AttributeValue.findById(id);
        if (!value) {
            return res.status(404).json({ message: "Giá trị không tồn tại" });
        }

        return res.status(200).json({
            message: "Lấy giá trị thành công",
            status: true,
            data: value,
        });
    } catch (error) {
        console.error("Lỗi khi lấy AttributeValue:", error);
        return res.status(500).json({ message: "Lỗi server", error });
    }
};

// Lấy tất cả giá trị thuộc về một attribute
export const getAttributeValues = async (req, res) => {
    try {
        const { attributeId } = req.params;
        const values = await AttributeValue.find({ attribute_id: attributeId });
        return res.status(200).json({
            message: "Hiển thị danh sách giá trị thành công",
            status: true,
            data: values
        });
    } catch (err) {
        return res.status(500).json({ error: "Lỗi khi lấy danh sách value", details: err });
    }
};
export const updateAttributeValue = async (req, res) => {
    try {
        const { value } = req.body;

        const current = await AttributeValue.findById(req.params.id);
        if (!current) {
            return res.status(404).json({ message: "Giá trị không tồn tại" });
        }

        // Kiểm tra trùng (ngoại trừ chính nó)
        const duplicate = await AttributeValue.findOne({
            attribute_id: current.attribute_id,
            value: { $regex: new RegExp("^" + value + "$", "i") },
            _id: { $ne: req.params.id }
        });

        if (duplicate) {
            return res.status(400).json({
                status: false,
                message: "Giá trị này đã tồn tại cho thuộc tính"
            });
        }

        const updated = await AttributeValue.findByIdAndUpdate(
            req.params.id,
            { value },
            { new: true }
        );

        return res.json({
            status: true,
            message: "Cập nhật thành công",
            data: updated
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi cập nhật giá trị", error });
    }
};


export const deleteAttributeValue = async (req, res) => {
    try {
        await AttributeValue.findByIdAndDelete(req.params.id);
        return res.json({ message: "Đã xoá giá trị thuộc tính" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi xoá giá trị", error });
    }
};

