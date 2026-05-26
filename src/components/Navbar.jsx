import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice.js';
import { Menu, X, ShoppingCart, User, Shield, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent group-hover:from-orange-600 group-hover:to-red-700 transition duration-300">
                Food Feast
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-orange-500 font-medium transition duration-200"
            >
              Home
            </Link>
            <Link
              to="/catalog"
              className="text-gray-700 hover:text-orange-500 font-medium transition duration-200"
            >
              Menu Catalog
            </Link>

            {/* Admin Dashboard link */}
            {userInfo && userInfo.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-semibold bg-red-50 px-3.5 py-1.5 rounded-full border border-red-100 transition duration-200"
              >
                <Shield size={16} />
                Admin Panel
              </Link>
            )}

            {/* Auth / Profile */}
            {userInfo ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-700 bg-gray-50 border border-gray-200/60 px-3.5 py-1.5 rounded-full">
                  <User size={16} className="text-orange-500" />
                  <span className="font-medium text-sm">{userInfo.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-red-600 font-medium transition duration-200 cursor-pointer"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-orange-500 font-medium transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-4 py-2 rounded-full font-medium shadow-md shadow-orange-500/20 hover:bg-orange-600 hover:shadow-lg transition duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-500 hover:bg-orange-50 focus:outline-none transition duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden animate-fade-in bg-white border-b border-gray-100 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition"
            >
              Home
            </Link>
            <Link
              to="/catalog"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition"
            >
              Menu Catalog
            </Link>

            {userInfo && userInfo.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition"
              >
                <Shield size={18} />
                Admin Panel
              </Link>
            )}

            {userInfo ? (
              <div className="border-t border-gray-100 pt-4 pb-2 px-3 space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <User size={18} className="text-orange-500" />
                  <span className="font-semibold">{userInfo.name}</span>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-100 pt-4 pb-2 px-3 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-center px-4 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-orange-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block text-center bg-orange-500 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-orange-600 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
