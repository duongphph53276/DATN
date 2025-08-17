// index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { CreateVoucher, ListVoucher, UpdateVoucher, DeleteVoucher, ApplyVoucher, GetVoucherById } from './controllers/voucher.js';
import { AddCategory, DeleteCategory, EditCategory, GetCategoryById, ListCategory, getCategoryDistribution, reorderCategories, updateDisplayLimit } from './controllers/category.js';
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct, getProductStatistics } from './controllers/product.js';
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
import upload from './middleware/upload.js';
import { createPermission, deletePermission, getPermissionById, getPermissions, updatePermission } from './controllers/user/permission.js';
import { createDefaultPermissions } from './data/permissions.js';
import { createDefaultRoles } from './data/roles.js';
import { initializeSocket } from './socket/socket.js';
import notificationRoutes from './routes/notification.routes.js';

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

app.post('/roles/create', createRole);
app.get('/roles', getRoles);
app.get('/roles/:id', getRoleById);
app.put('/roles/:id', updateRole);
app.delete('/roles/:id', deleteRole);

// Role-Permission routes
app.get('/roles/:roleId/permissions', getRolePermissions);
app.post('/roles/assign-permission', assignPermissionToRole);
app.delete('/roles/:role_id/permissions/:permission_id', removePermissionFromRole);
app.get('/roles/:roleId/available-permissions', getAvailablePermissions);

// Permission routes
app.post('/permissions/create', createPermission);
app.get('/permissions', getPermissions);
app.get('/permissions/:id', getPermissionById);
app.put('/permissions/:id', updatePermission);
app.delete('/permissions/:id', deletePermission);

app.get('/vouchers', ListVoucher);
app.post('/vouchers', CreateVoucher);
app.post('/vouchers/apply', ApplyVoucher);
app.put('/vouchers/:id', UpdateVoucher);
app.delete('/vouchers/:id', DeleteVoucher);
app.get('/vouchers/:id', GetVoucherById); // ✅ Đúng: dùng controller của voucher

// product routes
app.post('/product/add', upload.fields([
  { name: "images", maxCount: 1 },
  { name: "album[]", maxCount: 10 }
]), createProduct);
app.get('/category', ListCategory);
app.get('/categories/distribution', getCategoryDistribution);

app.get('/product', getAllProducts);
app.get('/product/:id', getProductById);
app.put('/product/edit/:id', updateProduct);
app.delete('/product/:id', deleteProduct);
app.get('/products/statistics', getProductStatistics);
// Attribute routes
app.post("/attribute/add", createAttribute);
app.get("/attribute", getAllAttributes);
app.get("/attribute/:id", getAttributeById);
app.delete('/attribute/:id', deleteAttribute);
app.put('/attribute/edit/:id', updateAttribute);
// AttributeValue routes (gắn theo attributeId)
app.post("/attribute-value/add", createAttributeValue);
app.get("/attribute-value/list/:attributeId", getAttributeValues);
app.get("/attribute-value/:id", getAttributeValueById);
app.put("/attribute-value/edit/:id", updateAttributeValue);
app.delete("/attribute-value/:id", deleteAttributeValue)
// Variant routes
app.post("/variant/add", createVariant);
app.get("/variant/:id", getVariantById);
app.get("/product/:productId/variants", getVariantsByProduct);
app.delete('/variant/:id', deleteVariant);
app.put('/variant/edit/:id', updateVariant);
app.post('/product-variants/update-quantity', updateVariantQuantity);
// oder
app.use('/orders', orderRoutes);
//payment
app.use('/payment', paymentRoutes);
//shipping
app.use('/shipping', shippingRoutes);
//notification
app.use('/notifications', notificationRoutes);
app.get('/cart/:userId', GetCartByUser);
app.post('/cart/add', AddToCart);
app.put('/cart/remove', RemoveFromCart);
app.delete('/cart/clear/:userId', ClearCart);

app.get('/category', ListCategory);
app.post('/category/add', AddCategory);
app.put('/category/edit/:id', EditCategory);
app.delete('/category/:id', DeleteCategory);
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


app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

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