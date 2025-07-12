import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoute.js";
import cors from "cors";
import Razorpay from 'razorpay';


//configure env
dotenv.config();

//databse config
connectDB();

//rest object
const app = express();
app.use(express.urlencoded({ extended: true })); 

//middelwares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(morgan("dev"));


//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
const razorpay = new Razorpay({
  key_id:'rzp_test_JlsDJSQno3uHI3',
  key_secret: 'oQUInBakvhysx2a7WDVZqSjL',
});

app.post('/api/v1/order/razorpay/orders', async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await razorpay.orders.create({
      amount: amount ,
      currency: 'INR',
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>");
});


//PORT
const PORT = process.env.PORT || 8000;

//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});
