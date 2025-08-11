import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    description: {
        type: String,
    },
    images: {
        type: String,
    },
    status: {
        type: String,
        enum: ["active", "disabled", "new", "bestseller"],
        default: "active",
    },
    album: {
        type: [String],
        default: []
    },
    sku: {
        type: String
    },
    average_rating: {
        type: Number,
        default: 0
    },
    total_sold : {
        type: Number,
        default: 0
    }

}, {
    timestamps: true, versionKey: false
}
);

export default mongoose.model("Product", productSchema);