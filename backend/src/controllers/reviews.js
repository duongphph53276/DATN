import Review from '../models/reviews.js';
import Product from '../models/product.js';
import { OrderModel } from '../models/OrderModel.js';
import { OrderDetailModel } from '../models/OrderDetailModel.js';
import mongoose from 'mongoose';

export const createReview = async (req, res) => {
  try {
    const { product_id, rating } = req.body; 
    const user_id = req.user.id;

    console.log('Nhận yêu cầu đánh giá:', { user_id, product_id, rating });

    if (!product_id || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Dữ liệu đánh giá không hợp lệ',
        status: false,
      });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({
        message: 'Không tìm thấy sản phẩm',
        status: false,
      });
    }

    // 🔹 Kiểm tra người dùng đã mua sản phẩm chưa
    const orderIds = await OrderModel.find({ user_id })
      .distinct('_id'); // lấy ra tất cả order_id của user

    const purchased = await OrderDetailModel.findOne({
      order_id: { $in: orderIds },
      product_id: product_id
    });

    if (!purchased) {
      return res.status(403).json({
        message: 'Bạn phải mua sản phẩm để đánh giá',
        status: false,
      });
    }

    let review;
    const existingReview = await Review.findOne({ product_id, user_id });

    if (existingReview) {
      review = await Review.findByIdAndUpdate(
        existingReview._id,
        { rating },
        { new: true, runValidators: true }
      );
    } else {
      review = await Review.create({ product_id, user_id, rating });
    }

    // 🔹 Tính lại average_rating
    const reviews = await Review.find({ product_id });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = reviews.length > 0
      ? Number((totalRating / reviews.length).toFixed(1))
      : 0;
    const reviewCount = reviews.length;

    await Product.findByIdAndUpdate(
      product_id,
      { average_rating: averageRating, review_count: reviewCount }
    );

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

// export const createReview = async (req, res) => {
//   try {
//     const { product_id, rating } = req.body;
//     const user_id = req.user.id; // lấy từ token

//     // 1. Kiểm tra đơn hàng của user đã giao chưa
//     const order = await OrderModel.findOne({
//       user_id,
//       status: 'delivered', // chỉ cho đánh giá khi đã giao
//     });

//     if (!order) {
//       return res.status(400).json({
//         message: 'Bạn chỉ có thể đánh giá khi đơn hàng đã được giao',
//         status: false,
//       });
//     }

//     // 2. Kiểm tra sản phẩm này có trong đơn hàng đó không
//     const orderDetail = await OrderDetailModel.findOne({
//       order_id: order._id,
//       product_id,
//     });

//     if (!orderDetail) {
//       return res.status(400).json({
//         message: 'Bạn chưa mua sản phẩm này nên không thể đánh giá',
//         status: false,
//       });
//     }

//     // 3. Check đã từng đánh giá chưa
//     let existingReview = await Review.findOne({ product_id, user_id });
//     let review;
//     let message = '';

//     if (existingReview) {
//       review = await Review.findByIdAndUpdate(
//         existingReview._id,
//         { rating },
//         { new: true, runValidators: true }
//       );
//       message = 'Cập nhật đánh giá thành công';
//     } else {
//       review = await Review.create({ product_id, user_id, rating });
//       message = 'Thêm đánh giá thành công';
//     }

//     // 4. Cập nhật average rating
//     const reviews = await Review.find({ product_id });
//     const reviewCount = reviews.length;
//     const averageRating = reviewCount
//       ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
//       : 0;

//     await Product.findByIdAndUpdate(product_id, {
//       average_rating: averageRating,
//       review_count: reviewCount,
//     });

//     // 5. Trả về kết quả
//     return res.status(201).json({
//       message,
//       status: true,
//       data: review,
//       average_rating: averageRating,
//       review_count: reviewCount,
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: 'Lỗi server',
//       status: false,
//     });
//   }
// };

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