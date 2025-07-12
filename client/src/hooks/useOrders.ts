import { useState, useEffect } from 'react';
import { paymentAPI } from '../lib/api';
import { Order } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();

  const fetchOrders = async () => {
    if (!user || !token) return;

    try {
      // For now, we'll use mock data since there's no order fetch endpoint
      // You can implement this when the backend provides order management endpoints
      const mockOrders: Order[] = [
        {
          id: '1',
          user_id: user.id,
          total_amount: 299.99,
          status: 'delivered',
          shipping_address: '123 Main St, City, State 12345',
          order_items: [],
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-18T16:45:00Z'
        },
        {
          id: '2',
          user_id: user.id,
          total_amount: 149.99,
          status: 'shipped',
          shipping_address: '123 Main St, City, State 12345',
          order_items: [],
          created_at: '2024-01-10T14:20:00Z',
          updated_at: '2024-01-12T09:15:00Z'
        }
      ];
      
      setOrders(mockOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: {
    total_amount: number;
    shipping_address: string;
    items: { product_id: string; quantity: number; price: number }[];
  }) => {
    if (!user || !token) throw new Error('User not authenticated');

    try {
      // Create Razorpay order
      const razorpayOrderData = {
        amount: Math.round(orderData.total_amount * 100), // Convert to paise
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        notes: {
          shipping_address: orderData.shipping_address,
          items: JSON.stringify(orderData.items)
        }
      };

      const response = await paymentAPI.createRazorpayOrder(razorpayOrderData, token);
      
      if (response.success) {
        // For now, we'll add the order to local state
        // In a real app, you'd save this to the backend after payment confirmation
        const newOrder: Order = {
          id: response.order.id,
          user_id: user.id,
          total_amount: orderData.total_amount,
          status: 'pending',
          shipping_address: orderData.shipping_address,
          order_items: orderData.items.map((item, index) => ({
            id: `${response.order.id}_${index}`,
            order_id: response.order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            product: {} as any, // You'd fetch product details here
            created_at: new Date().toISOString()
          })),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
      }
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create order');
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [user, token]);

  return {
    orders,
    loading,
    error,
    createOrder,
    refetch: fetchOrders
  };
};