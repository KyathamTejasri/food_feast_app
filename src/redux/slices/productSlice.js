import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/products`;

const getAuthConfig = (getState) => {
  const { auth: { userInfo } } = getState();
  return {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
};

export const fetchProducts = createAsyncThunk('products/fetchAll', async (queryParams = {}, thunkAPI) => {
  try {
    const { keyword = '', category = '', minPrice = '', maxPrice = '', sort = '', page = 1, limit = 8 } = queryParams;
    let url = `${API_URL}?page=${page}&limit=${limit}`;
    if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
    if (category) url += `&category=${category}`;
    if (minPrice) url += `&minPrice=${minPrice}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;
    if (sort) url += `&sort=${sort}`;
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    const message = error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    const message = error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const createProduct = createAsyncThunk('products/create', async (productData, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI.getState);
    const response = await axios.post(API_URL, productData, config);
    return response.data;
  } catch (error) {
    const message = error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, productData }, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI.getState);
    const response = await axios.put(`${API_URL}/${id}`, productData, config);
    return response.data;
  } catch (error) {
    const message = error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI.getState);
    await axios.delete(`${API_URL}/${id}`, config);
    return id;
  } catch (error) {
    const message = error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    loading: false,
    error: null,
    success: false,
    page: 1,
    pages: 1,
    totalProducts: 0,
  },
  reducers: {
    resetProductStatus: (state) => {
      state.success = false;
      state.error = null;
    },
    clearProductDetails: (state) => {
      state.product = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((prod) => prod._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProductStatus, clearProductDetails } = productSlice.actions;
export default productSlice.reducer;
