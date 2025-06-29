import Attribute from "../models/attribute.js";
import AttributeValue from "../models/attributeValue.js";
import mongoose from "mongoose";
// Tạo Attribute
export const createAttribute = async (req, res) => {
    try {
        const attribute = await Attribute.create(req.body);
        return res.status(201).json({
            message: "Thêm attribute thành công",
            status: true,
            data: attribute
        });
    } catch (err) {
        return res.status(500).json({
            error: "Tạo attribute thất bại",
            details: err?.errors || err
        });
    }
};
// Lấy tất cả attribute
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
export const getAttributeById = async (req, res) => {
    try {
        const attribute = await Attribute.findById(req.params.id);
        if (!attribute) {
            return res.status(404).json({ message: "Không tìm thấy thuộc tính" });
        }
        return res.status(200).json({
            message: "Lấy thuộc tính thành công",
            status: true,
            data: attribute
        });
    } catch (err) {
        return res.status(500).json({ message: "Lỗi khi lấy thuộc tính", error: err });
    }
};
export const updateAttribute = async (req, res) => {
    try {
        const attribute = await Attribute.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.json(attribute);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi cập nhật thuộc tính", error });
    }
};

export const deleteAttribute = async (req, res) => {
    try {
        const deleted = await Attribute.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Không tìm thấy thuộc tính" });
        return res.json({ message: "Đã xoá thuộc tính" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi xoá thuộc tính", error });
    }
};

// Tạo giá trị cho một Attribute cụ thể
export const createAttributeValue = async (req, res) => {
    try {
        const { attribute_id, value } = req.body;
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
        const value = await AttributeValue.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.json(value);
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

