import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading, token } = useSelector((state) => state.auth)

  // Check if token exists in localStorage as fallback
  const hasToken = token || localStorage.getItem('token')

  // Show loading while checking authentication
  // If token exists but user not loaded yet, show loading
  if (loading || (hasToken && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // If no token anywhere, redirect to login
  if (!hasToken) {
    return <Navigate to="/login" replace />
  }

  // If we have token but somehow not authenticated and no user, redirect
  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace />
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
