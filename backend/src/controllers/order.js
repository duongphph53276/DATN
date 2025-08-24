import { OrderModel } from '../models/OrderModel.js';
import { OrderDetailModel } from '../models/OrderDetailModel.js';
import { VoucherModel } from '../models/Voucher.js';
import { AddressModel } from '../models/User/address.js';
import { UserModel } from '../models/User/user.js';
import Product from '../models/product.js';
import ProductVariant from '../models/productVariant.js';
import VariantAttributeValue from '../models/variantAttributeValue.js';
import {
  createOrderSuccessNotification,
  createOrderStatusNotification,
  createNewOrderAdminNotification,
  cancelledAdminNotification,
  createShipperAssignmentNotification,
  createCancelRequestNotification,
  createCancelRequestRejectedNotification,
  createReturnRequestNotification,
  createReturnRequestRejectedNotification
} from '../services/notificationService.js';
import { calculateShippingFee } from '../common/shipping.js';
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

              // Lấy variant attributes với thông tin chi tiết
              const variantAttributes = await VariantAttributeValue
                .find({ variant_id: detail.variant_id })
                .populate('attribute_id', 'name')
                .populate('value_id', 'value')
                .lean();

              const variantWithAttributes = variant ? {
                ...variant,
                attributes: variantAttributes.map(attr => ({
                  attribute_id: attr.attribute_id._id,
                  value_id: attr.value_id._id,
                  attribute_name: attr.attribute_id.name,
                  value: attr.value_id.value
                }))
              } : null;

              return {
                ...detail,
                product: product,
                variant: variantWithAttributes
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

          // Lấy variant attributes với thông tin chi tiết
          const variantAttributes = await VariantAttributeValue
            .find({ variant_id: detail.variant_id })
            .populate('attribute_id', 'name')
            .populate('value_id', 'value')
            .lean();

          const variantWithAttributes = variant ? {
            ...variant,
            attributes: variantAttributes.map(attr => ({
              attribute_id: attr.attribute_id._id,
              value_id: attr.value_id._id,
              attribute_name: attr.attribute_id.name,
              value: attr.value_id.value
            }))
          } : null;

          return {
            ...detail,
            product: product,
            variant: variantWithAttributes
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

  async createOrder(req, res) {
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
          return res.status(400).json({
            success: false,
            message: 'Each order detail must include product_id, variant_id, name, price, and quantity'
          });
        }
      }

      // Get address
      const address = await AddressModel.findById(address_id);
      if (!address) {
        return res.status(404).json({
          success: false,
          message: 'Address not found'
        });
      }

      // Calculate shipping fee
      const shippingFee = calculateShippingFee(address.city);

      // Validate voucher if provided
      if (voucher_id) {
        const voucher = await VoucherModel.findById(voucher_id);
        if (!voucher) {
          return res.status(404).json({
            success: false,
            message: 'Voucher not found'
          });
        }
        if (voucher.quantity <= voucher.used_quantity) {
          return res.status(400).json({
            success: false,
            message: 'Voucher has no remaining uses'
          });
        }
        const userVoucherUsage = await OrderModel.countDocuments({
          user_id,
          voucher_id,
          status: { $ne: 'cancelled' }
        });
        if (userVoucherUsage >= voucher.usage_limit_per_user) {
          return res.status(400).json({
            success: false,
            message: 'User has exceeded voucher usage limit'
          });
        }
      }

      // Create new order
      const newOrder = new OrderModel({
        user_id,
        quantity,
        total_amount,
        shipping_fee: shippingFee,
        voucher_id,
        payment_method,
        address_id
      });

      const savedOrder = await newOrder.save();

      const orderDetailsData = order_details.map(detail => ({
        order_id: savedOrder._id,
        product_id: detail.product_id,
        variant_id: detail.variant_id,
        name: detail.name,
        price: detail.price,
        quantity: detail.quantity,
        image: detail.image
      }));

      const savedOrderDetails = await OrderDetailModel.insertMany(orderDetailsData);

      if (voucher_id) {
        await VoucherModel.findByIdAndUpdate(
          voucher_id,
          { $inc: { used_quantity: 1 } }
        );
      }

      const orderDetailsWithInfo = await Promise.all(
        savedOrderDetails.map(async (detail) => {
          const [product, variant] = await Promise.all([
            Product.findById(detail.product_id).lean(),
            ProductVariant.findById(detail.variant_id).lean()
          ]);

          return {
            ...detail,
            product,
            variant
          };
        })
      );

      const [voucher, addressInfo, user] = await Promise.all([
        savedOrder.voucher_id ? VoucherModel.findById(savedOrder.voucher_id).lean() : null,
        AddressModel.findById(savedOrder.address_id).lean(),
        OrderController.populateUserInfo(savedOrder.user_id)
      ]);

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
          address: addressInfo,
          order_details: orderDetailsWithInfo
        }
      });

    } catch (error) {
      console.error('❌ Error in createOrder:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
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

      const currentOrder = await OrderModel.findById(id).lean();
      if (!currentOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }



      const allowedStatuses = ['preparing', 'shipping', 'cancelled'];
      if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Admin can only change status to: preparing, shipping, cancelled'
        });
      }

      if (currentOrder.status === 'shipping') {
        return res.status(400).json({
          success: false,
          message: 'Cannot change status of an order that is already being shipped'
        });
      }

      if (currentOrder.status === 'delivered' || currentOrder.status === 'cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Cannot change status of a completed or cancelled order'
        });
      }

      if (status === 'shipping' && !shipper_id) {
        return res.status(400).json({
          success: false,
          message: 'Shipper ID is required when status is shipping'
        });
      }

      if (status === 'cancelled' && !cancel_reason) {
        return res.status(400).json({
          success: false,
          message: 'Cancel reason is required when cancelling order'
        });
      }

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

      if (status === 'shipping' && shipper_id) {
        updateData.shipper_id = shipper_id;
      }

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

      if (status === 'cancelled') {
        await cancelledAdminNotification(updatedOrder._id.toString());
      }

      try {
        await createOrderStatusNotification(updatedOrder.user_id.toString(), updatedOrder._id.toString(), status);

        if (status === 'shipping' && shipper_id) {
          const customer = await OrderController.populateUserInfo(updatedOrder.user_id);
          const customerName = customer ? customer.name : 'Khách hàng';
          await createShipperAssignmentNotification(shipper_id, updatedOrder._id.toString(), customerName);
        }
      } catch (notificationError) {
        console.error('Error creating status notification:', notificationError);
      }

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

      console.log('🔍 getOrdersByUserId - user_id:', user_id);
      console.log('🔍 getOrdersByUserId - query params:', req.query);

      const userExists = await UserModel.findById(user_id).lean();
      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const filter = { user_id };
      if (status) filter.status = status;

      console.log('🔍 getOrdersByUserId - filter:', filter);

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const orders = await OrderModel
        .find(filter)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const totalOrders = await OrderModel.countDocuments(filter);
      const totalPages = Math.ceil(totalOrders / parseInt(limit));

      console.log('🔍 getOrdersByUserId - found orders count:', orders.length);
      console.log('🔍 getOrdersByUserId - total orders in DB:', totalOrders);
      console.log('🔍 getOrdersByUserId - orders dates:', orders.map(o => ({ id: o._id, date: o.created_at, status: o.status })));

      // Debug: Kiểm tra tất cả đơn hàng của user này trong DB
      const allUserOrders = await OrderModel.find({ user_id }).sort({ created_at: -1 }).lean();
      console.log('🔍 getOrdersByUserId - ALL orders for this user:', allUserOrders.map(o => ({
        id: o._id,
        date: o.created_at,
        status: o.status,
        total_amount: o.total_amount
      })));

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

              // Lấy variant attributes với thông tin chi tiết
              const variantAttributes = await VariantAttributeValue
                .find({ variant_id: detail.variant_id })
                .populate('attribute_id', 'name')
                .populate('value_id', 'value')
                .lean();

              const variantWithAttributes = variant ? {
                ...variant,
                attributes: variantAttributes.map(attr => ({
                  attribute_id: attr.attribute_id._id,
                  value_id: attr.value_id._id,
                  attribute_name: attr.attribute_id.name,
                  value: attr.value_id.value
                }))
              } : null;

              return {
                ...detail,
                product: product,
                variant: variantWithAttributes
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

      // Tính tổng đơn hàng và doanh thu từ OrderModel (chỉ 'delivered')
      const stats = await OrderModel.aggregate([
        {
          $match: {
            ...matchStage,
            status: 'delivered'
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

      // Tính tổng chi phí từ OrderDetailModel (join với Order để filter 'delivered', join với ProductVariant để lấy import_price)
      const costAggregation = await OrderDetailModel.aggregate([
        {
          $lookup: {
            from: 'orders', // Collection name của OrderModel
            localField: 'order_id',
            foreignField: '_id',
            as: 'order'
          }
        },
        { $unwind: { path: '$order', preserveNullAndEmptyArrays: true } },
        {
          $match: {
            'order.status': 'delivered',
            ...(Object.keys(matchStage).length > 0 ? { 'order.created_at': matchStage.created_at } : {}),
          }
        },
        {
          $lookup: {
            from: 'productvariants',
            let: { variantId: { $toObjectId: "$variant_id" } },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$variantId"] } } }
            ],
            as: "variant"
          }
        },
        { $unwind: { path: '$variant', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: null,
            total_cost: {
              $sum: {
                $multiply: [
                  '$quantity',
                  { $ifNull: ['$variant.import_price', 0] }
                ]
              }
            }
          }
        }
      ]);

      const totalCost = costAggregation[0]?.total_cost || 0;
      const totalRevenue = stats[0]?.total_revenue || 0;
      const totalProfit = totalRevenue - totalCost;

      //top product
      const topProducts = await OrderDetailModel.aggregate([
        {
          $lookup: {
            from: 'orders',
            localField: 'order_id',
            foreignField: '_id',
            as: 'order'
          }
        },
        { $unwind: { path: '$order', preserveNullAndEmptyArrays: true } },
        {
          $match: {
            'order.status': 'delivered',
            ...(Object.keys(matchStage).length > 0 ? { 'order.created_at': matchStage.created_at } : {}),
          }
        },
        {
          $group: {
            _id: '$product_id',
            total_quantity: { $sum: '$quantity' },
            total_revenue: { $sum: { $multiply: ['$quantity', '$price'] } }
          }
        },
        { $sort: { total_quantity: -1 } },
        { $limit: 10 }
      ]);

      const topProductsWithInfo = await Promise.all(
        topProducts.map(async (prod) => {
          const product = await Product.findById(prod._id).lean();
          return {
            ...prod,
            product: product
          };
        })
      );

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
          overall_stats: {
            ...(stats[0] || {
              total_orders: 0,
              total_revenue: 0,
              average_order_value: 0,
              total_quantity: 0
            }),
            total_profit: totalProfit,
            total_cost: totalCost, // Optional, để debug
            top_products: topProductsWithInfo
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
   * @desc    Get daily revenue for a specific month
   * @route   GET /api/orders/daily-revenue?year=YYYY&month=MM
   * @access  Private
   */
  async getDailyRevenue(req, res) {
    try {
      const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query;
      const yearNum = parseInt(year);
      const monthNum = parseInt(month) - 1; // JS month 0-based

      const startDate = new Date(yearNum, monthNum, 1);
      const endDate = new Date(yearNum, monthNum + 1, 1);

      const dailyStats = await OrderModel.aggregate([
        {
          $match: {
            created_at: { $gte: startDate, $lt: endDate },
            status: 'delivered'
          }
        },
        {
          $group: {
            _id: { day: { $dayOfMonth: '$created_at' } },
            revenue: { $sum: '$total_amount' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { '_id.day': 1 } }
      ]);

      const daysInMonth = new Date(yearNum, monthNum + 1, 0).getDate();
      const result = Array.from({ length: daysInMonth }, (_, idx) => {
        const day = idx + 1;
        const stat = dailyStats.find(s => s._id.day === day);
        return {
          day,
          revenue: stat ? stat.revenue : 0,
          orders: stat ? stat.orders : 0
        };
      });

      res.status(200).json({
        success: true,
        message: 'Daily revenue retrieved successfully',
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
   * @desc    Get yearly revenue for a range of years
   * @route   GET /api/orders/yearly-revenue?start_year=YYYY&end_year=YYYY
   * @access  Private
   */
  async getYearlyRevenue(req, res) {
    try {
      const currentYear = new Date().getFullYear();
      const startYear = parseInt(req.query.start_year) || currentYear - 4; // last 5 years by default
      const endYear = parseInt(req.query.end_year) || currentYear;

      const startDate = new Date(startYear, 0, 1);
      const endDate = new Date(endYear + 1, 0, 1);

      const yearlyStats = await OrderModel.aggregate([
        {
          $match: {
            created_at: { $gte: startDate, $lt: endDate },
            status: 'delivered'
          }
        },
        {
          $group: {
            _id: { year: { $year: '$created_at' } },
            revenue: { $sum: '$total_amount' },
            orders: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1 } }
      ]);

      const result = [];
      for (let y = startYear; y <= endYear; y++) {
        const stat = yearlyStats.find(s => s._id.year === y);
        result.push({ year: y, revenue: stat ? stat.revenue : 0, orders: stat ? stat.orders : 0 });
      }

      res.status(200).json({
        success: true,
        message: 'Yearly revenue retrieved successfully',
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

      const shipperExists = await UserModel.findById(shipper_id).lean();
      if (!shipperExists) {
        return res.status(404).json({
          success: false,
          message: 'Shipper not found'
        });
      }

      const filter = { shipper_id };

      if (status) {
        filter.status = status;
      } else {
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

              // Lấy variant attributes với thông tin chi tiết
              const variantAttributes = await VariantAttributeValue
                .find({ variant_id: detail.variant_id })
                .populate('attribute_id', 'name')
                .populate('value_id', 'value')
                .lean();

              const variantWithAttributes = variant ? {
                ...variant,
                attributes: variantAttributes.map(attr => ({
                  attribute_id: attr.attribute_id._id,
                  value_id: attr.value_id._id,
                  attribute_name: attr.attribute_id.name,
                  value: attr.value_id.value
                }))
              } : null;

              return {
                ...detail,
                product: product,
                variant: variantWithAttributes
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

      const allowedStatuses = ['delivered', 'cancelled'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Shipper can only update status to delivered or cancelled'
        });
      }

      if (status === 'cancelled' && !cancel_reason) {
        return res.status(400).json({
          success: false,
          message: 'Cancel reason is required when cancelling delivery'
        });
      }

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
   * @desc    Request to cancel order (user initiated) - chỉ khi pending/preparing
   * @route   POST /api/orders/:id/request-cancel
   * @access  Private
   */
  async requestCancelOrder(req, res) {
    try {
      const { id } = req.params;
      const { cancel_reason, cancel_images } = req.body;
      const userId = req.user?.id || req.body.user_id;

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
      if (order.user_id.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only cancel your own orders',
          data: order.user_id,
          userId: userId
        });
      }
      // if (order.user_id != userId) {
      //   return res.status(403).json({
      //     success: false,
      //     message: 'You can only cancel your own orders',
      //     data: order.user_id,
      //     userId: userId
      //   });
      // }

      if (!['pending', 'preparing'].includes(order.status)) {
        return res.status(400).json({
          success: false,
          message: 'Only pending or preparing orders can be cancelled'
        });
      }

      if (!cancel_reason || !cancel_reason.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Cancel reason is required'
        });
      }

      const updateData = {
        cancel_request: {
          reason: cancel_reason.trim(),
          images: cancel_images || [],
          requested_at: new Date(),
          status: 'pending'
        }
      };

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

      try {
        await createCancelRequestNotification(updatedOrder._id.toString(), userId);
      } catch (notificationError) {
        console.error('Error creating cancel request notification:', notificationError);
      }

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
        message: 'Cancel request submitted successfully. Waiting for admin approval.',
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
   * @desc    Admin approve/reject cancel request
   * @route   PATCH /api/orders/:id/cancel-request
   * @access  Private (Admin only)
   */
  async handleCancelRequest(req, res) {
    try {
      const { id } = req.params;
      const { action, admin_note } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid order ID format'
        });
      }

      if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({
          success: false,
          message: 'Action must be either "approve" or "reject"'
        });
      }

      const order = await OrderModel.findById(id).lean();
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      if (!order.cancel_request || order.cancel_request.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'No pending cancel request found for this order'
        });
      }

      let updateData = {};

      if (action === 'approve') {
        updateData = {
          status: 'cancelled',
          cancel_reason: order.cancel_request.reason,
          'cancel_request.status': 'approved',
          'cancel_request.admin_note': admin_note || 'Admin approved cancel request',
          'cancel_request.processed_at': new Date()
        };
      } else {
        updateData = {
          'cancel_request.status': 'rejected',
          'cancel_request.admin_note': admin_note || 'Admin rejected cancel request',
          'cancel_request.processed_at': new Date()
        };
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

      try {
        if (action === 'approve') {
          await createOrderStatusNotification(updatedOrder.user_id.toString(), updatedOrder._id.toString(), 'cancelled');
        } else {
          await createCancelRequestRejectedNotification(updatedOrder.user_id.toString(), updatedOrder._id.toString(), admin_note);
        }
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
      }

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
        message: `Cancel request ${action}d successfully`,
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
   * @desc    Request to return order (user initiated) - chỉ khi đơn hàng đã delivered
   * @route   POST /api/orders/:id/request-return
   * @access  Private
   */
  async requestReturnOrder(req, res) {
    try {
      const { id } = req.params;
      const { return_reason, return_images } = req.body;
      const userId = req.user?.id || req.body.user_id;

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
      
      if (order.user_id.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only return your own orders'
        });
      }
      // if (order.user_id != userId) {
      //   return res.status(403).json({
      //     success: false,
      //     message: 'You can only return your own orders'
      //   });
      // }

      if (order.status !== 'delivered') {
        return res.status(400).json({
          success: false,
          message: 'Only delivered orders can be returned'
        });
      }

      if (!return_reason || !return_reason.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Return reason is required'
        });
      }

      const updateData = {
        return_request: {
          reason: return_reason.trim(),
          images: return_images || [],
          requested_at: new Date(),
          status: 'pending'
        }
      };

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

      try {
        await createReturnRequestNotification(updatedOrder._id.toString(), userId);
      } catch (notificationError) {
        console.error('Error creating return request notification:', notificationError);
      }

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
        message: 'Return request submitted successfully. Waiting for admin approval.',
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
   * @desc    Admin approve/reject return request
   * @route   PATCH /api/orders/:id/return-request
   * @access  Private (Admin only)
   */
  async handleReturnRequest(req, res) {
    try {
      const { id } = req.params;
      const { action, admin_note } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid order ID format'
        });
      }

      if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({
          success: false,
          message: 'Action must be either "approve" or "reject"'
        });
      }

      const order = await OrderModel.findById(id).lean();
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      if (!order.return_request || order.return_request.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'No pending return request found for this order'
        });
      }

      let updateData = {};

      if (action === 'approve') {
        updateData = {
          status: 'returned',
          return_reason: order.return_request.reason,
          'return_request.status': 'approved',
          'return_request.admin_note': admin_note || 'Admin approved return request',
          'return_request.processed_at': new Date()
        };
      } else {
        updateData = {
          'return_request.status': 'rejected',
          'return_request.admin_note': admin_note || 'Admin rejected return request',
          'return_request.processed_at': new Date()
        };
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

      try {
        if (action === 'approve') {
          await createOrderStatusNotification(updatedOrder.user_id.toString(), updatedOrder._id.toString(), 'returned');
        } else {
          await createReturnRequestRejectedNotification(updatedOrder.user_id.toString(), updatedOrder._id.toString(), admin_note);
        }
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
      }

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
        message: `Return request ${action}d successfully`,
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

  /**
   * @desc    Dọn dẹp các cancel_request và return_request không hợp lệ
   * @route   POST /api/orders/cleanup
   * @access  Private (Development only)
   */
  async cleanupInvalidRequests(req, res) {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Cleanup is not allowed in production'
      });
    }

    try {
      const cancelResult = await OrderModel.updateMany(
        {
          $or: [
            { "cancel_request.status": { $exists: false } },
            { "cancel_request.status": null },
            { "cancel_request.status": "" }
          ]
        },
        {
          $unset: { cancel_request: "" }
        }
      );

      const returnResult = await OrderModel.updateMany(
        {
          $or: [
            { "return_request.status": { $exists: false } },
            { "return_request.status": null },
            { "return_request.status": "" }
          ]
        },
        {
          $unset: { return_request: "" }
        }
      );

      const ordersWithInvalidCancel = await OrderModel.countDocuments({
        $or: [
          { "cancel_request.status": { $exists: false } },
          { "cancel_request.status": null },
          { "return_request.status": "" }
        ]
      });

      const ordersWithInvalidReturn = await OrderModel.countDocuments({
        $or: [
          { "return_request.status": { $exists: false } },
          { "return_request.status": null },
          { "return_request.status": "" }
        ]
      });

      res.status(200).json({
        success: true,
        message: 'Cleanup completed successfully',
        data: {
          cancel_requests_cleaned: cancelResult.modifiedCount,
          return_requests_cleaned: returnResult.modifiedCount,
          remaining_invalid_cancel: ordersWithInvalidCancel,
          remaining_invalid_return: ordersWithInvalidReturn
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to cleanup invalid requests',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  }
}

const orderController = new OrderController();
export default orderController;