import mongoose from "mongoose";

const variantAttributeValueSchema = new mongoose.Schema({
    variant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductVariant",
        required: true,
    },
    attribute_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attribute",
        required: true,
    },
    value_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AttributeValue",
        required: true,
    },
});

export default mongoose.model("VariantAttributeValue", variantAttributeValueSchema);