import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

const preloadedState = {
  user: {
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    token: localStorage.getItem('token') || null,
    redeemableItems: [],
    pointsItems: [],
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
console.log("Info User ", preloadedState);

export default store;
