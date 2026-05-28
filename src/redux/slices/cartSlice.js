import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/cart`;

const getAuthConfig = (getState) => {
  const { auth: { userInfo } } = getState();
  return userInfo ? {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  } : null;
};

// Helper to get guest cart from localStorage
const getLocalCart = () => {
  const local = localStorage.getItem('cartItems');
  return local ? JSON.parse(local) : [];
};

// Helper to save guest cart to localStorage
const saveLocalCart = (items) => {
  localStorage.setItem('cartItems', JSON.stringify(items));
};

export const fetchCart = createAsyncThunk('cart/fetch', async (_, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI.getState);
    if (!config) {
      return getLocalCart();
    }
    const response = await axios.get(API_URL, config);
    return response.data.items;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const addToCart = createAsyncThunk('cart/add', async ({ product, quantity }, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI.getState);
    if (!config) {
      const local = getLocalCart();
      const existItem = local.find(item => item.product._id === product._id);
      let updated;
      if (existItem) {
        updated = local.map(item =>
          item.product._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updated = [...local, { product, quantity }];
      }
      saveLocalCart(updated);
      return updated;
    }
    const cartState = thunkAPI.getState().cart;
    const existItem = cartState.cartItems.find(item => item.product._id === product._id);
    const newQty = existItem ? existItem.quantity + quantity : quantity;

    const response = await axios.post(API_URL, { productId: product._id, quantity: newQty }, config);
    return response.data.items;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateCartQty = createAsyncThunk('cart/updateQty', async ({ productId, quantity }, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI.getState);
    if (!config) {
      const local = getLocalCart();
      const updated = local.map(item =>
        item.product._id === productId ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0);
      saveLocalCart(updated);
      return updated;
    }
    const response = await axios.post(API_URL, { productId, quantity }, config);
    return response.data.items;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (productId, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI.getState);
    if (!config) {
      const local = getLocalCart();
      const updated = local.filter(item => item.product._id !== productId);
      saveLocalCart(updated);
      return updated;
    }
    const response = await axios.delete(`${API_URL}/${productId}`, config);
    return response.data.items;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI.getState);
    if (!config) {
      saveLocalCart([]);
      return [];
    }
    const response = await axios.put(`${API_URL}/clear`, {}, config);
    return response.data.items;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Thunk to merge guest cart into user cart when logging in
export const mergeCart = createAsyncThunk('cart/merge', async (_, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI.getState);
    if (!config) return getLocalCart();

    const localItems = getLocalCart();
    if (localItems.length === 0) {
      const response = await axios.get(API_URL, config);
      return response.data.items;
    }

    // Sequentially add local items to database cart
    let lastItemsResponse = [];
    for (const item of localItems) {
      const response = await axios.post(API_URL, { productId: item.product._id, quantity: item.quantity }, config);
      lastItemsResponse = response.data.items;
    }

    localStorage.removeItem('cartItems');
    return lastItemsResponse;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: getLocalCart(),
    loading: false,
    error: null,
  },
  reducers: {
    resetCart: (state) => {
      state.cartItems = [];
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };
    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.cartItems = action.payload || [];
    };

    builder
      .addCase(fetchCart.pending, handlePending)
      .addCase(fetchCart.fulfilled, handleFulfilled)
      .addCase(fetchCart.rejected, handleRejected)
      .addCase(addToCart.pending, handlePending)
      .addCase(addToCart.fulfilled, handleFulfilled)
      .addCase(addToCart.rejected, handleRejected)
      .addCase(updateCartQty.pending, handlePending)
      .addCase(updateCartQty.fulfilled, handleFulfilled)
      .addCase(updateCartQty.rejected, handleRejected)
      .addCase(removeFromCart.pending, handlePending)
      .addCase(removeFromCart.fulfilled, handleFulfilled)
      .addCase(removeFromCart.rejected, handleRejected)
      .addCase(clearCart.pending, handlePending)
      .addCase(clearCart.fulfilled, handleFulfilled)
      .addCase(clearCart.rejected, handleRejected)
      .addCase(mergeCart.pending, handlePending)
      .addCase(mergeCart.fulfilled, handleFulfilled)
      .addCase(mergeCart.rejected, handleRejected);
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
