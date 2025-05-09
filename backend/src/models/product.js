import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        // productID: {
        //     type: String,
        //     required: true
        // },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        // Bộ sưu tập ảnh
        gallery: {
            type: [String],
        },
        status: {
            type: String,
            enum: ["in stock", "out of stock"],
            default: "in stock"
        },
        countInstock: {
            type: Number,
            default: 0
        },
        description: {
            type: String
        },
        comment: {
            type: String
        },
        views: {
            type: Number,
            default: 0
        }
    }
)
export default mongoose.model("Product", productSchema)