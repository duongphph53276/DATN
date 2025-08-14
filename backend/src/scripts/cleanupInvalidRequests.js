import mongoose from 'mongoose';
import { OrderModel } from '../models/OrderModel.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanupInvalidRequests = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Đã kết nối database thành công');

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

    console.log(` Đã xóa ${cancelResult.modifiedCount} cancel_request không hợp lệ`);

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

    console.log(`Đã xóa ${returnResult.modifiedCount} return_request không hợp lệ`);

    const ordersWithInvalidCancel = await OrderModel.countDocuments({
      $or: [
        { "cancel_request.status": { $exists: false } },
        { "cancel_request.status": null },
        { "cancel_request.status": "" }
      ]
    });

    const ordersWithInvalidReturn = await OrderModel.countDocuments({
      $or: [
        { "return_request.status": { $exists: false } },
        { "return_request.status": null },
        { "return_request.status": "" }
      ]
    });

    if (ordersWithInvalidCancel === 0 && ordersWithInvalidReturn === 0) {
      console.log('Tất cả dữ liệu không hợp lệ đã được dọn dẹp thành công!');
    }

  } catch (error) {
    console.error('Lỗi khi dọn dẹp database:', error);
  } finally {
    await mongoose.disconnect();
    console.log(' Đã ngắt kết nối database');
  }
};

cleanupInvalidRequests();
