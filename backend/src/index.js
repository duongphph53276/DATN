// index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { CreateVoucher, ListVoucher, UpdateVoucher, DeleteVoucher } from './controllers/voucher.js';
import { AddCategory, DeleteCategory, EditCategory, GetCategoryById, ListCategory } from './controllers/category.js';
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from './controllers/product.js';
import { createAttribute,getAttributeById, createAttributeValue, deleteAttribute, getAllAttributes, getAttributeValueById, getAttributeValues, updateAttribute, updateAttributeValue, deleteAttributeValue } from "./controllers/attribute.js";
import { createVariant, getVariantsByProduct } from './controllers/productVariant.js';
import orderRoutes from './routes/order.routes.js';
import { checkEmail, login, register } from './controllers/auth.js';
import authMiddleware from './middleware/auth.js';
import restrictTo from './middleware/restrictTo.js';
import { getUserById, getUsers, updateUser } from './controllers/user/user.js';
import { createRole, getRoleById, getRoles, updateRole } from './controllers/user/role.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Public routes
app.post('/register', register);
app.post('/login', login);
app.get('/check-email', checkEmail);

app.post('/roles/create', createRole);
app.get('/roles', getRoles);
app.get('/roles/:id', getRoleById);
app.put('/roles/:id', updateRole);

app.get('/vouchers', ListVoucher);
app.post('/vouchers', CreateVoucher);
app.put('/vouchers/:id', UpdateVoucher);
app.delete('/vouchers/:id', DeleteVoucher);

app.get('/category', ListCategory);
app.post('/category/add', AddCategory);
app.put('/category/edit/:id', EditCategory);
app.delete('/category/:id', DeleteCategory);
app.get('/category/:id', GetCategoryById);

// product routes
app.post('/product/add', createProduct);
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
app.post("/attribute-value/add", createAttributeValue);
app.get("/attribute-value/list/:attributeId", getAttributeValues);
app.get("/attribute-value/:id", getAttributeValueById);
app.put("/attribute-value/edit/:id", updateAttributeValue);
app.delete("/attribute-value/:id", deleteAttributeValue)
// Variant routes
app.post("/variant/add", createVariant);
app.get("/product/:productId/variants", getVariantsByProduct);
app.use('/api/orders', orderRoutes);

// Admin routes
const adminRouter = express.Router();
adminRouter.use(authMiddleware, restrictTo('admin'));
adminRouter.get('/users', getUsers);
adminRouter.get('/users/:id', getUserById);
adminRouter.put('/users/:id', updateUser);

app.use('/admin', adminRouter);

// Khởi động server
const startServer = async () => {
  await connectDB();  
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();