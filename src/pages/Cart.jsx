import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from 'lucide-react';
import { fetchCart, updateCartQty, removeFromCart, clearCart } from '../redux/slices/cartSlice.js';
import {useNavigate} from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQtyChange = (productId, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty > 0) {
      dispatch(updateCartQty({ productId, quantity: newQty }));
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const deliveryCharge = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const tax = subtotal * 0.05; // 5% GST
  const grandTotal = subtotal + deliveryCharge + tax;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="bg-orange-50 p-4 rounded-full text-orange-500 mb-6">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 max-w-sm mb-8">
            Looks like you haven't added anything to your cart yet. Let's find something delicious!
          </p>
          <Link
            to="/catalog"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full shadow-md shadow-orange-500/20 hover:shadow-lg transition duration-200"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Your Feast Cart</h1>
            <p className="text-sm text-gray-500 mt-1">Review and manage your selected food items.</p>
          </div>
          <button
            onClick={handleClear}
            className="text-sm font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full transition cursor-pointer"
          >
            Clear Cart
          </button>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              if (!item.product) return null;
              return (
                <div
                  key={item.product._id}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-md transition duration-200"
                >
                  {/* Info */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-xl object-cover bg-gray-50 flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-gray-950 text-base sm:text-lg line-clamp-1">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{item.product.category?.name || 'Food'}</p>
                      <span className="text-sm font-bold text-orange-500 block mt-1">
                        ₹{item.product.price.toFixed(2)} each
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                    {/* Qty Selector */}
                    <div className="flex items-center border border-gray-200 rounded-full py-1 px-3 bg-gray-50">
                      <button
                        onClick={() => handleQtyChange(item.product._id, item.quantity, -1)}
                        className="p-1 text-gray-500 hover:text-orange-500 transition cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQtyChange(item.product._id, item.quantity, 1)}
                        className="p-1 text-gray-500 hover:text-orange-500 transition cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Total Price */}
                    <span className="font-extrabold text-gray-950 text-base sm:text-lg min-w-[80px] text-right">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </span>

                    {/* Delete */}
                    <button
                      onClick={() => handleRemove(item.product._id)}
                      className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}

            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-bold mt-4 transition"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>

          {/* Checkout Summary Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-gray-950 mb-6">Bill Details</h2>
              
              <div className="space-y-4 text-sm mb-6 border-b border-gray-100 pb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-950">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (5%)</span>
                  <span className="font-semibold text-gray-950">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Partner Fee</span>
                  <span className="font-semibold text-gray-950">
                    {deliveryCharge === 0 ? (
                      <span className="text-green-500 font-bold">FREE</span>
                    ) : (
                      `₹${deliveryCharge.toFixed(2)}`
                    )}
                  </span>
                </div>
                {deliveryCharge > 0 && (
                  <p className="text-xs text-orange-500 bg-orange-50 p-2 rounded-lg">
                    💡 Add ₹{Math.max(500 - subtotal, 0).toFixed(2)} more for Free Delivery!
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-base font-bold text-gray-950">To Pay</span>
                <span className="text-2xl font-extrabold text-orange-500">₹{grandTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-md shadow-orange-500/20 hover:shadow-lg transition duration-200 cursor-pointer"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;
