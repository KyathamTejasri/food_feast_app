import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice.js';
import { fetchCategories } from '../redux/slices/categorySlice.js';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Loader2, ArrowUpDown, Tag, Info } from 'lucide-react';

const Catalog = () => {
  const dispatch = useDispatch();

  // Redux state
  const { products, loading, page, pages, totalProducts } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);

  // Filters state
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  // Load categories and initial products
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch products whenever filters or page changes
  useEffect(() => {
    dispatch(
      fetchProducts({
        keyword,
        category: selectedCategory,
        minPrice,
        maxPrice,
        sort,
        page: currentPage,
        limit: 8,
      })
    );
  }, [dispatch, selectedCategory, sort, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(
      fetchProducts({
        keyword,
        category: selectedCategory,
        minPrice,
        maxPrice,
        sort,
        page: 1,
        limit: 8,
      })
    );
  };

  const handlePriceFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(
      fetchProducts({
        keyword,
        category: selectedCategory,
        minPrice,
        maxPrice,
        sort,
        page: 1,
        limit: 8,
      })
    );
  };

  const handleClearFilters = () => {
    setKeyword('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setCurrentPage(1);
    dispatch(
      fetchProducts({
        keyword: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        sort: 'newest',
        page: 1,
        limit: 8,
      })
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Our Delicious Menu</h1>
            <p className="mt-2 text-sm text-gray-500">Explore and filter our premium selection of food items.</p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:max-w-md">
            <div className="relative flex-grow">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search food, desserts, drinks..."
                className="w-full bg-white text-gray-900 border border-gray-200 rounded-full py-2.5 pl-10 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition duration-200"
              />
              <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
            </div>
            <button
              type="submit"
              className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-semibold shadow-md hover:bg-orange-600 transition duration-200 cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <span className="font-bold text-gray-900 flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-orange-500" />
                Filters
              </span>
              <button
                onClick={handleClearFilters}
                className="text-xs font-semibold text-orange-500 hover:text-orange-600 cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-1.5">
                <Tag size={15} className="text-gray-400" />
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                    selectedCategory === ''
                      ? 'bg-orange-50 text-orange-600 font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Items
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => {
                      setSelectedCategory(cat._id);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                      selectedCategory === cat._id
                        ? 'bg-orange-50 text-orange-600 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-1.5">
                Price Range ($)
              </h3>
              <form onSubmit={handlePriceFilterSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-sm focus:ring-1 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-lg text-sm font-semibold transition cursor-pointer"
                >
                  Apply Price
                </button>
              </form>
            </div>
          </div>

          {/* Catalog Main Products Section */}
          <div className="lg:col-span-3">
            
            {/* Top Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <span className="text-sm font-medium text-gray-600">
                Showing <strong className="text-gray-900">{totalProducts}</strong> products
              </span>

              {/* Sorting */}
              <div className="flex items-center gap-2">
                <ArrowUpDown size={15} className="text-gray-400" />
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-sm text-gray-700 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="newest">Newest Added</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <Loader2 className="animate-spin text-orange-500 mb-3" size={40} />
                <span className="text-gray-500 font-medium">Fetching deliciouness...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm text-center px-4">
                <Info size={40} className="text-gray-400 mb-3" />
                <span className="text-gray-900 font-bold text-lg mb-1">No products found</span>
                <span className="text-gray-500 text-sm max-w-xs">We couldn't find any products matching your filters. Try clearing them!</span>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                    >
                      {/* Image container */}
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
                        {/* Out of Stock overlay */}
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="text-white font-bold tracking-wide uppercase text-sm border-2 border-white px-3 py-1 rounded">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Content */}
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
                            ${product.price.toFixed(2)}
                          </span>
                          <Link
                            to={`/product/${product._id}`}
                            className="bg-gray-100 text-gray-800 hover:bg-orange-500 hover:text-white px-4.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {pages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                      Previous
                    </button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                          currentPage === p
                            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                            : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      disabled={currentPage === pages}
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pages))}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Catalog;
