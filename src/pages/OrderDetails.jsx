import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getOrderDetails, payOrder, deliverOrder } from '../redux/slices/orderSlice.js';
import { Check, ShieldCheck, MapPin, CreditCard, Clock, Truck, ChefHat, ExternalLink, AlertTriangle } from 'lucide-react';

export default function OrderDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { order, detailsLoading, detailsError, payLoading, paySuccess, deliverLoading, deliverSuccess } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [id, dispatch, paySuccess, deliverSuccess]);

  const handlePayOrder = () => {
    dispatch(
      payOrder({
        orderId: id,
        paymentResult: {
          id: 'simulated_stripe_' + Math.random().toString(36).substr(2, 9),
          status: 'PAID_VIA_STRIPE_SIMULATION',
          update_time: new Date().toISOString(),
          email_address: userInfo.email,
        },
      })
    );
  };

  const handleDeliverOrder = () => {
    dispatch(deliverOrder(id));
  };

  if (detailsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading your feast invoice...</p>
        </div>
      </div>
    );
  }

  if (detailsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 py-12 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Order</h3>
          <p className="text-sm text-gray-500 mb-6">{detailsError}</p>
          <Link
            to="/catalog"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-xl transition"
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Status Header */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Receipt</span>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">ID: #{order._id}</h1>
            <p className="text-xs text-gray-500 mt-0.5">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {order.isPaid ? (
              <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-xs font-bold bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                Paid
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 animate-pulse">
                <Clock className="w-3.5 h-3.5" />
                Awaiting Payment
              </span>
            )}

            {order.isDelivered ? (
              <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
                <Truck className="w-3.5 h-3.5" />
                Delivered
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-xs font-bold bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/40">
                <ChefHat className="w-3.5 h-3.5 animate-bounce" />
                Preparing
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Details Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Delivery Info */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
              <div className="flex items-center space-x-2.5 pb-3 border-b border-gray-100 dark:border-gray-800">
                <MapPin className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-gray-900 dark:text-white">Delivery Details</h3>
              </div>
              <div className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                <p><span className="font-semibold text-gray-900 dark:text-white">Recipient:</span> {order.shippingAddress.name}</p>
                <p><span className="font-semibold text-gray-900 dark:text-white">Phone:</span> {order.shippingAddress.phone}</p>
                <p><span className="font-semibold text-gray-900 dark:text-white">Address:</span> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                {order.isDelivered ? (
                  <div className="mt-3 p-3 bg-green-50/50 dark:bg-green-950/10 text-green-700 dark:text-green-400 rounded-xl text-xs font-medium">
                    Delivered on {new Date(order.deliveredAt).toLocaleString()}
                  </div>
                ) : (
                  <div className="mt-3 p-3 bg-blue-50/50 dark:bg-blue-950/10 text-blue-700 dark:text-blue-400 rounded-xl text-xs font-medium">
                    Our chef is preparing your meal. Delivery expected shortly!
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Details */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
              <div className="flex items-center space-x-2.5 pb-3 border-b border-gray-100 dark:border-gray-800">
                <CreditCard className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-gray-900 dark:text-white">Payment Method</h3>
              </div>
              <div className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                <p><span className="font-semibold text-gray-900 dark:text-white">Gateway:</span> {order.paymentMethod}</p>
                {order.isPaid ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-green-50/50 dark:bg-green-950/10 text-green-700 dark:text-green-400 rounded-xl text-xs font-medium">
                      Paid on {new Date(order.paidAt).toLocaleString()}
                    </div>
                    {order.paymentResult && (
                      <p className="text-xs text-gray-400 font-mono mt-1">Transaction Ref: {order.paymentResult.id}</p>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50/50 dark:bg-amber-950/10 text-amber-700 dark:text-amber-400 rounded-xl text-xs font-medium">
                    Payment is pending. Please finalize payment to initiate preparation.
                  </div>
                )}
              </div>
            </div>

            {/* Food Items list */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
              <div className="flex items-center space-x-2.5 pb-3 border-b border-gray-100 dark:border-gray-800">
                <ChefHat className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-gray-900 dark:text-white">Dish Selections</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-2xl border border-gray-100 dark:border-gray-850"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.quantity} x ${item.price.toFixed(2)}</p>
                    </div>
                    <span className="font-extrabold text-sm text-gray-950 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action & Invoice Totals Column */}
          <div className="space-y-6">
            
            {/* Price breakdown widget */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-base">Invoice Breakdown</h3>
              <div className="space-y-3 pb-4 border-b border-gray-100 dark:border-gray-800 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax (8%)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${order.taxPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between text-gray-900 dark:text-white pt-4 font-extrabold text-lg">
                <span>Grand Total</span>
                <span className="text-orange-500">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Simulated Payment CTAs */}
            {!order.isPaid && order.user._id === userInfo?._id && (
              <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-center space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">Simulate Payment Gateway</h4>
                  <p className="text-xs text-gray-450 mt-1">Complete your order using our instant Stripe gateway simulator.</p>
                </div>
                <button
                  onClick={handlePayOrder}
                  disabled={payLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition duration-200"
                >
                  {payLoading ? 'Verifying payment...' : 'Pay with Simulated Stripe'}
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Admin Order Delivery Dashboard Control */}
            {userInfo?.role === 'admin' && !order.isDelivered && (
              <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-center space-y-4">
                <div>
                  <h4 className="font-bold text-red-500 text-sm">Admin Control Panel</h4>
                  <p className="text-xs text-gray-450 mt-1">Manage physical fulfillment and status flags of this order.</p>
                </div>
                <button
                  onClick={handleDeliverOrder}
                  disabled={deliverLoading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition duration-200"
                >
                  {deliverLoading ? 'Processing...' : 'Mark as Delivered'}
                  <Truck className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
