import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: {},
      required: true,
    },
    answer: {
      type: String,
      // required: true,
    },
    role: {
      type: Boolean,
      default: 0,  //ROLE 0 ADMIN AND ROLE 1USER
    },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
