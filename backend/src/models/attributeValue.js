import mongoose from "mongoose";

const attributeValueSchema = new mongoose.Schema({
    attribute_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attribute",
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
}, { timestamps: true, versionKey: false });

export default mongoose.model("AttributeValue", attributeValueSchema);