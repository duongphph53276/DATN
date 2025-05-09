import express from "express"
import mongoose from "mongoose"
import routerProduct from "./routes/product.routes.js";

const app = express()

app.use(express.json());
//mongoose
async function connectDB(uri) {
    try {
        await mongoose.connect(uri);
        console.log(`Kết Nối Thành Công`);
    } catch (error) {
        console.log(`Kết Nối Thất Bại`,error.message);
    }
}
connectDB(`mongodb://localhost:27017/datn`);

app.use("/api/", routerProduct);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
export const appNode = app;