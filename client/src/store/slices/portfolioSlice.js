import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

const initialState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchAll',
  async (type, { rejectWithValue }) => {
    try {
      const url = type ? `/portfolio?type=${type}` : '/portfolio'
      const response = await api.get(url)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.data.items
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default portfolioSlice.reducer
