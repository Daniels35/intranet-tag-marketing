import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

const preloadedState = {
  user: {
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  },
};

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState,
});

export default store;
