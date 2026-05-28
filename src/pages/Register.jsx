import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register, clearAuthError } from '../redux/slices/authSlice.js';
import { Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : '/catalog';

  useEffect(() => {
    dispatch(clearAuthError());
    if (userInfo) {
      // Prevent non-admin users from being redirected to admin routes
      const safeRedirect = (userInfo.role !== 'admin' && redirect.startsWith('/admin')) ? '/catalog' : redirect;
      navigate(safeRedirect);
    }
  }, [userInfo, navigate, redirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    dispatch(register({ name, email, password }));
  };

  return (
    <div className="bg-gray-50 min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign up to explore and order food items instantly
          </p>
        </div>

        {/* Errors */}
        {(validationError || error) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl">
            {validationError || error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
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

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                Creating your account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Redirect */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-orange-500 hover:text-orange-600">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
