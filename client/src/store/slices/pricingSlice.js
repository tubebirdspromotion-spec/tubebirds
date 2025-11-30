import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

const initialState = {
  plans: [],
  loading: false,
  error: null,
}

export const fetchPricingPlans = createAsyncThunk(
  'pricing/fetchAll',
  async (category, { rejectWithValue }) => {
    try {
      const url = category ? `/pricing?category=${category}` : '/pricing'
      const response = await api.get(url)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

const pricingSlice = createSlice({
  name: 'pricing',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPricingPlans.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPricingPlans.fulfilled, (state, action) => {
        state.loading = false
        state.plans = action.payload.data.plans
      })
      .addCase(fetchPricingPlans.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default pricingSlice.reducer
