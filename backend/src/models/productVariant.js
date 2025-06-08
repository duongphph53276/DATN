import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema({
    variant_id:{
        type: Number,
    },
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
        default: 0,
    },
    image: {
        type: String,
    },
    sold_quantity: {
        type: Number,
        default: 0,
    },
}, { timestamps: true, versionKey: false });

export default mongoose.model("ProductVariant", productVariantSchema);
