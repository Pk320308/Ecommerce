const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// let API_BASE_URL ="/"
export default API_BASE_URL;
// Auth API calls
export const authAPI = {
 register: async ({
  name,
  email,
  password,
  phone,
  address,
  answer,
}: {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  answer: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
      phone,
      address,
      answer,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
},

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  forgotPassword: async (phone: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password reset failed');
    }

    return response.json();
  }
};

// Product API calls
export const productAPI = {
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/product/get-product`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return response.json();
  },

  getProduct: async (slug: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/product/get-product/${slug}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    return response.json();
  },

  createProduct: async (productData: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/product/create-product`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: productData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create product');
    }

    return response.json();
  },

  updateProduct: async (pid: string, productData: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/product/update-product/${pid}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: productData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update product');
    }

    return response.json();
  },

  deleteProduct: async (pid: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/product/delete-product/${pid}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete product');
    }

    return response.json();
  },

  getProductPhoto: (pid: string) => {
    return `${API_BASE_URL}/api/v1/product/product-photo/${pid}`;
  }
};

// Category API calls
export const categoryAPI = {
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/category/get-category`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    return response.json();
  },

  createCategory: async (categoryData: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/category/create-category`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: categoryData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create category');
    }

    return response.json();
  },

  updateCategory: async (id: string, categoryData: FormData, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/category/update-category/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: categoryData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update category');
    }

    return response.json();
  },

  deleteCategory: async (id: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/category/delete-category/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete category');
    }

    return response.json();
  }
};

// Payment API calls
export const paymentAPI = {
  createRazorpayOrder: async (orderData: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/order/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment order');
    }

    return response.json();
  }
};