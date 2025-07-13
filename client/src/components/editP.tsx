import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  getuAllCategories,
  getSingleProduct,
  updateProduct,
} from "../lib/api"; // ✅ API functions imported

const { Option } = Select;

interface Category {
  _id: string;
  name: string;
}

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState<File | string>("");
  const [id, setId] = useState("");

  useEffect(() => {
    fetchProduct();
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const fetchProduct = async () => {
    try {
      const data = await getSingleProduct(params.slug || "");
      const product = data.product;

      setName(product.name);
      setId(product._id);
      setDescription(product.description);
      setPrice(product.price);
      setStock(product.stock);
      setShipping(product.shipping?.toString());
      setCategory(product.category?._id || "");
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product");
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getuAllCategories();
      if (data.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("stock", stock);
      productData.append("shipping", shipping);
      productData.append("category", category);
      if (photo && typeof photo !== "string") {
        productData.append("photo", photo);
      }

      const data = await updateProduct(id, productData);

      if (data.success) {
        toast.success("✅ Product Updated Successfully");
        navigate("/admin");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Update Product</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <Select
                    bordered
                    placeholder="Select a category"
                    size="large"
                    showSearch
                    className="w-100"
                    onChange={(value) => setCategory(value)}
                    value={category}
                  >
                    {categories.map((c) => (
                      <Option key={c._id} value={c._id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Product Photo</label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setPhoto(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="mt-3">
                    {photo ? (
                      <img
                        src={
                          typeof photo === "string"
                            ? `http://localhost:8000/api/v1/product/product-photo/${id}`
                            : URL.createObjectURL(photo)
                        }
                        alt="product_photo"
                        className="img-fluid rounded shadow"
                        style={{ maxHeight: "200px" }}
                      />
                    ) : null}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Product Name</label>
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
                    placeholder="Enter product description"
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
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    value={stock}
                    placeholder="Enter stock"
                    className="form-control"
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Shipping Available</label>
                  <Select
                    bordered
                    placeholder="Select Shipping"
                    size="large"
                    className="w-100"
                    onChange={(value) => setShipping(value)}
                    value={shipping}
                  >
                    <Option value="1">Yes</Option>
                    <Option value="0">No</Option>
                  </Select>
                </div>

                <div className="d-flex justify-content-between">
                  <button className="btn btn-success" type="submit">
                    Update Product
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

export default UpdateProduct;
