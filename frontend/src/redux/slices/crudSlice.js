import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api.js';

export const fetchList = createAsyncThunk('crud/fetchList', async ({ resource, page = 1, search = '' }) => {
  const { data } = await api.get(`/${resource}`, { params: { page, search } });
  return { resource, ...data };
});

export const removeItem = createAsyncThunk('crud/removeItem', async ({ resource, id }) => {
  await api.delete(`/${resource}/${id}`);
  return { resource, id };
});

const crudSlice = createSlice({
  name: 'crud',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchList.pending, (state, action) => {
        const resource = action.meta.arg.resource;
        state[resource] = { ...(state[resource] || {}), loading: true, error: '' };
      })
      .addCase(fetchList.fulfilled, (state, action) => {
        state[action.payload.resource] = {
          loading: false,
          items: action.payload.data,
          pagination: action.payload.pagination,
          error: ''
        };
      })
      .addCase(fetchList.rejected, (state, action) => {
        const resource = action.meta.arg.resource;
        state[resource] = { ...(state[resource] || {}), loading: false, error: action.error.message };
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        const collection = state[action.payload.resource];
        if (collection?.items) {
          collection.items = collection.items.filter((item) => item._id !== action.payload.id);
        }
      });
  }
});

export default crudSlice.reducer;
