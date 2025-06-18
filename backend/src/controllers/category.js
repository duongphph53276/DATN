import { CategoryModel } from "../models/category.js";
import slugify from 'slugify';
import mongoose from 'mongoose';

export const ListCategory = async (req, res) => {
  try {
    const Category = await CategoryModel.find().populate('parent_id', 'name');
    res.status(200).send({ message: 'Tải danh mục thành công', status: true, data: Category });
  } catch (error) {
    res.status(500).send({ message: 'Tải thất bại', status: false, error: error.message });
  }
};

export const AddCategory = async (req, res) => {
  try {
    const { name, parent_id } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const Category = await new CategoryModel({ name, slug, parent_id }).save();
    res.status(201).send({ message: 'Thêm danh sách thành công', status: true, data: Category });
  } catch (error) {
    res.status(500).send({ message: 'Thêm thất bại', status: false, error: error.message });
  }
};

export const EditCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parent_id } = req.body;
    if (!name?.trim()) return res.status(400).send({ message: 'Tên không được để trống', status: false });
    const Category = await CategoryModel.findById(id);
    if (!Category) {
      return res.status(404).send({ message: 'Không tìm thấy game', status: false });
    }

    let validParentId = Category.parent_id;
    if (parent_id !== undefined) {
      if (parent_id === null) validParentId = null;
      else if (!mongoose.Types.ObjectId.isValid(parent_id) || !(await CategoryModel.findById(parent_id)))
        return res.status(400).send({ message: 'Danh mục cha không hợp lệ', status: false });
      else if (parent_id === id) return res.status(400).send({ message: 'Không thể là cha của chính mình', status: false });
      else validParentId = parent_id;
    }

    // Cập nhật tên và slug
    Category.name = name;
    Category.slug = slugify(name, { lower: true, strict: true });
    Category.parent_id = validParentId;
    await Category.save();
    res.status(200).send({ message: 'Cập nhật danh mục thành công', status: true, data: Category });
  } catch (error) {
    res.status(500).send({ message: 'Cập nhật thất bại', status: false, error: error.message });
  }
};

export const DeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const Category = await CategoryModel.findByIdAndDelete(id);
    if (!Category) {
      return res.status(404).send({ message: 'Không tìm thấy danh mục', status: false });
    }
    res.status(200).send({ message: 'Xóa danh mục thành công', status: true, data: Category });
  } catch (error) {
    res.status(500).send({ message: 'Xóa thất bại', status: false, error: error.message });
  }
};

// Lấy danh mục theo ID
export const GetCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const Category = await CategoryModel.findById(id);
    if (!Category) {
      return res.status(404).send({ message: 'Không tìm thấy danh mục', status: false });
    }
    res.status(200).send({ message: 'Lấy id danh mục thành công', status: true, data: Category });
  } catch (error) {
    res.status(500).send({ message: 'Lấy id danh mục thất bại', status: false, error: error.message });
  }
};
