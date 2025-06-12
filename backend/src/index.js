import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { AddCategory, DeleteCategory, EditCategory, GetCategoryById, ListCategory } from './controllers/category.js';
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from './controllers/product.js';
import { createAttribute, createAttributeValue, getAllAttributes, getAttributeValues } from "./controllers/attribute.js";
import { createVariant, getVariantsByProduct } from './controllers/productVariant.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Public routes - Tạm thời dùng full routes vào đây, sau khi middleware sẽ chia sau
// app.post('/register', Register);
// app.post('/login', Login);
// app.get('/products', ListProduct);
// app.get('/products/:id', GetProductById);

app.get('/category', ListCategory)
app.post('/category/add', AddCategory)
app.put('/category/edit/:id', EditCategory)
app.delete('/category/:id', DeleteCategory)
app.get('/category/:id', GetCategoryById);
// product routes
app.post('/product/add', createProduct);
app.get('/product', getAllProducts);
app.get('/product/:id', getProductById);
app.put('/product/edit/:id', updateProduct);
app.delete('/product/:id', deleteProduct);
// Attribute routes
app.post("/attribute",createAttribute);
app.get("/attribute", getAllAttributes);

// AttributeValue routes (gắn theo attributeId)
app.post("/value/:attributeId", createAttributeValue);
app.get("/value/:attributeId", getAttributeValues);
// Variant routes
app.post("/variant", createVariant);
app.get("/product/:productId/variants", getVariantsByProduct);

// Protected routes cho client (đã đăng nhập) - Phải có authMiddleware là đã đăng nhập - middleware

//app.get('/profile', authMiddleware, Profile);
//app.put('/profile', authMiddleware, UpdateProfile);

// Admin routes (chỉ admin)
// các file admin sẽ có định dạng như sau :

//const adminRouter = express.Router(); - kích hoạt quyền admin cho mỗi routes - middleware
//adminRouter.use(authMiddleware, restrictTo('admin')); - đây để xác nhận chỉ đăng nhập - middleware
//adminRouter.get('/products', ListProduct);

//app.use('/admin', adminRouter); - định hướng admin của middleware



// Khởi động server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();