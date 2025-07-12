import { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Product, Category } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth();

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getProducts();
      
      if (response.success) {
        // Transform backend data to frontend format
        const transformedProducts = response.products.map((product: any) => ({
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          image_url: productAPI.getProductPhoto(product._id),
          category_id: product.category?._id || null,
          category: product.category ? {
            id: product.category._id,
            name: product.category.name,
            description: product.category.description,
            image_url: null,
            created_at: product.category.createdAt,
            updated_at: product.category.updatedAt
          } : null,
          stock: product.stock || 0,
          featured: product.shipping || true,
          created_at: product.createdAt,
          updated_at: product.updatedAt
        }));
        
        setProducts(transformedProducts);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      
      if (response.success) {
        // Transform backend data to frontend format
        const transformedCategories = response.category.map((category: any) => ({
          id: category._id,
          name: category.name,
          description: category.description || null,
          image_url: null, // Backend doesn't seem to have category images
          created_at: category.createdAt,
          updated_at: category.updatedAt
        }));
        
        setCategories(transformedCategories);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    }
  };

 const addProduct = async (form: FormData) => {
  if (!user?.is_admin) throw new Error('Admin access required to add products');
  if (!token) throw new Error('Authentication required');

  try {
    const response = await productAPI.createProduct(form, token);
    console.log("📦 createProduct response:", response);

    if (response.success && response.product) {
      await fetchProducts();
      return response.product;
    } else {
      throw new Error("Invalid product creation response");
    }
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to add product');
  }
};


 const updateProduct = async (id: string, form: FormData) => {
  if (!user?.is_admin) throw new Error('Admin access required to update products');
  if (!token) throw new Error('Authentication required');

  try {
    const response = await productAPI.updateProduct(id, form, token);
    console.log("🛠️ updateProduct response:", response);

    if (response.success) {
      await fetchProducts();
    } else {
      throw new Error("Update failed");
    }
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to update product');
  }
};


  const deleteProduct = async (id: string) => {
    // Check if user is admin
    if (!user?.is_admin) {
      throw new Error('Admin access required to delete products');
    }
    
    if (!token) throw new Error('Authentication required');

    try {
      const response = await productAPI.deleteProduct(id, token);
      
      if (response.success) {
        await fetchProducts(); // Refresh the list
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const addCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    // Check if user is admin
    if (!user?.is_admin) {
      throw new Error('Admin access required to add categories');
    }
    
    if (!token) throw new Error('Authentication required');

    try {
      const formData = new FormData();
      formData.append('name', category.name);
      
      if (category.description) {
        formData.append('description', category.description);
      }

      const response = await categoryAPI.createCategory(formData, token);
      
      if (response.success) {
        await fetchCategories(); // Refresh the list
        return response.category;
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add category');
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    // Check if user is admin
    if (!user?.is_admin) {
      throw new Error('Admin access required to update categories');
    }
    
    if (!token) throw new Error('Authentication required');

    try {
      const formData = new FormData();
      
      if (updates.name) formData.append('name', updates.name);
      if (updates.description) formData.append('description', updates.description);

      const response = await categoryAPI.updateCategory(id, formData, token);
      
      if (response.success) {
        await fetchCategories(); // Refresh the list
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update category');
    }
  };

  const deleteCategory = async (id: string) => {
    // Check if user is admin
    if (!user?.is_admin) {
      throw new Error('Admin access required to delete categories');
    }
    
    if (!token) throw new Error('Authentication required');

    try {
      const response = await categoryAPI.deleteCategory(id, token);
      
      if (response.success) {
        await fetchCategories(); // Refresh the list
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    products,
    categories,
    loading,
    error,
    // Only return admin functions if user is admin
    addProduct: user?.is_admin ? addProduct : undefined,
    updateProduct: user?.is_admin ? updateProduct : undefined,
    deleteProduct: user?.is_admin ? deleteProduct : undefined,
    addCategory: user?.is_admin ? addCategory : undefined,
    updateCategory: user?.is_admin ? updateCategory : undefined,
    deleteCategory: user?.is_admin ? deleteCategory : undefined,
    refetch: () => Promise.all([fetchProducts(), fetchCategories()])
  };
};