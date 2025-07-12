import  { useState, useEffect } from "react";

import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
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

  //get all category
  const getAllCategory = async () => {
    try {
  const { data } = await axios.get("http://localhost:8000/api/v1/category/get-category");
  if (data?.success) {
    setCategories(data?.category);
  }
    } catch (error) {
      console.log(error);
      toast.error("Something wwent wrong in getting catgeory");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  //create product function
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
    if (photo) {
      productData.append("photo", photo);
    }
    productData.append("category", category);

    const { data } = await axios.post(
      "http://localhost:8000/api/v1/product/create-product",
      productData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!data?.success) {
      toast.error(data?.message);
    } else {
      toast.success("Product Created Successfully");
      navigate("/admin");
    }
  } catch (error) {
    console.log(error);
    toast.error("something went wrong");
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
              {/* Category */}
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

              {/* Photo Upload */}
              <div className="mb-3">
                <label className="form-label">Product Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) =>
                    setPhoto(
                      e.target.files && e.target.files[0] ? e.target.files[0] : null
                    )
                  }
                />
              </div>

              {/* Preview Image */}
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

              {/* Name */}
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

              {/* Description */}
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

              {/* Price */}
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

              {/* Stock */}
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

              {/* Featured (Shipping) */}
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

              {/* Submit Button */}
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
}

export default PRS;