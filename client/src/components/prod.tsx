import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { getAllProducts } from "../lib/api"; // ✅ import API

type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  // other optional fields
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data.products);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong while fetching products");
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-8">All Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link
            key={p._id}
            to={`/admin/get-product/${p.slug}`}
            className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
          >
            <img
              src={`http://localhost:8000/api/v1/product/product-photo/${p._id}`}
              alt={p.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {p.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Products;
