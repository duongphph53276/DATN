// import Product  from ""
// import ProductVariant from '../../../../../models/ProductVariant'; // Đường dẫn tới model ProductVariant

// export const updateInventoryOnOrder = async (orderDetails: any) => {
//   try {
//     // Duyệt qua từng mục trong đơn hàng
//     for (const item of orderDetails) {
//       const { product_id, variant_id, quantity } = item;

//       // Cập nhật sold_quantity trong Product (tăng số đã bán)
//       await Product.findByIdAndUpdate(
//         product_id,
//         { $inc: { sold_quantity: quantity } },
//         { new: true }
//       );

//       // Nếu có variant_id, cập nhật quantity và sold_quantity trong ProductVariant
//       if (variant_id && variant_id !== 'default-variant') {
//         // Trước tiên kiểm tra tồn kho
//         const variant = await ProductVariant.findById(variant_id);
//         if (!variant) {
//           throw new Error(`Biến thể ${variant_id} không tồn tại`);
//         }
//         if (variant.quantity < quantity) {
//           throw new Error(`Số lượng tồn kho không đủ cho biến thể ${variant_id}`);
//         }

//         // Trừ quantity và tăng sold_quantity
//         await ProductVariant.findByIdAndUpdate(
//           variant_id,
//           {
//             $inc: {
//               quantity: -quantity,  // Trừ tồn kho
//               sold_quantity: quantity  // Tăng số đã bán
//             }
//           },
//           { new: true }
//         );
//       }
//     }
//   } catch (error) {
//     console.error('Lỗi khi cập nhật tồn kho:', error);
//     throw error; // Ném lỗi để xử lý ở client
//   }
// };