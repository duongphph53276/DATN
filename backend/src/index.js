import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import routerProduct from './routes/product.routes.js';
import routerProductVariant from './routes/productVariant.routes.js';

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

// Protected routes cho client (đã đăng nhập) - Phải có authMiddleware là đã đăng nhập - middleware

//app.get('/profile', authMiddleware, Profile);
//app.put('/profile', authMiddleware, UpdateProfile);

// Admin routes (chỉ admin)
// các file admin sẽ có định dạng như sau :

//const adminRouter = express.Router(); - kích hoạt quyền admin cho mỗi routes - middleware
//adminRouter.use(authMiddleware, restrictTo('admin')); - đây để xác nhận chỉ đăng nhập - middleware
//adminRouter.get('/products', ListProduct);

//app.use('/admin', adminRouter); - định hướng admin của middleware
app.use('', routerProduct);
app.use('/product-variants', routerProductVariant)
// Khởi động server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();