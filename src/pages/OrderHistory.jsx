import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { listMyOrders } from '../redux/slices/orderSlice.js';
import { ShoppingBag, Eye, Calendar, DollarSign, ShieldAlert, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export default function OrderHistory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      dispatch(listMyOrders());
    }
  }, [userInfo, navigate, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Fetching your order history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Failed to retrieve orders</h3>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => dispatch(listMyOrders())}
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-xl transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Order History</h1>
            <p className="text-xs text-gray-500 mt-1">Manage and track your food delivery orders</p>
          </div>
          <div className="p-3 bg-orange-50 dark:bg-orange-950/20 text-orange-500 rounded-2xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 p-12 rounded-3xl text-center shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
            <div className="w-20 h-20 bg-orange-50 dark:bg-orange-950/20 text-orange-500 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Orders Placed Yet</h3>
              <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">You haven't ordered any delicious meals from Food Feast. Let's change that!</p>
            </div>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-orange-500/20 transition"
            >
              <span>Explore Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition duration-200"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-100 dark:border-gray-800 gap-4">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</span>
                    <h3 className="font-extrabold text-gray-900 dark:text-white text-base">#{order._id}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {order.isPaid ? (
                      <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full font-bold bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/40">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                        <Clock className="w-3.5 h-3.5" />
                        Unpaid
                      </span>
                    )}

                    {order.isDelivered ? (
                      <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full font-bold bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
                        Delivered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full font-bold bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/40">
                        Preparing
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Date</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-orange-500" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Total Price</p>
                      <p className="font-extrabold text-orange-500">${order.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center gap-2">
                    <div className="flex -space-x-2 overflow-hidden py-1">
                      {order.orderItems.map((item, idx) => (
                        <img
                          key={idx}
                          src={item.image}
                          alt={item.name}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900 object-cover"
                        />
                      ))}
                    </div>
                    <div className="ml-1">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Dishes</p>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                        {order.orderItems.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-gray-100 dark:border-gray-800">
                  <Link
                    to={`/order/${order._id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-500 hover:text-orange-600 transition"
                  >
                    <span>View Details & Invoice</span>
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
