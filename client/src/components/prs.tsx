import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { getAllCategories, createProduct } from "../lib/api"; // ✅ import from api.ts

const { Option } = Select;

type Category = {
  _id: string;
  name: string;
};

const PRS = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [featured, setFeatured] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  // Get all categories
  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      if (data?.success) {
        setCategories(data?.category);
      } else {
        toast.error("Failed to load categories");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create product
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const auth = JSON.parse(localStorage.getItem("auth") || "{}");
      const token = auth?.token;

      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("stock", stock);
      productData.append("category", category);
      productData.append("featured", featured);
      if (photo) {
        productData.append("photo", photo);
      }

      const data = await createProduct(productData, token);

      if (!data?.success) {
        toast.error(data?.message || "Product creation failed");
      } else {
        toast.success("✅ Product Created Successfully");
        navigate("/admin");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow border-0">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">Create New Product</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreate}>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <Select
                    bordered
                    placeholder="Select a category"
                    size="large"
                    className="w-100"
                    onChange={(value) => setCategory(value)}
                  >
                    {categories?.map((category) => (
                      <Option key={category._id} value={category._id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Product Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) =>
                      setPhoto(
                        e.target.files && e.target.files[0]
                          ? e.target.files[0]
                          : null
                      )
                    }
                  />
                </div>

                {photo && (
                  <div className="mb-3 text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product"
                      className="img-fluid rounded"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    value={name}
                    placeholder="Enter product name"
                    className="form-control"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    value={description}
                    placeholder="Enter description"
                    className="form-control"
                    rows={3}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    placeholder="Enter price"
                    className="form-control"
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Stock Quantity</label>
                  <input
                    type="number"
                    value={stock}
                    placeholder="Enter stock quantity"
                    className="form-control"
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Shipping Available</label>
                  <Select
                    bordered
                    placeholder="Select Shipping Option"
                    size="large"
                    className="w-100"
                    onChange={(value) => setFeatured(value)}
                  >
                    <Option value="0">No</Option>
                    <Option value="1">Yes</Option>
                  </Select>
                </div>

                <div className="text-end">
                  <button className="btn btn-success" type="submit">
                    Create Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRS;
