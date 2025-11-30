import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import serviceReducer from './slices/serviceSlice'
import pricingReducer from './slices/pricingSlice'
import orderReducer from './slices/orderSlice'
import portfolioReducer from './slices/portfolioSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: serviceReducer,
    pricing: pricingReducer,
    orders: orderReducer,
    portfolio: portfolioReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
