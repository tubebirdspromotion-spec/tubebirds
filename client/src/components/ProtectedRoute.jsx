import { Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { loadUser } from '../store/slices/authSlice'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const dispatch = useDispatch()
  const { isAuthenticated, user, loading, token } = useSelector((state) => state.auth)
  const [isRehydrated, setIsRehydrated] = useState(false)
  const [userLoadAttempted, setUserLoadAttempted] = useState(false)

  // Wait for redux-persist to rehydrate
  useEffect(() => {
    const timer = setTimeout(() => setIsRehydrated(true), 50)
    return () => clearTimeout(timer)
  }, [])

  // Check if token exists in localStorage as fallback
  const hasToken = token || localStorage.getItem('token')

  // Auto-load user if we have token but no user data
  useEffect(() => {
    if (isRehydrated && hasToken && !user && !loading && !userLoadAttempted) {
      console.log('🔄 ProtectedRoute: Auto-loading user data')
      setUserLoadAttempted(true)
      dispatch(loadUser())
    }
  }, [isRehydrated, hasToken, user, loading, userLoadAttempted, dispatch])

  // Debug logging
  useEffect(() => {
    console.log('🔐 ProtectedRoute State:', {
      hasToken: !!hasToken,
      token: token ? 'exists' : 'null',
      localStorage: localStorage.getItem('token') ? 'exists' : 'null',
      isAuthenticated,
      user: user ? { role: user.role, email: user.email } : null,
      loading,
      isRehydrated,
      userLoadAttempted,
      allowedRoles
    })
  }, [hasToken, token, isAuthenticated, user, loading, isRehydrated, userLoadAttempted, allowedRoles])

  // Show loading while waiting for rehydration
  if (!isRehydrated) {
    console.log('🔄 ProtectedRoute: Waiting for rehydration')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // If no token anywhere, redirect to login immediately
  if (!hasToken) {
    console.log('❌ ProtectedRoute: Redirecting to login (no token)')
    return <Navigate to="/login" replace />
  }

  // Show loading while fetching user data OR if loading flag is true
  if (loading || (hasToken && !user)) {
    console.log('🔄 ProtectedRoute: Loading user data', { loading, hasToken: !!hasToken, hasUser: !!user })
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // At this point we should have both token and user
  // If we don't have user despite having token, something went wrong
  if (!user) {
    console.log('❌ ProtectedRoute: Redirecting to login (token exists but no user after load)')
    return <Navigate to="/login" replace />
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log(`❌ ProtectedRoute: Redirecting to home (role ${user.role} not in allowed roles ${allowedRoles})`)
    return <Navigate to="/" replace />
  }

  console.log('✅ ProtectedRoute: Rendering children')
  return children
}

export default ProtectedRoute
