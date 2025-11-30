import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import serviceReducer from './slices/serviceSlice'
import pricingReducer from './slices/pricingSlice'
import orderReducer from './slices/orderSlice'
import portfolioReducer from './slices/portfolioSlice'

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth
}

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  services: serviceReducer,
  pricing: pricingReducer,
  orders: orderReducer,
  portfolio: portfolioReducer,
})

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)
