import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
  description: {
    type: String,
    default: "",
  },
  image_url: {
    type: String,
    default: "",
  },
});

export default mongoose.model("Category", categorySchema);
