import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { REHYDRATE } from 'redux-persist'
import api from '../../services/api'

// Get initial token from localStorage
const initialToken = localStorage.getItem('token')

const initialState = {
  user: null,
  token: initialToken,
  isAuthenticated: !!initialToken,
  loading: !!initialToken, // Set loading true if token exists, will load user data
  error: null,
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials)
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData)
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState()
      const token = auth.token || localStorage.getItem('token')
      
      if (!token) {
        return rejectWithValue('No token found')
      }
      
      const response = await api.get('/auth/me')
      return response.data
    } catch (error) {
      // Don't remove token here, let the interceptor handle it
      return rejectWithValue(error.response?.data?.message || 'Failed to load user')
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put('/auth/update-profile', userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Update failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token')
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false
    },
    clearError: (state) => {
      state.error = null
    },
    // New action to sync token from localStorage
    syncToken: (state) => {
      const lsToken = localStorage.getItem('token')
      if (lsToken && !state.token) {
        state.token = lsToken
        state.isAuthenticated = true
        state.loading = true // Will trigger loadUser
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle Redux Persist REHYDRATE action
      .addCase(REHYDRATE, (state, action) => {
        console.log('🔄 REHYDRATE action:', action.payload?.auth)
        if (action.payload?.auth) {
          const { auth } = action.payload
          const lsToken = localStorage.getItem('token')
          // Restore auth state from persisted storage
          state.user = auth.user
          state.token = auth.token || lsToken
          state.isAuthenticated = !!(auth.token || lsToken)
          // If we have token but no user, set loading to trigger user load
          state.loading = !!(state.token && !state.user)
          console.log('✅ REHYDRATE complete:', {
            hasUser: !!state.user,
            hasToken: !!state.token,
            isAuthenticated: state.isAuthenticated,
            loading: state.loading
          })
        }
      })
      // Login
      .addCase(login.pending, (state) => {
        console.log('⏳ login.pending')
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('✅ login.fulfilled:', action.payload.data.user)
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.data.user
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        console.log('❌ login.rejected:', action.payload)
        state.loading = false
        state.error = action.payload
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.token = action.payload.token
        state.user = action.payload.data.user
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Load User
      .addCase(loadUser.pending, (state) => {
        console.log('⏳ loadUser.pending')
        state.loading = true
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        console.log('✅ loadUser.fulfilled:', action.payload.data.user)
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.data.user
        // Ensure token remains in state
        if (!state.token) {
          state.token = localStorage.getItem('token')
        }
      })
      .addCase(loadUser.rejected, (state, action) => {
        console.log('❌ loadUser.rejected:', action.payload)
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.error = action.payload
        // Clear localStorage as well
        localStorage.removeItem('token')
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.data.user
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, clearError, syncToken } = authSlice.actions
export default authSlice.reducer
