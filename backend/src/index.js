// index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { CreateVoucher, ListVoucher, UpdateVoucher, DeleteVoucher } from './controllers/voucher.js';
import { AddCategory, DeleteCategory, EditCategory, GetCategoryById, ListCategory } from './controllers/category.js';
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from './controllers/product.js';
import { createAttribute, getAttributeById, deleteAttribute, getAllAttributes, updateAttribute } from "./controllers/attribute.js";
import { createAttributeValue, deleteAttributeValue, getAttributeValueById, getAttributeValues, updateAttributeValue } from './controllers/attributeValue.js';
import { createVariant, deleteVariant, getVariantById, getVariantsByProduct, updateVariant } from './controllers/productVariant.js';
import orderRoutes from './routes/order.routes.js';
import { checkEmail, login, Profile, register, UpdateProfile } from './controllers/auth.js';
import { authMiddleware, restrictTo } from './middleware/auth.js';
import { getUserById, getUsers, updateUser } from './controllers/user/user.js';
import { createRole, getRoleById, getRoles, updateRole } from './controllers/user/role.js';
import path from "path";
import { fileURLToPath } from "url";
import upload from './middleware/upload.js';
import { createPermission, deletePermission, getPermissionById, getPermissions, updatePermission } from './controllers/user/permission.js';

import { AddToCart, ClearCart, GetCartByUser, RemoveFromCart } from './controllers/cart.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Public routes
app.post('/register', register);
app.post('/login', login);
app.get('/check-email', checkEmail);
app.get('/user', authMiddleware, getUserById);

app.get('/profile', authMiddleware, Profile);
app.put('/profile', authMiddleware, UpdateProfile);

app.post('/roles/create', createRole);
app.get('/roles', getRoles);
app.get('/roles/:id', getRoleById);
app.put('/roles/:id', updateRole);

// Permission routes
app.post('/permissions/create', createPermission);
app.get('/permissions', getPermissions);
app.get('/permissions/:id', getPermissionById);
app.put('/permissions/:id', updatePermission);
app.delete('/permissions/:id', deletePermission);

app.get('/vouchers', ListVoucher);
app.post('/vouchers', CreateVoucher);
app.put('/vouchers/:id', UpdateVoucher);
app.delete('/vouchers/:id', DeleteVoucher);

// product routes
app.post('/product/add', upload.fields([
  { name: "images", maxCount: 1 },
  { name: "album[]", maxCount: 10 }
]), createProduct);
app.get('/product', getAllProducts);
app.get('/product/:id', getProductById);
app.put('/product/edit/:id', updateProduct);
app.delete('/product/:id', deleteProduct);
// Attribute routes
app.post("/attribute/add", createAttribute);
app.get("/attribute", getAllAttributes);
app.get("/attribute/:id", getAttributeById);
app.delete('/attribute/:id', deleteAttribute);
app.put('/attribute/edit/:id', updateAttribute);
// AttributeValue routes (gắn theo attributeId)
app.post("/attribute-value/add", createAttributeValue );
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
// oder
app.use('/api/orders', orderRoutes);

app.get('/cart/:userId', GetCartByUser);          
app.post('/cart/add', AddToCart);                  
app.put('/cart/remove', RemoveFromCart);           
app.delete('/cart/clear/:userId', ClearCart);    

app.get('/category', ListCategory);
app.post('/category/add', AddCategory);
app.put('/category/edit/:id', EditCategory);
app.delete('/category/:id', DeleteCategory);
app.get('/category/:id', GetCategoryById);
// Admin routes
const adminRouter = express.Router();
adminRouter.use(authMiddleware, restrictTo('admin'));
adminRouter.get('/users', getUsers);
adminRouter.get('/users/:id', getUserById);
adminRouter.put('/users/:id', updateUser);

// adminRouter.get('/category', ListCategory);
// adminRouter.post('/category/add', AddCategory);
// adminRouter.put('/category/edit/:id', EditCategory);
// adminRouter.delete('/category/:id', DeleteCategory);
// adminRouter.get('/category/:id', GetCategoryById);

// adminRouter.

app.use('/admin', adminRouter);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Khởi động server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();