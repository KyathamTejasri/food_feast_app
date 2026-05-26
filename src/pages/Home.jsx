import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../redux/slices/categorySlice.js';
import { ArrowRight, Star, Clock, Heart, Award } from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-24 md:py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop&q=80')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center h-full">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-orange-500/35 mb-6 animate-pulse">
              <Star size={12} fill="currentColor" />
              Top Rated Food Delivery Service
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none mb-6">
              Savor the Art of <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Fine Dining</span> at Home
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              Explore culinary masterpieces crafted by master chefs, delivered fresh and hot to your doorstep.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/catalog"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-full shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-600/30 transition duration-200 flex items-center gap-2 cursor-pointer"
              >
                Explore Menu
                <ArrowRight size={18} />
              </Link>
              <a
                href="#features"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-3.5 px-8 rounded-full backdrop-blur-sm transition duration-200"
              >
                Why Choose Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories section */}
      <section className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Popular Categories</h2>
            <p className="text-gray-500 mt-2">Discover what our community is craving today.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-2xl h-44 animate-pulse border border-gray-100"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((cat) => (
                <Link
                  key={cat._id}
                  to={`/catalog?category=${cat._id}`}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 text-center flex flex-col items-center cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 mb-4 border border-gray-100">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-orange-500 transition duration-200">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{cat.description}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Food Feast is Premium</h2>
            <p className="text-gray-500 mt-2">We raise the bar on food ordering and preparation quality.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-gray-50/50 p-8 rounded-2xl border border-gray-100/50 text-center">
              <div className="mx-auto w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-6">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Super-fast Delivery</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Your meals are cooked fresh and dispatched instantly to ensure it arrives piping hot.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50/50 p-8 rounded-2xl border border-gray-100/50 text-center">
              <div className="mx-auto w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-6">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fresh Ingredients</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We partner with select local farms to guarantee 100% organic and fresh meats and vegetables.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50/50 p-8 rounded-2xl border border-gray-100/50 text-center">
              <div className="mx-auto w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-6">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Award Winning Chefs</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Our kitchen boasts master chefs with years of expertise crafting gourmet flavor blends.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
