import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  resetProductStatus,
} from '../redux/slices/productSlice.js';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  resetCategoryStatus,
} from '../redux/slices/categorySlice.js';
import { Loader2, Plus, Edit2, Trash2, Shield, LayoutGrid, Pizza, Layers, Check, X } from 'lucide-react';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { products, loading: productsLoading, success: productSuccess, error: productError } = useSelector((state) => state.product);
  const { categories, loading: categoriesLoading, success: categorySuccess, error: categoryError } = useSelector((state) => state.category);

  // Guard routing
  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/login?redirect=/admin');
    }
  }, [userInfo, navigate]);

  // Tabs: 'products' | 'categories'
  const [activeTab, setActiveTab] = useState('products');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('product'); // 'product' | 'category'
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form States
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    isFeatured: false,
    inStock: true,
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: '',
  });

  // Fetch initial data
  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 })); // load all for admin table
    dispatch(fetchCategories());
  }, [dispatch]);

  // Success listener to close modal and reset statuses
  useEffect(() => {
    if (productSuccess) {
      setIsModalOpen(false);
      resetForms();
      dispatch(fetchProducts({ limit: 100 }));
      dispatch(resetProductStatus());
    }
    if (categorySuccess) {
      setIsModalOpen(false);
      resetForms();
      dispatch(fetchCategories());
      dispatch(resetCategoryStatus());
    }
  }, [productSuccess, categorySuccess, dispatch]);

  const resetForms = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
      isFeatured: false,
      inStock: true,
    });
    setCategoryForm({
      name: '',
      description: '',
      image: '',
    });
    setEditMode(false);
    setEditId(null);
  };

  const handleOpenAddModal = (type) => {
    resetForms();
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleOpenEditProductModal = (prod) => {
    setModalType('product');
    setEditMode(true);
    setEditId(prod._id);
    setProductForm({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      image: prod.image,
      category: prod.category?._id || '',
      isFeatured: prod.isFeatured || false,
      inStock: prod.inStock !== undefined ? prod.inStock : true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditCategoryModal = (cat) => {
    setModalType('category');
    setEditMode(true);
    setEditId(cat._id);
    setCategoryForm({
      name: cat.name,
      description: cat.description,
      image: cat.image,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category? (All products inside this category will still exist but will lose category relationship)')) {
      dispatch(deleteCategory(id));
    }
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      dispatch(updateProduct({ id: editId, productData: productForm }));
    } else {
      dispatch(createProduct(productForm));
    }
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      dispatch(updateCategory({ id: editId, categoryData: categoryForm }));
    } else {
      dispatch(createCategory(categoryForm));
    }
  };

  if (!userInfo || userInfo.role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="animate-spin text-orange-500" size={30} />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 p-2.5 rounded-2xl border border-red-100 text-red-600">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your catalog menus and categories.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleOpenAddModal('category')}
              className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-sm"
            >
              <Plus size={16} />
              Add Category
            </button>
            <button
              onClick={() => handleOpenAddModal('product')}
              className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-orange-500/10 hover:bg-orange-600 flex items-center gap-2 cursor-pointer text-sm"
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>
        </div>

        {/* Errors */}
        {(productError || categoryError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl">
            {productError || categoryError}
          </div>
        )}

        {/* Tabs Bar */}
        <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
              activeTab === 'products'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/10'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Pizza size={16} />
            Manage Products
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/10'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Layers size={16} />
            Manage Categories
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'products' ? (
          /* Products Table */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {productsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-orange-500" size={36} />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No products found. Add some above!</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                      <th className="py-4 px-6">Image</th>
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Price</th>
                      <th className="py-4 px-6">Featured</th>
                      <th className="py-4 px-6">Stock</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                    {products.map((prod) => (
                      <tr key={prod._id} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 px-6">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-100 bg-gray-50"
                          />
                        </td>
                        <td className="py-4 px-6 font-bold text-gray-900">{prod.name}</td>
                        <td className="py-4 px-6">
                          <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full font-medium">
                            {prod.category?.name || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-extrabold text-gray-900">${prod.price.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          {prod.isFeatured ? (
                            <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-md text-xs font-semibold">Yes</span>
                          ) : (
                            <span className="text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md text-xs">No</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {prod.inStock ? (
                            <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-md text-xs font-semibold">In Stock</span>
                          ) : (
                            <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded-md text-xs font-semibold">Out of Stock</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleOpenEditProductModal(prod)}
                              className="text-blue-500 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod._id)}
                              className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* Categories Table */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-orange-500" size={36} />
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No categories found. Add some above!</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                      <th className="py-4 px-6">Image</th>
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">Description</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                    {categories.map((cat) => (
                      <tr key={cat._id} className="hover:bg-gray-50/50 transition">
                        <td className="py-4 px-6">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-100 bg-gray-50"
                          />
                        </td>
                        <td className="py-4 px-6 font-bold text-gray-900">{cat.name}</td>
                        <td className="py-4 px-6 text-gray-500 max-w-sm truncate">{cat.description}</td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleOpenEditCategoryModal(cat)}
                              className="text-blue-500 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat._id)}
                              className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Modal Dialog */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full border border-gray-100 shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-extrabold text-gray-900 text-lg">
                  {editMode ? 'Edit' : 'Add New'} {modalType === 'product' ? 'Product' : 'Category'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              {modalType === 'product' ? (
                /* Product Form */
                <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Product Name</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. Garlic Bread"
                      className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:border-orange-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        placeholder="e.g. 5.99"
                        className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:border-orange-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Category</label>
                      <select
                        required
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:border-orange-500 text-sm"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
                    <textarea
                      required
                      rows="3"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="e.g. Toast topped with garlic butter and herbs..."
                      className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:border-orange-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Image URL</label>
                    <input
                      type="url"
                      required
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      placeholder="e.g. https://images.unsplash.com/..."
                      className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:border-orange-500 text-sm"
                    />
                  </div>

                  <div className="flex gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.isFeatured}
                        onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                        className="rounded text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm font-semibold text-gray-700">Featured Product</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.inStock}
                        onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                        className="rounded text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm font-semibold text-gray-700">In Stock</span>
                    </label>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-orange-500 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition cursor-pointer"
                    >
                      Save Product
                    </button>
                  </div>
                </form>
              ) : (
                /* Category Form */
                <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Category Name</label>
                    <input
                      type="text"
                      required
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      placeholder="e.g. Side Dishes"
                      className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:border-orange-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
                    <textarea
                      required
                      rows="3"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      placeholder="e.g. Warm sides and complementary snack items..."
                      className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:border-orange-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Image URL</label>
                    <input
                      type="url"
                      required
                      value={categoryForm.image}
                      onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                      placeholder="e.g. https://images.unsplash.com/..."
                      className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:border-orange-500 text-sm"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-orange-500 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition cursor-pointer"
                    >
                      Save Category
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
