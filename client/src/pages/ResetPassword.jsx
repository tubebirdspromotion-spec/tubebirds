import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' })
  const [isSuccess, setIsSuccess] = useState(false)
  
  const { token } = useParams()
  const navigate = useNavigate()

  // Password strength checker
  useEffect(() => {
    const { password } = formData
    if (!password) {
      setPasswordStrength({ score: 0, text: '', color: '' })
      return
    }

    let score = 0
    if (password.length >= 6) score++
    if (password.length >= 8) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z\d]/.test(password)) score++

    const strengths = [
      { score: 1, text: 'Weak', color: 'red' },
      { score: 2, text: 'Fair', color: 'orange' },
      { score: 3, text: 'Good', color: 'yellow' },
      { score: 4, text: 'Strong', color: 'lime' },
      { score: 5, text: 'Very Strong', color: 'green' }
    ]

    const strength = strengths.find(s => s.score === score) || strengths[0]
    setPasswordStrength(strength)
  }, [formData.password])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setIsSubmitting(true)
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`, {
        password: formData.password
      })

      setIsSuccess(true)
      toast.success('Password reset successful!')
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
      
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <FaCheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. You can now login with your new password.
            </p>
            
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 transition-all duration-200"
            >
              Go to Login
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center space-x-2 mb-6"
              >
                <div className="text-4xl">🐦</div>
                <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  TubeBirds
                </span>
              </motion.div>
            </Link>
            
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Reset Your Password
            </h2>
            <p className="text-gray-600">
              Enter your new password below
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="block w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter new password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Password Strength:</span>
                      <span className={`text-xs font-medium text-${passwordStrength.color}-600`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full bg-${passwordStrength.color}-500 transition-all duration-300`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="block w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="Confirm new password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <p className={`mt-1 text-xs ${
                    formData.password === formData.confirmPassword 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {formData.password === formData.confirmPassword 
                      ? '✓ Passwords match' 
                      : '✗ Passwords do not match'
                    }
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-900 mb-2">Password Requirements:</p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li className="flex items-center">
                    <span className={formData.password.length >= 6 ? 'text-green-600' : 'text-blue-600'}>
                      {formData.password.length >= 6 ? '✓' : '•'}
                    </span>
                    <span className="ml-2">At least 6 characters</span>
                  </li>
                  <li className="flex items-center">
                    <span className={/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? 'text-green-600' : 'text-blue-600'}>
                      {/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? '✓' : '•'}
                    </span>
                    <span className="ml-2">Mix of uppercase & lowercase</span>
                  </li>
                  <li className="flex items-center">
                    <span className={/\d/.test(formData.password) ? 'text-green-600' : 'text-blue-600'}>
                      {/\d/.test(formData.password) ? '✓' : '•'}
                    </span>
                    <span className="ml-2">At least one number</span>
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || formData.password !== formData.confirmPassword}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </div>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors duration-200"
            >
              Remember your password? Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ResetPassword
