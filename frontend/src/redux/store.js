import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import crudReducer from './slices/crudSlice.js';
import dashboardReducer from './slices/dashboardSlice.js';
import { setStore } from '../services/api.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    crud: crudReducer,
    dashboard: dashboardReducer
  }
});

setStore(store);
