import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, clearAuthError } from '../redux/slices/authSlice.js';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : '/catalog';

  useEffect(() => {
    dispatch(clearAuthError());
    if (userInfo) {
      if (userInfo.role === 'admin') {
        navigate(redirect);
      } else {
        // Prevent non-admin users from being redirected to admin routes
        const safeRedirect = redirect.startsWith('/admin') ? '/catalog' : redirect;
        navigate(safeRedirect);
      }
    }
  }, [userInfo, navigate, redirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="bg-gray-50 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to start ordering your favorite foods
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl">
            {error}
          </div>
        )}

        {/* Quick Credentials hint */}
        <div className="mb-6 p-4 bg-orange-50/50 border border-orange-100/50 rounded-2xl text-xs text-orange-800">
          <span className="font-bold">Test Admin Account:</span> admin@feast.com / adminpassword<br/>
          <span className="font-bold">Test User Account:</span> user@feast.com / userpassword
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@feast.com"
              className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-orange-500/20 hover:shadow-lg transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Signing you in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Register Redirect */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-orange-500 hover:text-orange-600">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
