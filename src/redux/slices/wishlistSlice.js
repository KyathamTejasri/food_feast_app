import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/wishlist`;

const getAuthConfig = (getState) => {
  const { auth: { userInfo } } = getState();
  return userInfo ? {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  } : null;
};

// Helper for local guest wishlist
const getLocalWishlist = () => {
  const local = localStorage.getItem('wishlistItems');
  return local ? JSON.parse(local) : [];
};

const saveLocalWishlist = (items) => {
  localStorage.setItem('wishlistItems', JSON.stringify(items));
};

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI.getState);
    if (!config) {
      return getLocalWishlist();
    }
    const response = await axios.get(API_URL, config);
    return response.data.products;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (product, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI.getState);
    if (!config) {
      const local = getLocalWishlist();
      const exist = local.find(item => item._id === product._id);
      let updated;
      if (exist) {
        updated = local.filter(item => item._id !== product._id);
      } else {
        updated = [...local, product];
      }
      saveLocalWishlist(updated);
      return updated;
    }
    const response = await axios.post(API_URL, { productId: product._id }, config);
    return response.data.products;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const mergeWishlist = createAsyncThunk('wishlist/merge', async (_, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI.getState);
    if (!config) return getLocalWishlist();

    const localItems = getLocalWishlist();
    if (localItems.length === 0) {
      const response = await axios.get(API_URL, config);
      return response.data.products;
    }

    // Toggle items that are in local but not database
    const dbResponse = await axios.get(API_URL, config);
    const dbProductIds = dbResponse.data.products.map(p => p._id);

    let lastWishlist = dbResponse.data.products;
    for (const item of localItems) {
      if (!dbProductIds.includes(item._id)) {
        const response = await axios.post(API_URL, { productId: item._id }, config);
        lastWishlist = response.data.products;
      }
    }

    localStorage.removeItem('wishlistItems');
    return lastWishlist;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlistItems: getLocalWishlist(),
    loading: false,
    error: null,
  },
  reducers: {
    resetWishlist: (state) => {
      state.wishlistItems = [];
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
      state.wishlistItems = action.payload || [];
    };

    builder
      .addCase(fetchWishlist.pending, handlePending)
      .addCase(fetchWishlist.fulfilled, handleFulfilled)
      .addCase(fetchWishlist.rejected, handleRejected)
      .addCase(toggleWishlist.pending, handlePending)
      .addCase(toggleWishlist.fulfilled, handleFulfilled)
      .addCase(toggleWishlist.rejected, handleRejected)
      .addCase(mergeWishlist.pending, handlePending)
      .addCase(mergeWishlist.fulfilled, handleFulfilled)
      .addCase(mergeWishlist.rejected, handleRejected);
  },
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
