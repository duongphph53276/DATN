import { CartModel } from '../models/Cart.js'; 
import mongoose from 'mongoose';

// Lấy giỏ hàng theo userId
export const GetCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await CartModel.findOne({ userId }).populate('items.productId', 'name price');
    if (!cart) {
      return res.status(404).send({ message: 'Không tìm thấy giỏ hàng', status: false });
    }
    res.status(200).send({ message: 'Lấy giỏ hàng thành công', status: true, data: cart });
  } catch (error) {
    res.status(500).send({ message: 'Thất bại', status: false, error: error.message });
  }
};

// Thêm sản phẩm vào giỏ hàng
export const AddToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send({ message: 'ID sản phẩm không hợp lệ', status: false });
    }

    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      cart = new CartModel({ userId, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(201).send({ message: 'Cập nhật giỏ hàng thành công', status: true, data: cart });
  } catch (error) {
    res.status(500).send({ message: 'Thêm thất bại', status: false, error: error.message });
  }
};

// Xoá sản phẩm khỏi giỏ hàng
export const RemoveFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).send({ message: 'Không tìm thấy giỏ hàng', status: false });

    cart.items = cart.items.filter(item => !item.productId.equals(productId));
    await cart.save();

    res.status(200).send({ message: 'Xóa sản phẩm thành công', status: true, data: cart });
  } catch (error) {
    res.status(500).send({ message: 'Xoá thất bại', status: false, error: error.message });
  }
};

// Xoá toàn bộ giỏ hàng
export const ClearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await CartModel.findOne({ userId });
    if (!cart) return res.status(404).send({ message: 'Không tìm thấy giỏ hàng', status: false });

    cart.items = [];
    await cart.save();

    res.status(200).send({ message: 'Đã xóa toàn bộ giỏ hàng', status: true });
  } catch (error) {
    res.status(500).send({ message: 'Thất bại khi xóa giỏ hàng', status: false, error: error.message });
  }
};
