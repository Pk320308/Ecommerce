const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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

updateProduct: async (
  id: string,
  productData: FormData
) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/product/update-product/${id}`, {
    method: "PUT",
    body: productData,
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
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


// Create Razorpay Order
export const createRazorpayOrder = async (amount: number) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/order/razorpay/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amount * 100 }) // amount in paise
  });

  if (!res.ok) throw new Error('❌ Failed to create Razorpay order');
  return res.json();
};

// Verify Razorpay Payment
export const verifyRazorpayPayment = async (paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/order/razorpay/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData)
  });

  if (!res.ok) throw new Error('❌ Payment verification failed');
  return res.json();
};

// Save paid order after Razorpay success
export const savePaidOrder = async ({
  total_amount,
  shipping_address,
  items,
}: {
  total_amount: number;
  shipping_address: string;
  items: { product_id: string; quantity: number; price: number }[];
}) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/order/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      total_amount,
      shipping_address,
      items,
      payment_status: 'Paid',
    }),
  });

  if (!res.ok) throw new Error('❌ Order saving failed');
  return res.json();
};

// Save Cash on Delivery order
export const saveCODOrder = async ({
  total_amount,
  shipping_address,
  items,
}: {
  total_amount: number;
  shipping_address: string;
  items: { product_id: string; quantity: number; price: number }[];
}) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/order/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      total_amount,
      shipping_address,
      items,
      payment_status: 'Pending',
    }),
  });

  if (!res.ok) throw new Error('❌ COD order failed');
  return res.json();
};
export const getAllCategories = async () => {
  const res = await fetch(`${API_BASE_URL}/api/v1/category/get-category`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

// Create new product
export const createProduct = async (
  formData: FormData,
  token: string
) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/product/create-product`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Product creation failed");
  return res.json();
};
export const getSingleProduct = async (slug: string) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/product/get-product/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};

// Get all categories
export const getuAllCategories = async () => {
  const res = await fetch(`${API_BASE_URL}/api/v1/category/get-category`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

// Update product
export const updateProduct = async (
  id: string,
  productData: FormData
) => {
  const res = await fetch(`${API_BASE_URL}/api/v1/product/update-product/${id}`, {
    method: "PUT",
    body: productData,
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
};
// ✅ Get all products
export const getAllProducts = async () => {
  const res = await fetch(`${API_BASE_URL}/api/v1/product/get-product`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};