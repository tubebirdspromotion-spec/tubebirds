import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API Endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
}

export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
}

export const pricingAPI = {
  getAll: () => api.get('/pricing'),
  getById: (id) => api.get(`/pricing/${id}`),
  getByService: (serviceId) => api.get(`/pricing/service/${serviceId}`),
  create: (data) => api.post('/pricing', data),
  update: (id, data) => api.put(`/pricing/${id}`, data),
  delete: (id) => api.delete(`/pricing/${id}`),
}

export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getMyOrders: () => api.get('/orders/my-orders'),
  create: (data) => api.post('/orders', data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  delete: (id) => api.delete(`/orders/${id}`),
}

export const portfolioAPI = {
  getAll: () => api.get('/portfolio'),
  getById: (id) => api.get(`/portfolio/${id}`),
  create: (data) => api.post('/portfolio', data),
  update: (id, data) => api.put(`/portfolio/${id}`, data),
  delete: (id) => api.delete(`/portfolio/${id}`),
}

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  getById: (id) => api.get(`/contact/${id}`),
  updateStatus: (id, status) => api.put(`/contact/${id}/status`, { status }),
  delete: (id) => api.delete(`/contact/${id}`),
}

export const consultationAPI = {
  request: (data) => api.post('/consultations', data),
  getAll: () => api.get('/consultations'),
  getById: (id) => api.get(`/consultations/${id}`),
  updateStatus: (id, status) => api.put(`/consultations/${id}/status`, { status }),
  delete: (id) => api.delete(`/consultations/${id}`),
}

export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getAll: () => api.get('/reviews'),
  getByService: (serviceId) => api.get(`/reviews/service/${serviceId}`),
  approve: (id) => api.put(`/reviews/${id}/approve`),
  delete: (id) => api.delete(`/reviews/${id}`),
}

export const paymentAPI = {
  initiate: (data) => api.post('/payment/initiate', data),
  verify: (data) => api.post('/payment/verify', data),
}

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentOrders: () => api.get('/dashboard/recent-orders'),
  getRevenueChart: () => api.get('/dashboard/revenue-chart'),
}

export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
}

export default api
