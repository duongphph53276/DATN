import Attribute from "../models/attribute.js";

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



