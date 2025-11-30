import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaYoutube, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { logout } from '../store/slices/authSlice'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-md sticky top-0 z-50 border-b border-red-100">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group transition-all">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow"
            >
              <FaYoutube className="text-white text-xl sm:text-2xl" />
            </motion.div>
            <div className="hidden sm:block">
              <div className="text-xl sm:text-2xl font-extrabold tracking-tight">
                <span className="text-gray-900">Tube</span>
                <span className="text-red-600">Birds</span>
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 font-semibold -mt-1 tracking-wide">Grow With Confidence</div>
            </div>
            <div className="block sm:hidden">
              <div className="text-lg font-extrabold tracking-tight">
                <span className="text-gray-900">Tube</span>
                <span className="text-red-600">Birds</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-3 lg:px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-all duration-300 group"
              >
                <span className="relative z-10">{link.name}</span>
                <motion.div
                  className="absolute inset-0 bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  layoutId="navbar-hover"
                />
              </Link>
            ))}
          </div>

          {/* Right Side - Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 hover:text-primary-600 transition-colors"
                >
                  <img
                    src={user?.avatar || 'https://via.placeholder.com/40'}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full border-2 border-primary-600"
                  />
                  <span className="font-medium">{user?.name}</span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2"
                    >
                      <Link
                        to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                        className="flex items-center px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FaUser className="mr-2" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 hover:bg-gray-100 text-red-600"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-all duration-300 hover:bg-red-50 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-2xl text-gray-700"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="border-t mt-2 pt-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                      className="block py-2 text-gray-700 hover:text-primary-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="block w-full text-left py-2 text-red-600 hover:text-red-700"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block py-2 text-gray-700 hover:text-primary-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block py-2 text-primary-600 font-semibold"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar
