// src/redux/documentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as documentService from '../services/documentService';

// Thunk para obtener la estructura completa
export const fetchDocumentStructure = createAsyncThunk(
  'documents/fetchStructure',
  async (_, { rejectWithValue }) => {
    try {
      const data = await documentService.getStructure();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const documentSlice = createSlice({
  name: 'documents',
  initialState: {
    structure: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocumentStructure.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDocumentStructure.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.structure = action.payload;
      })
      .addCase(fetchDocumentStructure.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default documentSlice.reducer;