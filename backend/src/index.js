// index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { CreateVoucher, ListVoucher, UpdateVoucher, DeleteVoucher, ApplyVoucher, GetVoucherById } from './controllers/voucher.js';
import { AddCategory, DeleteCategory, EditCategory, GetCategoryById, ListCategory, getCategoryDistribution, reorderCategories, updateDisplayLimit } from './controllers/category.js';
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct, getProductStatistics } from './controllers/product.js';
import ProductModel from './models/product.js';
import { createAttribute, getAttributeById, deleteAttribute, getAllAttributes, updateAttribute } from "./controllers/attribute.js";
import { createAttributeValue, deleteAttributeValue, getAttributeValueById, getAttributeValues, updateAttributeValue } from './controllers/attributeValue.js';
import { createVariant, deleteVariant, getVariantById, getVariantsByProduct, updateVariant, updateVariantQuantity } from './controllers/productVariant.js';
import orderRoutes from './routes/order.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import shippingRoutes from './routes/shipping.routes.js';
import { checkEmail, login, Profile, register, UpdateProfile, verifyEmail } from './controllers/auth.js';
import { getUserAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from './controllers/address/address.js';
import { authMiddleware, restrictTo } from './middleware/auth.js';
import { getUserById, getUsers, updateUser, getUserWithPermissions, checkUserPermission, changePassword, getUserStatistics, getShippers } from './controllers/user/user.js';
import { createRole, getRoleById, getRoles, updateRole, deleteRole, getRolePermissions, assignPermissionToRole, removePermissionFromRole, getAvailablePermissions } from './controllers/user/role.js';
import path from "path";
import { fileURLToPath } from "url";

import { createPermission, deletePermission, getPermissionById, getPermissions, updatePermission } from './controllers/user/permission.js';
import { createDefaultPermissions } from './data/permissions.js';
import { createDefaultRoles } from './data/roles.js';
import { initializeSocket } from './socket/socket.js';
import notificationRoutes from './routes/notification.routes.js';
import systemConfigRoutes from './routes/systemConfig.routes.js';

import { AddToCart, ClearCart, GetCartByUser, RemoveFromCart } from './controllers/cart.js';
import { checkPurchase, createReview, deleteReview, getAllReviews, getReviewById, getUserReviewByProduct, updateReview } from './controllers/reviews.js';




dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Public routes
app.post('/register', register);
app.post('/login', login);
app.get('/check-email', checkEmail);
app.get('/user', authMiddleware, getUserById);
app.get('/user/permissions', authMiddleware, getUserWithPermissions);
app.get('/user/check-permission/:permissionName', authMiddleware, checkUserPermission);

app.get('/profile', authMiddleware, Profile);
app.put('/profile', authMiddleware, UpdateProfile);
app.put('/profile/change-password', authMiddleware, changePassword);

// Address routes
app.get('/addresses', authMiddleware, getUserAddresses);
app.post('/addresses', authMiddleware, createAddress);
app.put('/addresses/:id', authMiddleware, updateAddress);
app.delete('/addresses/:id', authMiddleware, deleteAddress);
app.put('/addresses/:id/default', authMiddleware, setDefaultAddress);

app.post('/roles/create', authMiddleware, restrictTo('admin'), createRole);
app.get('/roles', authMiddleware, restrictTo('admin'), getRoles);
app.get('/roles/:id', authMiddleware, restrictTo('admin'), getRoleById);
app.put('/roles/:id', authMiddleware, restrictTo('admin'), updateRole);
app.delete('/roles/:id', authMiddleware, restrictTo('admin'), deleteRole);

// Role-Permission routes
app.get('/roles/:roleId/permissions', authMiddleware, restrictTo('admin'), getRolePermissions);
app.post('/roles/assign-permission', authMiddleware, restrictTo('admin'), assignPermissionToRole);
app.delete('/roles/:role_id/permissions/:permission_id', authMiddleware, restrictTo('admin'), removePermissionFromRole);
app.get('/roles/:roleId/available-permissions', authMiddleware, restrictTo('admin'), getAvailablePermissions);

// Permission routes
app.post('/permissions/create', authMiddleware, restrictTo('admin'), createPermission);
app.get('/permissions', authMiddleware, restrictTo('admin'), getPermissions);
app.get('/permissions/:id', authMiddleware, restrictTo('admin'), getPermissionById);
app.put('/permissions/:id', authMiddleware, restrictTo('admin'), updatePermission);
app.delete('/permissions/:id', authMiddleware, restrictTo('admin'), deletePermission);

app.get('/vouchers', ListVoucher);
app.post('/vouchers', authMiddleware, restrictTo('admin', 'employee'), CreateVoucher);
app.post('/vouchers/apply', authMiddleware, ApplyVoucher);
app.put('/vouchers/:id', authMiddleware, restrictTo('admin', 'employee'), UpdateVoucher);
app.delete('/vouchers/:id', authMiddleware, restrictTo('admin', 'employee'), DeleteVoucher);
app.get('/vouchers/:id', GetVoucherById); // ✅ Đúng: dùng controller của voucher

// product routes
// TODO: Update product upload to use Cloudinary instead of local upload
app.post('/product/add', authMiddleware, restrictTo('admin', 'employee'), createProduct);
app.get('/category', ListCategory);
app.get('/categories/distribution', getCategoryDistribution);

app.get('/product', getAllProducts);
app.get('/product/:id', getProductById);
app.put('/product/edit/:id', authMiddleware, restrictTo('admin', 'employee'), updateProduct);
app.delete('/product/:id', authMiddleware, restrictTo('admin', 'employee'), deleteProduct);
app.get('/products/statistics', authMiddleware, restrictTo('admin', 'employee'), getProductStatistics);
// Attribute routes
app.post("/attribute/add", authMiddleware, restrictTo('admin', 'employee'), createAttribute);
app.get("/attribute", getAllAttributes);
app.get("/attribute/:id", getAttributeById);
app.delete('/attribute/:id', authMiddleware, restrictTo('admin', 'employee'), deleteAttribute);
app.put('/attribute/edit/:id', authMiddleware, restrictTo('admin', 'employee'), updateAttribute);
// AttributeValue routes (gắn theo attributeId)
app.post("/attribute-value/add", authMiddleware, restrictTo('admin', 'employee'), createAttributeValue);
app.get("/attribute-value/list/:attributeId", getAttributeValues);
app.get("/attribute-value/:id", getAttributeValueById);
app.put("/attribute-value/edit/:id", authMiddleware, restrictTo('admin', 'employee'), updateAttributeValue);
app.delete("/attribute-value/:id", authMiddleware, restrictTo('admin', 'employee'), deleteAttributeValue)
// Variant routes
app.post("/variant/add", authMiddleware, restrictTo('admin', 'employee'), createVariant);
app.get("/variant/:id", getVariantById);
app.get("/product/:productId/variants", getVariantsByProduct);
app.delete('/variant/:id', authMiddleware, restrictTo('admin', 'employee'), deleteVariant);
app.put('/variant/edit/:id', authMiddleware, restrictTo('admin', 'employee'), updateVariant);
app.post('/product-variants/update-quantity', authMiddleware, restrictTo('admin', 'employee'), updateVariantQuantity);
// oder
app.use('/orders', orderRoutes);
//payment
app.use('/payment', paymentRoutes);
//shipping
app.use('/shipping', shippingRoutes);
//notification
app.use('/notifications', notificationRoutes);
//system config
app.use('/system-config', systemConfigRoutes);
app.get('/cart/:userId', authMiddleware, GetCartByUser);
app.post('/cart/add', authMiddleware, AddToCart);
app.put('/cart/remove', authMiddleware, RemoveFromCart);
app.delete('/cart/clear/:userId', authMiddleware, ClearCart);

app.get('/category', ListCategory);
app.post('/category/add', authMiddleware, restrictTo('admin', 'employee'), AddCategory);
app.put('/category/edit/:id', authMiddleware, restrictTo('admin', 'employee'), EditCategory);
app.delete('/category/:id', authMiddleware, restrictTo('admin', 'employee'), DeleteCategory);
app.get('/category/:id', GetCategoryById);

// Review routes
app.post('/reviews', authMiddleware, createReview);
app.get('/reviews', getAllReviews);
app.get('/reviews/:id', getReviewById);
app.put('/reviews/:id', authMiddleware, updateReview);
app.delete('/reviews/:id', authMiddleware, deleteReview);
app.get('/reviews/user/product/:product_id', authMiddleware, getUserReviewByProduct);

app.get('/product/best-selling', async (req, res) => {
  const limit = req.query.limit || 10;
  // Logic lấy sản phẩm bán chạy, ví dụ sort theo total_sold DESC và limit
  const products = await ProductModel.find().sort({ total_sold: -1 }).limit(Number(limit));
  res.json({ data: products });
});

// Admin routes
const adminRouter = express.Router();
adminRouter.use(authMiddleware, restrictTo('admin', 'employee'));
adminRouter.get('/users', getUsers);
adminRouter.get('/users/statistics', getUserStatistics);
adminRouter.get('/users/shippers', getShippers);
adminRouter.get('/users/:id', getUserById);
adminRouter.put('/users/:id', updateUser);

adminRouter.get('/category', ListCategory);
adminRouter.post('/category/add', AddCategory);
adminRouter.put('/category/edit/:id', EditCategory);
adminRouter.delete('/category/:id', DeleteCategory);
adminRouter.get('/category/:id', GetCategoryById);
adminRouter.patch('/category/reorder', reorderCategories);
adminRouter.patch('/category/display-limit', updateDisplayLimit);

// adminRouter.

app.use('/admin', adminRouter);

// Shipper routes - chỉ cho role shipper
const shipperRouter = express.Router();
shipperRouter.use(authMiddleware, restrictTo('shipper'));

app.use('/shipper', shipperRouter);

app.get('/verify-email', verifyEmail);




app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} Headers:`, req.headers, 'Body:', req.body);
  next();
});

// Khởi động server
const startServer = async () => {
  await connectDB();

  // Tạo permissions mặc định
  await createDefaultPermissions();

  // Tạo roles mặc định và gán permissions
  await createDefaultRoles();

  const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

  // Khởi tạo Socket.IO
  initializeSocket(server);
  console.log('Socket.IO initialized');
};

startServer();