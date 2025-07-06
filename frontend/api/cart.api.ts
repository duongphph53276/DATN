// src/api/cart.ts
import instance from './instance';

export const getCartByUser = (userId: string) => instance.get(`/cart/${userId}`);
export const addToCart = (data: { userId: string; productId: string; quantity: number }) =>
  instance.post('/cart/add', data);
export const removeFromCart = (data: { userId: string; productId: string }) =>
  instance.put('/cart/remove', data);
export const clearCart = (userId: string) => instance.delete(`/cart/clear/${userId}`);
