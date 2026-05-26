import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductById, clearProductDetails } from '../redux/slices/productSlice.js';
import { Loader2, ArrowLeft, Plus, Minus, ShoppingBag, Heart } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, loading, error } = useSelector((state) => state.product);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);

  const handleDecreaseQty = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleIncreaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    // Phase 4 cart addition placeholder
    alert(`Phase 4 Integration: Added ${quantity} ${product.name} to cart!`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="animate-spin text-orange-500 mb-3" size={40} />
        <span className="text-gray-500 font-medium">Preparing your feast details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl inline-block mb-6">
          {error}
        </div>
        <div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-full transition"
          >
            <ArrowLeft size={18} />
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-500 font-semibold mb-8 transition cursor-pointer"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>

        {/* Product Layout */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 p-6 md:p-10">
          
          {/* Product Image */}
          <div className="relative aspect-video md:aspect-square bg-gray-50 rounded-2xl overflow-hidden shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-bold tracking-wide uppercase text-sm border-2 border-white px-3 py-1 rounded">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Product Details Content */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category Badge & Stock */}
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1 rounded-full border border-orange-100">
                  {product.category?.name || 'Food'}
                </span>
                {product.inStock ? (
                  <span className="text-green-600 text-xs font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                    Available Now
                  </span>
                ) : (
                  <span className="text-red-500 text-xs font-semibold">
                    Currently Unavailable
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                {product.name}
              </h1>
              <p className="text-gray-600 leading-relaxed text-base mb-6">
                {product.description}
              </p>

              {/* Price */}
              <div className="border-t border-b border-gray-100 py-4 mb-6">
                <span className="text-3xl font-extrabold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions Section */}
            {product.inStock && (
              <div className="space-y-4">
                {/* Quantity selector */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-500">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-full py-1.5 px-3 bg-gray-50">
                    <button
                      onClick={handleDecreaseQty}
                      className="p-1 text-gray-500 hover:text-orange-500 transition cursor-pointer"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-gray-800">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncreaseQty}
                      className="p-1 text-gray-500 hover:text-orange-500 transition cursor-pointer"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Add to Cart & Wishlist */}
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-grow flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-full shadow-md shadow-orange-500/20 hover:shadow-lg transition cursor-pointer"
                  >
                    <ShoppingBag size={18} />
                    Add to Cart
                  </button>
                  <button className="border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-400 hover:text-red-500 p-3.5 rounded-full transition cursor-pointer">
                    <Heart size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
