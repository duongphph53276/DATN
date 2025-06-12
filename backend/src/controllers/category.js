import { CategoryModel } from "../models/category.js";
import slugify from 'slugify';

export const ListCategory = async (req, res) => {
  try {
    const Category = await CategoryModel.find();
    return res.status(200).send({ message: 'Tải danh mục thành công', status: true, data: Category });
  } catch (error) {
    return res.status(500).send({ message: 'Tải thất bại', status: false, error: error.message });
  }
};

export const AddCategory = async (req, res) => {
  try {
    const { name, category_id, parent_id } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const Category = await new CategoryModel({ name, slug, category_id, parent_id }).save();
    return res.status(201).send({ message: 'Thêm danh sách thành công', status: true, data: Category });
  } catch (error) {
    return res.status(500).send({ message: 'Thêm thất bại', status: false, error: error.message });
  }
};

export const EditCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const Category = await CategoryModel.findById(id);
    if (!Category) {
      return res.status(404).send({ message: 'Không tìm thấy game', status: false });
    }

    // Cập nhật tên và slug
    Category.name = name;
    Category.slug = slugify(name, { lower: true, strict: true });
    await Category.save();
    return res.status(200).send({ message: 'Cập nhật danh mục thành công', status: true, data: Category });
  } catch (error) {
    return res.status(500).send({ message: 'Cập nhật thất bại', status: false, error: error.message });
  }
};

export const DeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const Category = await CategoryModel.findByIdAndDelete(id);
    if (!Category) {
      return res.status(404).send({ message: 'Không tìm thấy danh mục', status: false });
    }
    return res.status(200).send({ message: 'Xóa danh mục thành công', status: true, data: Category });
  } catch (error) {
    return res.status(500).send({ message: 'Xóa thất bại', status: false, error: error.message });
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
    return res.status(200).send({ message: 'Lấy id danh mục thành công', status: true, data: Category });
  } catch (error) {
    return res.status(500).send({ message: 'Lấy id danh mục thất bại', status: false, error: error.message });
  }
};
