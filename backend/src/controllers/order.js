import { OrderModel } from '../models/OrderModel.js';
import { OrderDetailModel } from '../models/OrderDetailModel.js';
import { VoucherModel } from '../models/Voucher.js';
import { AddressModel } from '../models/User/address.js';
import { UserModel } from '../models/User/user.js';
import ProductVariant from '../models/productVariant.js';
import Product from "../models/product.js";
import {
  createOrderSuccessNotification,
  createOrderStatusNotification,
  createNewOrderAdminNotification,
  cancelledAdminNotification,
  createShipperAssignmentNotification
} from '../services/notificationService.js';

import mongoose from 'mongoose';

class OrderController {

  /**
   * Helper function to populate user information
   */
  static async populateUserInfo(userId) {
    try {
      const user = await UserModel.findById(userId)
        .select('name email phone avatar created_at')
        .lean();
      return user;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  }

  /**
   * Helper function to add user info to orders
   */
  static async addUserInfoToOrders(orders) {
    return Promise.all(
      orders.map(async (order) => {
        const user = await OrderController.populateUserInfo(order.user_id);
        return {
          ...order,
          user: user
        };
      })
    );
  }

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

          const orderDetailsWithInfo = await Promise.all(
            orderDetails.map(async (detail) => {
              const [product, variant] = await Promise.all([
                Product.findById(detail.product_id).lean(),
                ProductVariant.findById(detail.variant_id).lean()
              ]);

              return {
                ...detail,
                product: product,
                variant: variant
              };
            })
          );

          const [voucher, address, user] = await Promise.all([
            order.voucher_id ? VoucherModel.findById(order.voucher_id).lean() : null,
            AddressModel.findById(order.address_id).lean(),
            OrderController.populateUserInfo(order.user_id)
          ]);

          return {
            ...order,
            user: user,
            voucher: voucher,
            address: address,
            order_details: orderDetailsWithInfo
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

      const orderDetailsWithInfo = await Promise.all(
        orderDetails.map(async (detail) => {
          const [product, variant] = await Promise.all([
            Product.findById(detail.product_id).lean(),
            ProductVariant.findById(detail.variant_id).lean()
          ]);

          return {
            ...detail,
            product: product,
            variant: variant
          };
        })
      );

      const [voucher, address, user] = await Promise.all([
        order.voucher_id ? VoucherModel.findById(order.voucher_id).lean() : null,
        AddressModel.findById(order.address_id).lean(),
        OrderController.populateUserInfo(order.user_id)
      ]);

      const orderWithDetails = {
        ...order,
        user: user,
        voucher: voucher,
        address: address,
        order_details: orderDetailsWithInfo
      };

      res.status(200).json({
        success: true,
        message: 'Order retrieved successfully',
        data: orderWithDetails
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
      console.log('Create order request body:', JSON.stringify(req.body, null, 2));
      
      const {
        user_id,
        quantity,
        total_amount,
        voucher_id,
        payment_method,
        address_id,
        order_details
      } = req.body;

      if (!user_id || !quantity || !total_amount || !payment_method || !address_id || !order_details) {
        console.log('Missing required fields:', {
          user_id: !!user_id,
          quantity: !!quantity,
          total_amount: !!total_amount,
          payment_method: !!payment_method,
          address_id: !!address_id,
          order_details: !!order_details
        });
        return res.status(400).json({
          success: false,
          message: 'Missing required data'
        });
      }

      const userExists = await UserModel.findById(user_id).lean();
      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (!Array.isArray(order_details) || order_details.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Order details must be a non-empty array'
        });
      }

      for (const detail of order_details) {
        if (!detail.product_id || !detail.variant_id || !detail.name || !detail.price || !detail.quantity) {
          console.log('Invalid order detail:', detail);
          console.log('Missing fields:', {
            product_id: !!detail.product_id,
            variant_id: !!detail.variant_id,
            name: !!detail.name,
            price: !!detail.price,
            quantity: !!detail.quantity
          });
          return res.status(400).json({
            success: false,
            message: 'Each order detail must include product_id, variant_id, name, price, and quantity'
          });
        }
      }

      const newOrder = new OrderModel({
        user_id,
        quantity,
        total_amount,
        voucher_id,
        payment_method,
        address_id
      });

      const savedOrder = await newOrder.save({ session });

      const orderDetailsData = order_details.map(detail => ({
        order_id: savedOrder._id,
        product_id: detail.product_id,
        variant_id: detail.variant_id,
        name: detail.name,
        price: detail.price,
        quantity: detail.quantity,
        image: detail.image
      }));

      const savedOrderDetails = await OrderDetailModel.insertMany(orderDetailsData, { session });

      const orderDetailsWithInfo = await Promise.all(
        savedOrderDetails.map(async (detail) => {
          const [product, variant] = await Promise.all([
            Product.findById(detail.product_id).lean(),
            ProductVariant.findById(detail.variant_id).lean()
          ]);

          return {
            ...detail.toObject(),
            product: product,
            variant: variant
          };
        })
      );

      const [voucher, address, user] = await Promise.all([
        savedOrder.voucher_id ? VoucherModel.findById(savedOrder.voucher_id).lean() : null,
        AddressModel.findById(savedOrder.address_id).lean(),
        OrderController.populateUserInfo(savedOrder.user_id)
      ]);

      await session.commitTransaction();

      try {
        await createOrderSuccessNotification(user_id, savedOrder._id.toString());
        await createNewOrderAdminNotification(savedOrder._id.toString(), total_amount);
      } catch (notificationError) {
        console.error('Error creating notifications:', notificationError);
      }

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: {
          ...savedOrder.toObject(),
          user: user,
          voucher: voucher,
          address: address,
          order_details: orderDetailsWithInfo
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
      const { status, shipper_id, cancel_reason } = req.body;



      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid order ID format'
        });
      }

      // Lấy thông tin đơn hàng hiện tại
      const currentOrder = await OrderModel.findById(id).lean();
      if (!currentOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }



      // Chỉ cho phép admin thay đổi 3 trạng thái: preparing, shipping, cancelled
      const allowedStatuses = ['preparing', 'shipping', 'cancelled'];
      if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Admin can only change status to: preparing, shipping, cancelled'
        });
      }

      // Kiểm tra logic chuyển đổi trạng thái
      // Nếu đơn hàng đã ở trạng thái shipping, admin không thể thay đổi nữa
      if (currentOrder.status === 'shipping') {
        return res.status(400).json({
          success: false,
          message: 'Cannot change status of an order that is already being shipped'
        });
      }

      // Nếu đơn hàng đã delivered hoặc cancelled, không thể thay đổi
      if (currentOrder.status === 'delivered' || currentOrder.status === 'cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Cannot change status of a completed or cancelled order'
        });
      }

      // Kiểm tra nếu status là shipping thì phải có shipper_id
      if (status === 'shipping' && !shipper_id) {
        return res.status(400).json({
          success: false,
          message: 'Shipper ID is required when status is shipping'
        });
      }

      // Kiểm tra nếu status là cancelled thì phải có cancel_reason
      if (status === 'cancelled' && !cancel_reason) {
        return res.status(400).json({
          success: false,
          message: 'Cancel reason is required when cancelling order'
        });
      }

      // Nếu có shipper_id, kiểm tra shipper có tồn tại không
      if (shipper_id) {
        const shipperExists = await UserModel.findById(shipper_id).lean();
        if (!shipperExists) {
          return res.status(404).json({
            success: false,
            message: 'Shipper not found'
          });
        }
      }

      const updateData = { status };
      if (status === 'delivered') {
        updateData.delivered_at = new Date();
      }
      
      // Gán shipper_id khi status là shipping
      if (status === 'shipping' && shipper_id) {
        updateData.shipper_id = shipper_id;
      }

      // Gán cancel_reason khi status là cancelled
      if (status === 'cancelled' && cancel_reason) {
        updateData.cancel_reason = cancel_reason;
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

      if (status == 'cancelled') {
        await cancelledAdminNotification(updatedOrder._id.toString());
      }

      try {
        await createOrderStatusNotification(updatedOrder.user_id.toString(), updatedOrder._id.toString(), status);
        
        // Nếu status là shipping và có shipper_id, gửi notification cho shipper
        if (status === 'shipping' && shipper_id) {
          const customer = await OrderController.populateUserInfo(updatedOrder.user_id);
          const customerName = customer ? customer.name : 'Khách hàng';
          await createShipperAssignmentNotification(shipper_id, updatedOrder._id.toString(), customerName);
        }
      } catch (notificationError) {
        console.error('Error creating status notification:', notificationError);
      }

      // Include voucher, address and user in response
      const [voucher, address, user] = await Promise.all([
        updatedOrder.voucher_id ? VoucherModel.findById(updatedOrder.voucher_id).lean() : null,
        AddressModel.findById(updatedOrder.address_id).lean(),
        OrderController.populateUserInfo(updatedOrder.user_id)
      ]);

      const orderWithDetails = {
        ...updatedOrder,
        user: user,
        voucher: voucher,
        address: address
      };

      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: orderWithDetails
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

      const userExists = await UserModel.findById(user_id).lean();
      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

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

          const orderDetailsWithInfo = await Promise.all(
            orderDetails.map(async (detail) => {
              const [product, variant] = await Promise.all([
                Product.findById(detail.product_id).lean(),
                ProductVariant.findById(detail.variant_id).lean()
              ]);

              return {
                ...detail,
                product: product,
                variant: variant
              };
            })
          );

          const [voucher, address] = await Promise.all([
            order.voucher_id ? VoucherModel.findById(order.voucher_id).lean() : null,
            AddressModel.findById(order.address_id).lean()
          ]);

          return {
            ...order,
            user: userExists,
            voucher: voucher,
            address: address,
            order_details: orderDetailsWithInfo
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
        { 
          $match: {
            ...matchStage,
            status: 'delivered' // Chỉ tính doanh thu từ đơn hàng đã giao
          }
        },
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
            total_amount: { 
              $sum: {
                $cond: [
                  { $eq: ['$status', 'delivered'] },
                  '$total_amount',
                  0
                ]
              }
            }
          }
        }
      ]);

      const paymentMethodBreakdown = await OrderModel.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$payment_method',
            count: { $sum: 1 },
            total_amount: { 
              $sum: {
                $cond: [
                  { $eq: ['$status', 'delivered'] },
                  '$total_amount',
                  0
                ]
              }
            }
          }
        }
      ]);

      // Thêm thống kê theo user (chỉ tính từ đơn hàng đã giao)
      const topCustomers = await OrderModel.aggregate([
        { 
          $match: {
            ...matchStage,
            status: 'delivered'
          }
        },
        {
          $group: {
            _id: '$user_id',
            total_orders: { $sum: 1 },
            total_spent: { $sum: '$total_amount' },
            average_order_value: { $avg: '$total_amount' }
          }
        },
        { $sort: { total_spent: -1 } },
        { $limit: 10 }
      ]);

      // Populate user info cho top customers
      const topCustomersWithInfo = await Promise.all(
        topCustomers.map(async (customer) => {
          const user = await OrderController.populateUserInfo(customer._id);
          return {
            ...customer,
            user: user
          };
        })
      );

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
          payment_method_breakdown: paymentMethodBreakdown,
          top_customers: topCustomersWithInfo
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
   * @desc    Get monthly revenue
   * @route   GET /api/orders/monthly-revenue
   * @access  Private
   */
  async getMonthlyRevenue(req, res) {
    try {
      const { year = new Date().getFullYear() } = req.query;
      
      const monthlyStats = await OrderModel.aggregate([
        {
          $match: {
            created_at: {
              $gte: new Date(year, 0, 1),
              $lt: new Date(parseInt(year) + 1, 0, 1)
            },
            status: 'delivered'
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$created_at' },
              month: { $month: '$created_at' }
            },
            revenue: { $sum: '$total_amount' },
            orders: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.month': 1 }
        }
      ]);

      // Create array with all 12 months
      const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
      const result = monthNames.map((month, index) => {
        const monthData = monthlyStats.find(stat => stat._id.month === index + 1);
        return {
          month,
          revenue: monthData ? monthData.revenue : 0,
          orders: monthData ? monthData.orders : 0
        };
      });

      res.status(200).json({
        success: true,
        message: 'Monthly revenue retrieved successfully',
        data: result
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
   * @desc    Get orders for shipper
   * @route   GET /api/orders/shipper/:shipper_id
   * @access  Private (Shipper only)
   */
  async getOrdersForShipper(req, res) {
    try {
      const { shipper_id } = req.params;
      const { page = 1, limit = 10, status } = req.query;

      // Kiểm tra shipper có tồn tại không
      const shipperExists = await UserModel.findById(shipper_id).lean();
      if (!shipperExists) {
        return res.status(404).json({
          success: false,
          message: 'Shipper not found'
        });
      }

      const filter = { shipper_id };
      
      // Nếu có status filter, thêm vào query
      if (status) {
        filter.status = status;
      } else {
        // Mặc định chỉ lấy đơn hàng có status shipping, delivered hoặc cancelled (nhưng chỉ cancelled bởi shipper)
        filter.status = { $in: ['shipping', 'delivered', 'cancelled'] };
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const orders = await OrderModel
        .find(filter)
        .sort({ updated_at: -1 })
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

          const orderDetailsWithInfo = await Promise.all(
            orderDetails.map(async (detail) => {
              const [product, variant] = await Promise.all([
                Product.findById(detail.product_id).lean(),
                ProductVariant.findById(detail.variant_id).lean()
              ]);

              return {
                ...detail,
                product: product,
                variant: variant
              };
            })
          );

          const [voucher, address, user, shipper] = await Promise.all([
            order.voucher_id ? VoucherModel.findById(order.voucher_id).lean() : null,
            AddressModel.findById(order.address_id).lean(),
            OrderController.populateUserInfo(order.user_id),
            OrderController.populateUserInfo(order.shipper_id)
          ]);

          return {
            ...order,
            user: user,
            voucher: voucher,
            address: address,
            shipper: shipper,
            order_details: orderDetailsWithInfo
          };
        })
      );

      res.status(200).json({
        success: true,
        message: 'Get shipper orders successfully',
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
   * @desc    Update order status by shipper (shipping to delivered only)
   * @route   PATCH /api/orders/shipper/:shipper_id/:order_id/status
   * @access  Private (Shipper only)
   */
  async updateOrderStatusByShipper(req, res) {
    try {
      const { shipper_id, order_id } = req.params;
      const { status, cancel_reason } = req.body;

      if (!mongoose.Types.ObjectId.isValid(order_id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid order ID format'
        });
      }

      // Shipper chỉ được phép thay đổi từ shipping sang delivered hoặc cancelled
      const allowedStatuses = ['delivered', 'cancelled'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Shipper can only update status to delivered or cancelled'
        });
      }

      // Kiểm tra nếu status là cancelled thì phải có cancel_reason
      if (status === 'cancelled' && !cancel_reason) {
        return res.status(400).json({
          success: false,
          message: 'Cancel reason is required when cancelling delivery'
        });
      }

      // Kiểm tra đơn hàng có tồn tại và thuộc về shipper này không
      const order = await OrderModel.findOne({
        _id: order_id,
        shipper_id: shipper_id,
        status: 'shipping'
      }).lean();

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found or you are not authorized to update this order'
        });
      }

      const updateData = { status };
      
      if (status === 'delivered') {
        updateData.delivered_at = new Date();
      }
      
      if (status === 'cancelled' && cancel_reason) {
        updateData.cancel_reason = cancel_reason;
      }

      const updatedOrder = await OrderModel.findByIdAndUpdate(
        order_id,
        updateData,
        { new: true, runValidators: true }
      ).lean();

      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      try {
        await createOrderStatusNotification(updatedOrder.user_id.toString(), updatedOrder._id.toString(), status);
      } catch (notificationError) {
        console.error('Error creating status notification:', notificationError);
      }

      // Include voucher, address, user and shipper in response
      const [voucher, address, user, shipper] = await Promise.all([
        updatedOrder.voucher_id ? VoucherModel.findById(updatedOrder.voucher_id).lean() : null,
        AddressModel.findById(updatedOrder.address_id).lean(),
        OrderController.populateUserInfo(updatedOrder.user_id),
        OrderController.populateUserInfo(updatedOrder.shipper_id)
      ]);

      const orderWithDetails = {
        ...updatedOrder,
        user: user,
        voucher: voucher,
        address: address,
        shipper: shipper
      };

      const message = status === 'delivered' 
        ? 'Order status updated to delivered successfully'
        : 'Order delivery cancelled successfully';
        
      res.status(200).json({
        success: true,
        message: message,
        data: orderWithDetails
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
          product_id: new mongoose.Types.ObjectId(),
          variant_id: new mongoose.Types.ObjectId(),
          name: 'iPhone 15 Pro Max 256GB',
          price: 29990000,
          image: 'https://example.com/images/iphone15promax.jpg'
        },
        {
          product_id: new mongoose.Types.ObjectId(),
          variant_id: new mongoose.Types.ObjectId(),
          name: 'Samsung Galaxy S24 Ultra 512GB',
          price: 31990000,
          image: 'https://example.com/images/galaxy-s24-ultra.jpg'
        },
        {
          product_id: new mongoose.Types.ObjectId(),
          variant_id: new mongoose.Types.ObjectId(),
          name: 'MacBook Pro 14" M3 Pro',
          price: 54990000,
          image: 'https://example.com/images/macbook-pro-14.jpg'
        },
        {
          product_id: new mongoose.Types.ObjectId(),
          variant_id: new mongoose.Types.ObjectId(),
          name: 'iPad Pro 12.9" M2 256GB',
          price: 26990000,
          image: 'https://example.com/images/ipad-pro-12.jpg'
        },
        {
          product_id: new mongoose.Types.ObjectId(),
          variant_id: new mongoose.Types.ObjectId(),
          name: 'AirPods Pro 2nd Gen',
          price: 6190000,
          image: 'https://example.com/images/airpods-pro-2.jpg'
        },
        {
          product_id: new mongoose.Types.ObjectId(),
          variant_id: new mongoose.Types.ObjectId(),
          name: 'Apple Watch Series 9 45mm',
          price: 10990000,
          image: 'https://example.com/images/apple-watch-s9.jpg'
        },
        {
          product_id: new mongoose.Types.ObjectId(),
          variant_id: new mongoose.Types.ObjectId(),
          name: 'Dell XPS 13 Plus',
          price: 35990000,
          image: 'https://example.com/images/dell-xps-13.jpg'
        },
        {
          product_id: new mongoose.Types.ObjectId(),
          variant_id: new mongoose.Types.ObjectId(),
          name: 'Sony WH-1000XM5',
          price: 8990000,
          image: 'https://example.com/images/sony-wh1000xm5.jpg'
        }
      ];

      const statuses = ['pending', 'preparing', 'shipping', 'delivered', 'canceled'];
      const paymentMethods = ['credit_card', 'debit_card', 'bank_transfer', 'e_wallet', 'cod'];
      const voucherIds = ['voucher_001', 'voucher_002', 'voucher_003', null, null, null];

      const orders = [];
      const orderDetails = [];

      for (let i = 0; i < 50; i++) {
        const randomUser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const randomPaymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        const randomVoucherId = voucherIds[Math.floor(Math.random() * voucherIds.length)];

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
            product_id: randomProduct.product_id,
            variant_id: randomProduct.variant_id,
            name: randomProduct.name,
            price: randomProduct.price,
            quantity: quantity,
            image: randomProduct.image
          });

          totalAmount += randomProduct.price * quantity;
          totalQuantity += quantity;
        }

        if (randomVoucherId) {
          const discountPercent = Math.floor(Math.random() * 20) + 5;
          totalAmount = totalAmount * (1 - discountPercent / 100);
        }

        orders.push({
          _id: orderId,
          user_id: randomUser,
          status: randomStatus,
          quantity: totalQuantity,
          total_amount: Math.round(totalAmount),
          voucher_id: randomVoucherId,
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

const orderController = new OrderController();
export default orderController;