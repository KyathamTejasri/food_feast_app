import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { fetchWishlist, toggleWishlist } from '../redux/slices/wishlistSlice.js';
import { addToCart } from '../redux/slices/cartSlice.js';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlistItems, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (product) => {
    dispatch(toggleWishlist(product));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    alert(`Added 1 ${product.name} to Cart!`);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
          <div className="bg-red-50 p-4 rounded-full text-red-500 mb-6">
            <Heart size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
          <p className="text-gray-500 max-w-sm mb-8">
            Start saving your favorite meals and treats here to order them later.
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
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            Your Wishlist
            <Heart size={28} className="text-red-500 fill-red-500" />
          </h1>
          <p className="text-sm text-gray-500 mt-1">Easily reorder or manage your favored culinary choices.</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => {
            if (!product) return null;
            return (
              <div
                key={product._id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    {product.category?.name || 'Food'}
                  </span>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(product)}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white text-red-500 p-2 rounded-full shadow-sm transition cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-orange-500 transition duration-200 text-lg line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xl font-extrabold text-gray-900">
                      ₹{product.price.toFixed(2)}
                    </span>
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-orange-500 hover:bg-orange-600 text-white p-2 px-4 rounded-full flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 cursor-pointer"
                    >
                      <ShoppingCart size={15} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Wishlist;
