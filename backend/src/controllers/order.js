import { OrderModel } from '../models/OrderModel.js';
import { OrderDetailModel } from '../models/OrderDetailModel.js';
import mongoose from 'mongoose';

class OrderController {
  /**
   * @desc    Get all orders with pagination and filtering
   * @route   GET /api/orders
   * @access  Private
   */
  async getAllOrders(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        user_id,
        payment_method,
        sort_by = 'created_at',
        sort_order = 'desc'
      } = req.query;

      const filter = {};
      if (status) filter.status = status;
      if (user_id) filter.user_id = user_id;
      if (payment_method) filter.payment_method = payment_method;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const sortOrder = sort_order === 'asc' ? 1 : -1;

      const orders = await OrderModel
        .find(filter)
        .sort({ [sort_by]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const totalOrders = await OrderModel.countDocuments(filter);
      const totalPages = Math.ceil(totalOrders / parseInt(limit));

      const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
          const orderDetails = await OrderDetailModel
            .find({ order_id: order._id })
            .lean();
          return {
            ...order,
            order_details: orderDetails
          };
        })
      );

      res.status(200).json({
        success: true,
        message: 'Get order complete',
        data: {
          orders: ordersWithDetails,
          pagination: {
            current_page: parseInt(page),
            total_pages: totalPages,
            total_orders: totalOrders,
            per_page: parseInt(limit),
            has_next: parseInt(page) < totalPages,
            has_prev: parseInt(page) > 1
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * @desc    Get single order by ID
   * @route   GET /api/orders/:id
   * @access  Private
   */
  async getOrderById(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid order ID format'
        });
      }

      const order = await OrderModel.findById(id).lean();
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      const orderDetails = await OrderDetailModel
        .find({ order_id: id })
        .lean();

      res.status(200).json({
        success: true,
        message: 'Order retrieved successfully',
        data: {
          ...order,
          order_details: orderDetails
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * @desc    Create new order
   * @route   POST /api/orders
   * @access  Private
   */
  async createOrder(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const {
        user_id,
        quantity,
        total_amount,
        discount_code,
        payment_method,
        address_id,
        order_details
      } = req.body;

      if (!user_id || !quantity || !total_amount || !payment_method || !address_id || !order_details) {
        return res.status(400).json({
          success: false,
          message: 'Missing required data'
        });
      }

      if (!Array.isArray(order_details) || order_details.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Order details must be a non-empty array'
        });
      }

      const newOrder = new OrderModel({
        user_id,
        quantity,
        total_amount,
        discount_code,
        payment_method,
        address_id
      });

      const savedOrder = await newOrder.save({ session });

      const orderDetailsData = order_details.map(detail => ({
        order_id: savedOrder._id,
        variant_id: detail.variant_id,
        name: detail.name,
        price: detail.price,
        image: detail.image
      }));

      const savedOrderDetails = await OrderDetailModel.insertMany(orderDetailsData, { session });

      await session.commitTransaction();

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: {
          ...savedOrder.toObject(),
          order_details: savedOrderDetails
        }
      });
    } catch (error) {
      await session.abortTransaction();

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: Object.values(error.errors).map(err => err.message)
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    } finally {
      session.endSession();
    }
  }

  /**
   * @desc    Update order status
   * @route   PATCH /api/orders/:id/status
   * @access  Private
   */
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid order ID format'
        });
      }

      const validStatuses = ['pending', 'preparing', 'shipping', 'delivered', 'canceled'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ')
        });
      }

      const updateData = { status };
      if (status === 'delivered') {
        updateData.delivered_at = new Date();
      }

      const updatedOrder = await OrderModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).lean();

      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: updatedOrder
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * @desc    Delete order
   * @route   DELETE /api/orders/:id
   * @access  Private
   */
  async deleteOrder(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid order ID format'
        });
      }

      const order = await OrderModel.findById(id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      await OrderDetailModel.deleteMany({ order_id: id }, { session });

      await OrderModel.findByIdAndDelete(id, { session });

      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: 'Order deleted successfully'
      });
    } catch (error) {
      await session.abortTransaction();

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    } finally {
      session.endSession();
    }
  }

  /**
   * @desc    Get orders by user ID
   * @route   GET /api/orders/user/:user_id
   * @access  Private
   */
  async getOrdersByUserId(req, res) {
    try {
      const { user_id } = req.params;
      const { page = 1, limit = 10, status } = req.query;

      const filter = { user_id };
      if (status) filter.status = status;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const orders = await OrderModel
        .find(filter)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const totalOrders = await OrderModel.countDocuments(filter);
      const totalPages = Math.ceil(totalOrders / parseInt(limit));

      const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
          const orderDetails = await OrderDetailModel
            .find({ order_id: order._id })
            .lean();
          return {
            ...order,
            order_details: orderDetails
          };
        })
      );

      res.status(200).json({
        success: true,
        message: 'Get User orders successfully',
        data: {
          orders: ordersWithDetails,
          pagination: {
            current_page: parseInt(page),
            total_pages: totalPages,
            total_orders: totalOrders,
            per_page: parseInt(limit),
            has_next: parseInt(page) < totalPages,
            has_prev: parseInt(page) > 1
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * @desc    Get order statistics
   * @route   GET /api/orders/statistics
   * @access  Private
   */
  //lọc đơn hàng
  async getOrderStatistics(req, res) {
    try {
      const { start_date, end_date } = req.query;

      const dateFilter = {};
      if (start_date) dateFilter.$gte = new Date(start_date);
      if (end_date) dateFilter.$lte = new Date(end_date);

      const matchStage = Object.keys(dateFilter).length > 0
        ? { created_at: dateFilter }
        : {};

      const stats = await OrderModel.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            total_orders: { $sum: 1 },
            total_revenue: { $sum: '$total_amount' },
            average_order_value: { $avg: '$total_amount' },
            total_quantity: { $sum: '$quantity' }
          }
        }
      ]);

      const statusBreakdown = await OrderModel.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            total_amount: { $sum: '$total_amount' }
          }
        }
      ]);

      const paymentMethodBreakdown = await OrderModel.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$payment_method',
            count: { $sum: 1 },
            total_amount: { $sum: '$total_amount' }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        message: 'Order statistics retrieved successfully',
        data: {
          overall_stats: stats[0] || {
            total_orders: 0,
            total_revenue: 0,
            average_order_value: 0,
            total_quantity: 0
          },
          status_breakdown: statusBreakdown,
          payment_method_breakdown: paymentMethodBreakdown
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }

  /**
   * @desc    Seed fake data for testing
   * @route   POST /api/orders/seed
   * @access  Private (Development only)
   */
  async seedFakeData(req, res) {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Seeding is not allowed in production'
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await OrderModel.deleteMany({}, { session });
      await OrderDetailModel.deleteMany({}, { session });

      const sampleUsers = [
        'user_001', 'user_002', 'user_003', 'user_004', 'user_005',
        'user_006', 'user_007', 'user_008', 'user_009', 'user_010'
      ];

      const sampleProducts = [
        {
          variant_id: 'var_001',
          name: 'iPhone 15 Pro Max 256GB',
          price: 29990000,
          image: 'https://example.com/images/iphone15promax.jpg'
        },
        {
          variant_id: 'var_002',
          name: 'Samsung Galaxy S24 Ultra 512GB',
          price: 31990000,
          image: 'https://example.com/images/galaxy-s24-ultra.jpg'
        },
        {
          variant_id: 'var_003',
          name: 'MacBook Pro 14" M3 Pro',
          price: 54990000,
          image: 'https://example.com/images/macbook-pro-14.jpg'
        },
        {
          variant_id: 'var_004',
          name: 'iPad Pro 12.9" M2 256GB',
          price: 26990000,
          image: 'https://example.com/images/ipad-pro-12.jpg'
        },
        {
          variant_id: 'var_005',
          name: 'AirPods Pro 2nd Gen',
          price: 6190000,
          image: 'https://example.com/images/airpods-pro-2.jpg'
        },
        {
          variant_id: 'var_006',
          name: 'Apple Watch Series 9 45mm',
          price: 10990000,
          image: 'https://example.com/images/apple-watch-s9.jpg'
        },
        {
          variant_id: 'var_007',
          name: 'Dell XPS 13 Plus',
          price: 35990000,
          image: 'https://example.com/images/dell-xps-13.jpg'
        },
        {
          variant_id: 'var_008',
          name: 'Sony WH-1000XM5',
          price: 8990000,
          image: 'https://example.com/images/sony-wh1000xm5.jpg'
        }
      ];

      const statuses = ['pending', 'preparing', 'shipping', 'delivered', 'canceled'];
      const paymentMethods = ['credit_card', 'debit_card', 'bank_transfer', 'e_wallet', 'cod'];
      const discountCodes = ['SAVE10', 'WELCOME20', 'STUDENT15', null, null, null];

      const orders = [];
      const orderDetails = [];

      for (let i = 0; i < 50; i++) {
        const randomUser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const randomPaymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        const randomDiscountCode = discountCodes[Math.floor(Math.random() * discountCodes.length)];

        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90));

        const numProducts = Math.floor(Math.random() * 4) + 1;
        let totalAmount = 0;
        let totalQuantity = 0;

        const orderId = new mongoose.Types.ObjectId();

        for (let j = 0; j < numProducts; j++) {
          const randomProduct = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
          const quantity = Math.floor(Math.random() * 3) + 1;

          orderDetails.push({
            order_id: orderId,
            variant_id: randomProduct.variant_id,
            name: randomProduct.name,
            price: randomProduct.price,
            image: randomProduct.image
          });

          totalAmount += randomProduct.price * quantity;
          totalQuantity += quantity;
        }

        if (randomDiscountCode) {
          const discountPercent = parseInt(randomDiscountCode.match(/\d+/)[0]);
          totalAmount = totalAmount * (1 - discountPercent / 100);
        }

        orders.push({
          _id: orderId,
          user_id: randomUser,
          status: randomStatus,
          quantity: totalQuantity,
          total_amount: Math.round(totalAmount),
          discount_code: randomDiscountCode,
          payment_method: randomPaymentMethod,
          address_id: `addr_${String(Math.floor(Math.random() * 100) + 1).padStart(3, '0')}`,
          delivered_at: randomStatus === 'delivered' ? new Date(randomDate.getTime() + 86400000 * Math.floor(Math.random() * 7)) : null,
          created_at: randomDate,
          updated_at: randomDate
        });
      }

      await OrderModel.insertMany(orders, { session });
      await OrderDetailModel.insertMany(orderDetails, { session });

      await session.commitTransaction();

      res.status(201).json({
        success: true,
        message: 'Fake data seeded successfully',
        data: {
          orders_created: orders.length,
          order_details_created: orderDetails.length
        }
      });
    } catch (error) {
      await session.abortTransaction();

      res.status(500).json({
        success: false,
        message: 'Failed to seed fake data',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    } finally {
      session.endSession();
    }
  }
}

export default new OrderController();