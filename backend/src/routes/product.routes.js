import express from "express";
import { 
    create,
    delProduct,
    getAllProduct, 
    putProduct
} from "../controllers/product.js";

const router = express.Router();

router.get("/product",getAllProduct)
router.post("/product",create)
router.put("/product/:id",putProduct)
router.delete("/product/:id",delProduct)

export default router;