import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder, resetOrderState } from '../redux/slices/orderSlice.js';
import { clearCart } from '../redux/slices/cartSlice.js';
import { MapPin, CreditCard, ShoppingBag, ArrowRight, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { order, success, error, loading } = useSelector((state) => state.order);

  // Steps: 1 = Shipping, 2 = Payment, 3 = Place Order
  const [step, setStep] = useState(1);

  // Shipping Form State
  const [shippingAddress, setShippingAddress] = useState({
    name: userInfo?.name || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('Stripe');

  // Redirection checks
  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=checkout');
    } else if (cartItems.length === 0 && !success) {
      navigate('/cart');
    }
  }, [userInfo, cartItems, navigate, success]);

  // Order success redirection
  useEffect(() => {
    if (success && order) {
      dispatch(clearCart());
      const orderId = order._id;
      dispatch(resetOrderState());
      navigate(`/order/${orderId}`);
    }
  }, [success, order, navigate, dispatch]);

  // Price Calculations
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 50 ? 0 : 5; // Free shipping over $50
  const taxPrice = parseFloat((0.08 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = () => {
    const orderItems = cartItems.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      image: item.product.image,
      price: item.product.price,
      product: item.product._id,
    }));

    dispatch(
      createOrder({
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* Progress Tracker */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-10 bg-white dark:bg-gray-900 py-4 px-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <button
            onClick={() => step > 1 && setStep(1)}
            className={`flex items-center space-x-2 font-medium text-sm transition ${
              step >= 1 ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
              step >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-800'
            }`}>
              1
            </span>
            <span>Shipping</span>
          </button>

          <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-700" />

          <button
            onClick={() => step > 2 && setStep(2)}
            disabled={step < 2}
            className={`flex items-center space-x-2 font-medium text-sm transition ${
              step >= 2 ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
              step >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-800'
            }`}>
              2
            </span>
            <span>Payment</span>
          </button>

          <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-700" />

          <div
            className={`flex items-center space-x-2 font-medium text-sm ${
              step === 3 ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
              step === 3 ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-800'
            }`}>
              3
            </span>
            <span>Place Order</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl dark:bg-red-950/20 text-red-700 dark:text-red-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2.5 bg-orange-100 dark:bg-orange-950/40 text-orange-500 rounded-xl">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shipping Address</h2>
                    <p className="text-xs text-gray-500">Where should we deliver your delicious food?</p>
                  </div>
                </div>

                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition"
                      value={shippingAddress.name}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +1 (555) 019-2834"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 123 Foodie Lane, Apt 4B"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">City</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. New York"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Postal Code</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 10001"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition"
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition duration-200"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2.5 bg-orange-100 dark:bg-orange-950/40 text-orange-500 rounded-xl">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Method</h2>
                    <p className="text-xs text-gray-500">Select your preferred payment gateway</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'Stripe', name: 'Credit / Debit Card (Stripe)', desc: 'Pay securely with your credit/debit card' },
                    { id: 'PayPal', name: 'PayPal Gateway', desc: 'Log in and checkout instantly via PayPal' },
                    { id: 'COD', name: 'Cash on Delivery', desc: 'Pay in cash when your order reaches your doorstep' },
                  ].map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`cursor-pointer border-2 rounded-2xl p-5 flex items-start gap-4 transition ${
                        paymentMethod === method.id
                          ? 'border-orange-500 bg-orange-50/20 dark:bg-orange-950/10'
                          : 'border-gray-150 dark:border-gray-850 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="mt-1 text-orange-500 focus:ring-orange-500 accent-orange-500"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-base">{method.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{method.desc}</p>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setStep(1)}
                      className="w-1/3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold py-3.5 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="w-2/3 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition duration-200"
                    >
                      <span>Review Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="p-2.5 bg-orange-100 dark:bg-orange-950/40 text-orange-500 rounded-xl">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Your Order</h2>
                    <p className="text-xs text-gray-500">Please review your delivery details and items</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery To</h4>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{shippingAddress.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{shippingAddress.address}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{shippingAddress.city}, {shippingAddress.postalCode}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">📞 {shippingAddress.phone}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Method</h4>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{paymentMethod}</p>
                      <p className="text-xs text-gray-500 mt-1">Order will be placed instantly. Payment verification on next page.</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Items</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {cartItems.map((item) => (
                        <div key={item.product._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-950 rounded-xl transition">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded-xl border border-gray-100 dark:border-gray-800"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.product.name}</h5>
                            <p className="text-xs text-gray-500">{item.quantity} x ${item.product.price.toFixed(2)}</p>
                          </div>
                          <span className="text-sm font-extrabold text-gray-950 dark:text-white">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => setStep(2)}
                    className="w-1/3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold py-3.5 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-2/3 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                    {!loading && <ShoppingBag className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side summary widget */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Summary</h3>
            <div className="space-y-3 pb-4 border-b border-gray-150 dark:border-gray-800 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white">${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Est. Tax (8%)</span>
                <span className="font-semibold text-gray-900 dark:text-white">${taxPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-gray-900 dark:text-white pt-4 font-bold text-lg">
              <span>Total Price</span>
              <span className="text-orange-500">${totalPrice.toFixed(2)}</span>
            </div>

            <div className="mt-6 text-center text-xs text-gray-400">
              ⚡ Orders are prepared instantly at Food Feast kitchen.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
