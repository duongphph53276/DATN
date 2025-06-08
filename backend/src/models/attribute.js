import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema({
    attribute_id: {
        type: Number,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    display_name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["text", "boolean", "number", "select"],
        default: "text",
    },
}, { timestamps: true, versionKey: false });


export default mongoose.model("Attribute", attributeSchema);

const attributeValueSchema = new mongoose.Schema({
    value_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attribute",
        required: true,
    },
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

export const AttributeValueModel = mongoose.model("AttributeValue", attributeValueSchema);

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

export const VariantAttributeValue = mongoose.model("VariantAttributeValue", variantAttributeValueSchema);
