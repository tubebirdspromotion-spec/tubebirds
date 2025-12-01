import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading, token } = useSelector((state) => state.auth)

  // Check if token exists in localStorage as fallback
  const hasToken = token || localStorage.getItem('token')

  // Debug logging
  useEffect(() => {
    console.log('🔐 ProtectedRoute State:', {
      hasToken: !!hasToken,
      token: token ? 'exists' : 'null',
      localStorage: localStorage.getItem('token') ? 'exists' : 'null',
      isAuthenticated,
      user: user ? { role: user.role, email: user.email } : null,
      loading,
      allowedRoles
    })
  }, [hasToken, token, isAuthenticated, user, loading, allowedRoles])

  // Show loading while checking authentication
  if (loading) {
    console.log('🔄 ProtectedRoute: Showing loading spinner (loading=true)')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // If we have token but no user data yet, show loading
  if (hasToken && !user) {
    console.log('🔄 ProtectedRoute: Showing loading spinner (hasToken but no user)')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // If no token anywhere, redirect to login
  if (!hasToken) {
    console.log('❌ ProtectedRoute: Redirecting to login (no token)')
    return <Navigate to="/login" replace />
  }

  // If we have token but somehow not authenticated and no user, redirect
  if (!isAuthenticated && !user) {
    console.log('❌ ProtectedRoute: Redirecting to login (not authenticated and no user)')
    return <Navigate to="/login" replace />
  }

  // Check role-based access
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    console.log(`❌ ProtectedRoute: Redirecting to home (role ${user.role} not in allowed roles ${allowedRoles})`)
    return <Navigate to="/" replace />
  }

  console.log('✅ ProtectedRoute: Rendering children')
  return children
}

export default ProtectedRoute
