import { CategoryModel } from "../models/category.js";
import slugify from 'slugify';
import mongoose from 'mongoose';

export const ListCategory = async (req, res) => {
  try {
    const Category = await CategoryModel.find().populate('parent_id', 'name').sort({ order: 1, createdAt: 1 });
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

// Update display limit
export const updateDisplayLimit = async (req, res) => {
  try {
    const { display_limit } = req.body;
    
    if (!display_limit || display_limit < 1 || display_limit > 20) {
      return res.status(400).send({ 
        message: 'Số lượng hiển thị phải từ 1 đến 20', 
        status: false 
      });
    }

    // Cập nhật display_limit cho tất cả danh mục gốc
    await CategoryModel.updateMany(
      { parent_id: null },
      { display_limit: display_limit }
    );

    res.status(200).send({ 
      message: 'Cập nhật số lượng hiển thị thành công', 
      status: true,
      data: { display_limit }
    });
  } catch (error) {
    res.status(500).send({ 
      message: 'Cập nhật số lượng hiển thị thất bại', 
      status: false, 
      error: error.message 
    });
  }
};

// Reorder categories
export const reorderCategories = async (req, res) => {
  try {
    const { draggedId, targetId } = req.body;
    
    if (!draggedId || !targetId) {
      return res.status(400).send({ 
        message: 'Thiếu thông tin cần thiết', 
        status: false 
      });
    }

    // Lấy tất cả danh mục gốc (không có parent_id)
    const rootCategories = await CategoryModel.find({ parent_id: null }).sort({ order: 1 });
    
    // Tìm vị trí của dragged và target
    const draggedIndex = rootCategories.findIndex(cat => cat._id.toString() === draggedId);
    const targetIndex = rootCategories.findIndex(cat => cat._id.toString() === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) {
      return res.status(404).send({ 
        message: 'Không tìm thấy danh mục', 
        status: false 
      });
    }

    // Cập nhật thứ tự
    const draggedCategory = rootCategories[draggedIndex];
    rootCategories.splice(draggedIndex, 1);
    rootCategories.splice(targetIndex, 0, draggedCategory);

    // Cập nhật order field cho tất cả danh mục
    for (let i = 0; i < rootCategories.length; i++) {
      await CategoryModel.findByIdAndUpdate(
        rootCategories[i]._id,
        { order: i + 1 }
      );
    }

    res.status(200).send({ 
      message: 'Cập nhật thứ tự danh mục thành công', 
      status: true 
    });
  } catch (error) {
    res.status(500).send({ 
      message: 'Cập nhật thứ tự thất bại', 
      status: false, 
      error: error.message 
    });
  }
};

// Lấy phân bố danh mục
export const getCategoryDistribution = async (req, res) => {
  try {
    const Product = (await import('../models/product.js')).default;
    
    const categoryStats = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$category._id',
          name: { $first: '$category.name' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const totalProducts = await Product.countDocuments();
    
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
    const result = categoryStats.map((cat, index) => ({
      name: cat.name || 'Chưa phân loại',
      value: totalProducts > 0 ? Math.round((cat.count / totalProducts) * 100) : 0,
      color: colors[index % colors.length]
    }));

    res.status(200).json({
      success: true,
      message: 'Category distribution retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('Error getting category distribution:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};