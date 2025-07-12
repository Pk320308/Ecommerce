import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Products", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }
]
,
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
      // required: true,
    },
    payment: {
      type: Object,
      default: {},
    },
    
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "paid",
    },
    status: {
      type: String,
      enum: [ "Processing", "Shipped", "Delivered", "Cancel"],
      default: "Processing",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
