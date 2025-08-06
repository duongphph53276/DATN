import Review from '../models/reviews.js';
import Product from '../models/product.js';
import { OrderModel } from '../models/OrderModel.js';

// Tạo hoặc cập nhật đánh giá
export const createReview = async (req, res) => {
  try {
    const { product_id, rating } = req.body; // rating là số từ 1-5
    const user_id = req.user.id;

    // Kiểm tra dữ liệu đầu vào
    if (!product_id || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Dữ liệu đánh giá không hợp lệ',
        status: false,
        error: 'product_id và rating (1-5) là bắt buộc',
      });
    }

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({
        message: 'Không tìm thấy sản phẩm',
        status: false,
      });
    }

    // // Kiểm tra xem người dùng đã mua sản phẩm chưa
    // const order = await OrderModel.findOne({ user_id, 'items.product_id': product_id });
    // if (!order) {
    //   return res.status(403).json({
    //     message: 'Bạn phải mua sản phẩm để đánh giá',
    //     status: false,
    //   });
    // }

    let review;
    const existingReview = await Review.findOne({ product_id, user_id });

    if (existingReview) {
      // Cập nhật đánh giá hiện có
      review = await Review.findByIdAndUpdate(
        existingReview._id,
        { rating },
        { new: true, runValidators: true }
      );
    } else {
     // Tạo đánh giá mới
      review = await Review.create({ product_id, user_id, rating });
      return res.status(201).json({
        message: 'Thêm đánh giá thành công',
        status: true,
        data: review,
      });
    }

    // Tính lại average_rating dựa trên tất cả đánh giá
    const reviews = await Review.find({ product_id });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? Number((totalRating / reviews.length).toFixed(1)) : 0;
    const reviewCount = reviews.length;

    // Cập nhật average_rating và review_count vào sản phẩm
    await Product.findByIdAndUpdate(product_id, { average_rating: averageRating, review_count: reviewCount }, { new: true });

    // Trả về phản hồi với dữ liệu cập nhật
    return res.status(existingReview ? 200 : 201).json({
      message: existingReview ? 'Cập nhật đánh giá thành công' : 'Thêm đánh giá thành công',
      status: true,
      data: review,
      average_rating: averageRating,
      review_count: reviewCount,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Tạo/Cập nhật đánh giá thất bại',
      status: false,
      error: err?.message || 'Lỗi server',
    });
  }
};

// Lấy tất cả đánh giá
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('product_id', 'name')
      .populate('user_id', 'name');
    return res.status(200).json({
      message: 'Hiển thị tất cả đánh giá thành công',
      status: true,
      data: reviews,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Lỗi khi lấy tất cả đánh giá',
      status: false,
      error: err?.message || 'Lỗi server',
    });
  }
};

// Lấy đánh giá của người dùng cho một sản phẩm cụ thể
export const getUserReviewByProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const user_id = req.user.id;

    const review = await Review.findOne({ product_id, user_id })
      .populate('product_id', 'name')
      .populate('user_id', 'name');

    if (!review) {
      return res.status(404).json({
        message: 'Không tìm thấy đánh giá',
        status: false,
      });
    }

    return res.status(200).json({
      message: 'Lấy đánh giá thành công',
      status: true,
      data: review,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Lỗi khi lấy đánh giá',
      status: false,
      error: err?.message || 'Lỗi server',
    });
  }
};
// Lấy đánh giá theo ID
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('product_id', 'name')
      .populate('user_id', 'name');
    if (!review) {
      return res.status(404).json({
        message: 'Không tìm thấy đánh giá',
        status: false,
      });
    }
    return res.status(200).json({
      message: 'Lấy đánh giá thành công',
      status: true,
      data: review,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Lỗi khi lấy đánh giá',
      status: false,
      error: err?.message || 'Lỗi server',
    });
  }
};

// Cập nhật đánh giá
export const updateReview = async (req, res) => {
  try {
    const { product_id, rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Dữ liệu đánh giá không hợp lệ',
        status: false,
        error: 'rating (1-5) là bắt buộc',
      });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { product_id, rating },
      { new: true, runValidators: true }
    );
    if (!review) {
      return res.status(404).json({
        message: 'Không tìm thấy đánh giá để cập nhật',
        status: false,
      });
    }

    // Cập nhật average_rating
    const reviews = await Review.find({ product_id });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? Number((totalRating / reviews.length).toFixed(1)) : 0;
    await Product.findByIdAndUpdate(product_id, { average_rating: averageRating });

    return res.status(200).json({
      message: 'Cập nhật đánh giá thành công',
      status: true,
      data: review,
      average_rating: averageRating,
      review_count: reviews.length,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Lỗi cập nhật đánh giá',
      status: false,
      error: err?.message || 'Lỗi server',
    });
  }
};

// Xóa đánh giá
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        message: 'Không tìm thấy đánh giá để xóa',
        status: false,
      });
    }

    const product_id = review.product_id;
    await review.deleteOne();

    // Cập nhật average_rating
    const reviews = await Review.find({ product_id });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0 ? Number((totalRating / reviews.length).toFixed(1)) : 0;
    await Product.findByIdAndUpdate(product_id, { average_rating: averageRating });

    return res.status(200).json({
      message: 'Đã xóa đánh giá thành công',
      status: true,
      average_rating: averageRating,
      review_count: reviews.length,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Lỗi xóa đánh giá',
      status: false,
      error: err?.message || 'Lỗi server',
    });
  }
};

// Middleware kiểm tra mua sản phẩm
export const checkPurchase = async (req, res, next) => {
  const { product_id } = req.body || req.query; // Lấy từ body hoặc query
  const user_id = req.user.id;

  try {
    const order = await OrderModel.findOne({ user_id, 'items.product_id': product_id });
    if (!order) {
      return res.status(403).json({
        message: 'Bạn phải mua sản phẩm để đánh giá',
        status: false,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Lỗi kiểm tra đơn hàng',
      status: false,
      error: error.message,
    });
  }
};