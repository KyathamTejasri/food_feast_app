import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/orders`;

const getAuthConfig = (getState) => {
  const { auth: { userInfo } } = getState();
  return userInfo ? {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  } : null;
};

// 1. Create order
export const createOrder = createAsyncThunk('order/create', async (orderData, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI.getState);
    if (!config) {
      return thunkAPI.rejectWithValue('You must be logged in to place an order');
    }
    const response = await axios.post(API_URL, orderData, config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// 2. Get order details by ID
export const getOrderDetails = createAsyncThunk('order/getDetails', async (id, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI.getState);
    if (!config) {
      return thunkAPI.rejectWithValue('You must be logged in to view order details');
    }
    const response = await axios.get(`${API_URL}/${id}`, config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// 3. Pay order
export const payOrder = createAsyncThunk('order/pay', async ({ orderId, paymentResult }, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI.getState);
    if (!config) {
      return thunkAPI.rejectWithValue('Not authorized');
    }
    const response = await axios.put(`${API_URL}/${orderId}/pay`, paymentResult || {}, config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// 4. Deliver order (Admin only)
export const deliverOrder = createAsyncThunk('order/deliver', async (orderId, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI.getState);
    if (!config) {
      return thunkAPI.rejectWithValue('Not authorized');
    }
    const response = await axios.put(`${API_URL}/${orderId}/deliver`, {}, config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// 5. List my orders
export const listMyOrders = createAsyncThunk('order/listMy', async (_, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI.getState);
    if (!config) {
      return thunkAPI.rejectWithValue('Not authorized');
    }
    const response = await axios.get(`${API_URL}/myorders`, config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// 6. List all orders (Admin only)
export const listAllOrders = createAsyncThunk('order/listAll', async (_, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI.getState);
    if (!config) {
      return thunkAPI.rejectWithValue('Not authorized');
    }
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    order: null,
    orders: [],
    loading: false,
    success: false,
    error: null,
    // Separate states to prevent state collisions during simultaneous admin/user views
    detailsLoading: false,
    detailsError: null,
    paySuccess: false,
    payLoading: false,
    deliverSuccess: false,
    deliverLoading: false,
  },
  reducers: {
    resetOrderState: (state) => {
      state.order = null;
      state.success = false;
      state.error = null;
      state.paySuccess = false;
      state.deliverSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Order Details
      .addCase(getOrderDetails.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.order = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload;
      })
      // Pay Order
      .addCase(payOrder.pending, (state) => {
        state.payLoading = true;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.payLoading = false;
        state.paySuccess = true;
        state.order = action.payload;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.payLoading = false;
        state.error = action.payload;
      })
      // Deliver Order
      .addCase(deliverOrder.pending, (state) => {
        state.deliverLoading = true;
      })
      .addCase(deliverOrder.fulfilled, (state, action) => {
        state.deliverLoading = false;
        state.deliverSuccess = true;
        state.order = action.payload;
      })
      .addCase(deliverOrder.rejected, (state, action) => {
        state.deliverLoading = false;
        state.error = action.payload;
      })
      // List My Orders
      .addCase(listMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(listMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // List All Orders
      .addCase(listAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(listAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
