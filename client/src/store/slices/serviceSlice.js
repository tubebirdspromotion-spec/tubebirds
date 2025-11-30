import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

const initialState = {
  services: [],
  currentService: null,
  loading: false,
  error: null,
}

export const fetchServices = createAsyncThunk(
  'services/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/services')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

export const fetchServiceBySlug = createAsyncThunk(
  'services/fetchBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/services/${slug}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message)
    }
  }
)

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearCurrentService: (state) => {
      state.currentService = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false
        state.services = action.payload.data.services
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchServiceBySlug.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchServiceBySlug.fulfilled, (state, action) => {
        state.loading = false
        state.currentService = action.payload.data.service
      })
      .addCase(fetchServiceBySlug.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearCurrentService } = serviceSlice.actions
export default serviceSlice.reducer
