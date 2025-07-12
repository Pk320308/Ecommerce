import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import API_BASE_URL from "../lib/api";
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();

  interface Category {
    _id: string;
    name: string;
    // add other fields if needed
  }
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setstock] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState<File | string>("");
  const [id, setId] = useState("");
  
  // Fetch single product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/v1/product/get-product/${params.slug}`
      );
      const product = data.product;
      
      setName(product.name);
      setId(product._id);
      setDescription(product.description);
      setPrice(product.price);
      setstock(product.stock);
      setShipping(product.shipping);
      setCategory(product.category._id);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load product");
    }
  };

  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/v1/category/get-category`);
      if (data?.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    getSingleProduct();
    getAllCategory();
    // eslint-disable-next-line
  }, []);

  // Update product
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("stock", stock);
      if (photo) productData.append("photo", photo);
      productData.append("category", category);

      const { data } = await axios.put(
        `${API_BASE_URL}/api/v1/product/update-product/${id}`,
        productData
      );

      if (data?.success) {
        toast.error(data.message);
      } else {
        toast.success("Product Updated Successfully");
        navigate("/admin");
      }
    } catch (error) {
      console.log(error);
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

              {/* Category Selector */}
              <div className="mb-3">
                <label className="form-label">Category</label>
                <Select
                  bordered={true}
                  placeholder="Select a category"
                  size="large"
                  showSearch
                  className="w-100"
                  onChange={(value) => setCategory(value)}
                  value={category}
                >
                  {categories?.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Photo Upload */}
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
                          ? `${API_BASE_URL}/api/v1/product/product-photo/${id}`
                          : URL.createObjectURL(photo)
                      }
                      alt="product_photo"
                      className="img-fluid rounded shadow"
                      style={{ maxHeight: "200px" }}
                    />
                  ) : null}
                </div>
              </div>

              {/* Name */}
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

              {/* Description */}
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

              {/* stock */}
              <div className="mb-3">
                <label className="form-label">stock</label>
                <input
                  type="number"
                  value={stock}
                  placeholder="Enter stock"
                  className="form-control"
                  onChange={(e) => setstock(e.target.value)}
                  required
                />
              </div>

              {/* Shipping */}
              <div className="mb-3">
                <label className="form-label">Shipping Available</label>
                <Select
                  bordered={true}
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

              {/* Buttons */}
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