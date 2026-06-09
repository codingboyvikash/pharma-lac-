import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api.js';

export const fetchDashboard = createAsyncThunk('dashboard/fetch', async () => {
  const { data } = await api.get('/dashboard');
  return data;
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: { stats: {}, activities: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.activities = action.payload.activities;
      })
      .addCase(fetchDashboard.rejected, (state) => {
        state.loading = false;
      });
  }
});

export default dashboardSlice.reducer;
