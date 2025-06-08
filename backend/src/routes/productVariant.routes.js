import express from "express";
import { createVariant, getVariantsByProduct } from "../controllers/productVariant.js";

const router = express.Router();

router.post("/", createVariant);
router.get("/product/:productId", getVariantsByProduct);

export default router;
