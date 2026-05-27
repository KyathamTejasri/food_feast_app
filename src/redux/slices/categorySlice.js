import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/categories`;

const getAuthConfig = (getState) => {
  const { auth: { userInfo } } = getState();
  return {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
};

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    const message = error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const createCategory = createAsyncThunk('categories/create', async (categoryData, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI.getState);
    const response = await axios.post(API_URL, categoryData, config);
    return response.data;
  } catch (error) {
    const message = error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateCategory = createAsyncThunk('categories/update', async ({ id, categoryData }, thunkAPI) => {
  try {
    const config = getAuthConfig(thunkAPI.getState);
    const response = await axios.put(`${API_URL}/${id}`, categoryData, config);
    return response.data;
  } catch (error) {
    const message = error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteCategory = createAsyncThunk('categories/delete', async (id, thunkAPI) => {
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

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetCategoryStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
        state.success = true;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.map((cat) =>
          cat._id === action.payload._id ? action.payload : cat
        );
        state.success = true;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter((cat) => cat._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCategoryStatus } = categorySlice.actions;
export default categorySlice.reducer;
