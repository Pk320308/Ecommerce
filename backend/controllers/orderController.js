import orderModel from "../models/orderModel.js";

import crypto from 'crypto';
import { razorpay } from "../config/razorpay.js";

import dotenv from "dotenv";
dotenv.config();

// Update order status
export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Order Status Updated Successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updating Order Status",
      error,
    });
  }
};

// Get all orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products.product", "-photo")
      
    
    res.status(200).send({
      success: true,
      message: "All Orders",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting All Orders",
      error,
    });
  }
};

// Get user orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      
      .populate("products", "-photo")
      
      
    res.status(200).send({
      success: true,
      message: "Your Orders",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error,
    });
  }
};

// Create order
export const createOrderController = async (req, res) => {
  try {
   const {
  total_amount,
  shipping_address, // this is snake_case
  items,
  payment_status
} = req.body;

const order = new orderModel({
  products: items.map(item => ({
    product: item.product_id,
    quantity: item.quantity,
    price: item.price
  })),
  payment: {
    status: payment_status,
    amount: total_amount
  },
  shippingAddress: shipping_address, // ⬅️ match schema field name
  totalAmount: total_amount
});


    await order.save();

    return res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("❌ Create order error:", err);
    return res.status(500).json({ success: false, error: "Server error while creating order" });
  }
};



//PAYMENT 


export const createRazorpayOrderController = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: Math.round(amount), // in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    console.log("✅ Razorpay Order Created:", order);

    res.json(order);
  } catch (error) {
    console.error("❌ Razorpay order creation error:");
    console.error("🔍 Error details:", JSON.stringify(error, null, 2));

    res.status(500).json({
      error: "Failed to create Razorpay order",
      message: error?.message || "Unknown error",
      description: error?.description || "No description",
    });
  }
};




export const verifyRazorpayPaymentController = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;


    return res.status(200).json({ success: true, message: "Payment verified" });
  } catch (err) {
    console.error("❌ Payment verification failed:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
