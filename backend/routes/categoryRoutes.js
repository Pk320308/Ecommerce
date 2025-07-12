import express from "express";
import multer from "multer";
import {
  categoryControlller,
  createCategoryController,
  deleteCategoryCOntroller,
  singleCategoryController,
  updateCategoryController,
} from "../controllers/categoryController.js";

// Initialize router
const router = express.Router();

// Initialize multer middleware (for parsing FormData fields)
const upload = multer();

// Routes

// ✅ Create new category (accepts FormData fields like name, description, image_url)
router.post("/create-category", upload.none(), createCategoryController);

// ✅ Update category (also uses FormData fields)
router.put("/update-category/:id", upload.none(), updateCategoryController);

// ✅ Get all categories
router.get("/get-category", categoryControlller);

// ✅ Get single category by slug
router.get("/single-category/:slug", singleCategoryController);

// ✅ Delete category by ID
router.delete("/delete-category/:id", deleteCategoryCOntroller);

// Export router
export default router;
