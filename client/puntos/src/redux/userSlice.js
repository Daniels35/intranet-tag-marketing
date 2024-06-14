import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { signInWithGoogle } from '../firebase';

export const loginUser = createAsyncThunk('user/loginUser', async (_, thunkAPI) => {
  const idToken = await signInWithGoogle();
  if (idToken) {
    try {
      const response = await axios.post('http://localhost:3027/auth/google', { idToken });
      const { token } = response.data;
      localStorage.setItem('token', token);

      const userResponse = await axios.get('http://localhost:3027/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.setItem('userInfo', JSON.stringify(userResponse.data)); // Almacena userInfo en localStorage

      return { token, userInfo: userResponse.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo'); // Elimina userInfo de localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userInfo = action.payload.userInfo;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
