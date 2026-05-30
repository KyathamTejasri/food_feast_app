import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import categoryReducer from './slices/categorySlice.js';
import productReducer from './slices/productSlice.js';
import cartReducer from './slices/cartSlice.js';
import wishlistReducer from './slices/wishlistSlice.js';
import orderReducer from './slices/orderSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
  },
});
