import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  savePaidOrder,
  saveCODOrder
} from '../lib/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const shippingAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`;
  const shippingCost = totalPrice > 50 ? 0 : 9.99;
  const taxAmount = totalPrice * 0.08;
  const finalTotal = totalPrice + shippingCost + taxAmount;

  const handleRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const order = await createRazorpayOrder(finalTotal);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_JlsDJSQno3uHI3",
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const verifyData = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (!verifyData.success) {
              alert("❌ Payment verification failed");
              return;
            }

            const orderItems = items.map(item => ({
              product_id: item.product.id,
              quantity: item.quantity,
              price: item.product.price
            }));

            await savePaidOrder({
              total_amount: finalTotal,
              shipping_address: shippingAddress,
              items: orderItems
            });

            clearCart();
            navigate("/orders", { state: { orderSuccess: true } });
          } catch (err) {
            console.error("❌ Order save error:", err);
            alert("Something went wrong. Try again.");
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email
        },
        notes: {
          address: shippingAddress
        },
        theme: {
          color: "#3b82f6"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("❌ Razorpay payment error:", error);
      alert("Payment initiation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCODOrder = async () => {
    try {
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      await saveCODOrder({
        total_amount: finalTotal,
        shipping_address: shippingAddress,
        items: orderItems,
      });

      clearCart();
      navigate("/orders", { state: { orderSuccess: true } });
    } catch (error) {
      console.error(error);
      alert("Order failed. Try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Link to="/cart" className="text-blue-600 hover:text-blue-700 mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form className="space-y-6" onSubmit={handleRazorpayPayment}>
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  placeholder="Email"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="First Name" className="border rounded px-3 py-2" />
                  <input name="lastName" value={formData.lastName} onChange={handleInputChange} required placeholder="Last Name" className="border rounded px-3 py-2" />
                  <input name="address" value={formData.address} onChange={handleInputChange} required placeholder="Address" className="md:col-span-2 border rounded px-3 py-2" />
                  <input name="city" value={formData.city} onChange={handleInputChange} required placeholder="City" className="border rounded px-3 py-2" />
                  <input name="state" value={formData.state} onChange={handleInputChange} required placeholder="State" className="border rounded px-3 py-2" />
                  <input name="zipCode" value={formData.zipCode} onChange={handleInputChange} required placeholder="ZIP Code" className="md:col-span-2 border rounded px-3 py-2" />
                </div>
              </div>

              <button
                type="button"
                onClick={handleCODOrder}
                className="w-full mt-4 bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900"
              >
                Place Order with Cash on Delivery
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <Lock size={20} className="mr-2" />
                {loading ? 'Processing...' : `Pay ₹${finalTotal.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-20">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.product.id} className="flex items-center space-x-3">
                  <img src={item.product.image_url} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center text-sm text-gray-600">
                <Lock size={16} className="mr-2" />
                Your payment information is secure and encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
