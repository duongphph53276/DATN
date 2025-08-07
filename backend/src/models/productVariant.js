import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
    },
    sold_quantity: {
        type: Number,
        default: 0
    }

}, { timestamps: true, versionKey: false });

export default mongoose.models.ProductVariant || mongoose.model("ProductVariant", productVariantSchema);
