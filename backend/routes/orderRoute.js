import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import multer from "multer";
import {
  createOrderController,
  getAllOrdersController,
  getOrdersController,
  updateOrderStatusController,
  verifyRazorpayPaymentController
} from "../controllers/orderController.js";

// Init express router
const router = express.Router();

// Configure multer (in-memory storage)
const storage = multer.memoryStorage(); // or use diskStorage if saving to disk
const upload = multer({ storage });

// Create order — use upload.single if uploading 1 file, upload.array for multiple
router.post("/create-order", upload.none(), createOrderController);

// Get user orders
router.get("/get-orders", getOrdersController);

router.get("/get-all-orders", getAllOrdersController);

// Razorpay routes

router.post("/razorpay/verify", upload.none(), verifyRazorpayPaymentController);

// Update order status
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  upload.none(), // if admin uploads form data, keep this
  updateOrderStatusController
);

export default router;
