import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    product_id: {
        type: Number,
        unique: true, // Đảm bảo mỗi sản phẩm chỉ có một bản chi tiết
    },
    name: {
        type: String,
        required: true
    },
    images: {
        type: String,

    },
    // category: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Category",
    //     required: true
    // },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ["active", "disabled", "draft", "new","bestseller"],
        default: "active",
    },
    attributes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Attribute",
            required: true,
        },
    ],
    album: {
        type: [String],
        default: []
    },
    sku:{
        type: String
    },
    average_rating: {
        type: Number
    },
    sold_quantity: {
        type: Number
    }

}, {
    timestamps: true, versionKey: false
}
);

export default mongoose.model("Product", productSchema);