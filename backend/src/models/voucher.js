import mongoose, { Schema } from "mongoose";

const voucherSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discount_type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    used_quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    min_order_value: {
      type: Number,
      required: true,
      min: 0,
    },
    max_user_number: {
      type: Number,
      required: true,
      min: 0,
    },
    usage_limit_per_user: {
      type: Number,
      default: 1,
      min: 0,
    },
    applicable_products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

export const VoucherModel = mongoose.model("Voucher", voucherSchema);