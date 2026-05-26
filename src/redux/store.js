import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import categoryReducer from './slices/categorySlice.js';
import productReducer from './slices/productSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
  },
});
