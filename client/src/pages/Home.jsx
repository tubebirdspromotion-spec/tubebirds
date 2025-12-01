import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Parallax } from 'react-parallax'
import { 
  FaYoutube, FaRocket, FaChartLine, FaUsers, FaPlay, 
  FaTrophy, FaCheckCircle, FaStar, FaMoneyBillWave,
  FaGoogle, FaCode, FaSearch, FaLightbulb, FaHeadset,
  FaShieldAlt, FaClock, FaGlobe, FaPhone, FaWhatsapp, FaEnvelope,
  FaBullhorn, FaVideo
} from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../services/api'

const Home = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const onSubmitEnquiry = async (data) => {
    setIsSubmitting(true)
    try {
      await api.post('/contact', {
        ...data,
        subject: 'Enquiry from Home Page'
      })
      toast.success('Thank you! We will contact you soon.')
      reset()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Parallax */}
      <section 
        className="min-h-[90vh] relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=1920&q=80')"
        }}
      >
        <motion.div 
          style={{ opacity }}
          className="min-h-[90vh] bg-gradient-to-br from-black/70 via-red-900/60 to-black/75 flex items-center relative overflow-hidden"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Gradient Orbs in Red/White theme */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360],
                x: [0, 50, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/30 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
                x: [0, -30, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/2 right-1/4 w-64 h-64 bg-red-600/25 rounded-full blur-2xl"
            />
            
            {/* Floating Red/White Abstract Shapes */}
            <motion.div
              animate={{
                y: [0, -40, 0],
                rotate: [0, 180, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-red-500/20 to-white/10 rounded-3xl backdrop-blur-sm border-2 border-red-500/30 shadow-2xl hidden lg:block"
            />
            
            <motion.div
              animate={{
                y: [0, 40, 0],
                rotate: [360, 180, 0],
                x: [0, 20, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-32 right-1/4 w-24 h-24 bg-gradient-to-br from-white/20 to-red-600/15 rounded-full backdrop-blur-sm border-2 border-white/30 shadow-2xl hidden md:block"
            />
            
            <motion.div
              animate={{
                y: [0, -30, 0],
                x: [0, 15, 0],
                rotate: [0, -90, 0],
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/3 left-10 w-28 h-28 bg-gradient-to-br from-red-500/25 to-black/10 rounded-2xl backdrop-blur-sm border-2 border-red-400/30 shadow-2xl hidden lg:block"
            />
            
            {/* Additional Parallax Lines */}
            <motion.div
              animate={{
                x: [-100, 100, -100],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
            />
            <motion.div
              animate={{
                x: [100, -100, 100],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </div>

          <div className="container-custom relative z-10">
            {/* Main Content */}
            <div className="grid md:grid-cols-2 gap-12 items-start py-20">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-white"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block mb-4"
                >
                  <span className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 animate-pulse">
                    <FaTrophy className="text-yellow-300" />
                    #1 YouTube Promotion Agency In India
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight drop-shadow-2xl"
                >
                  Best YouTube Promotion Agency In India
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg sm:text-xl md:text-2xl mb-8 text-white/90 leading-relaxed max-w-2xl"
                >
                  🚀 Grow your YouTube channel organically with our proven promotion strategies. 
                  Get real views, subscribers, and monetization support from experts!
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 mb-12"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/pricing" className="btn btn-primary bg-white text-red-600 hover:bg-yellow-400 hover:text-black shadow-2xl w-full sm:w-auto text-center">
                      <FaRocket className="inline mr-2" />
                      Get Started Now
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/portfolio" className="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-red-600 shadow-xl w-full sm:w-auto text-center">
                      <FaPlay className="inline mr-2" />
                      View Our Work
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Right - Enquiry Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-5 sm:p-6 md:p-7 border-2 border-white/30"
              >
                <div className="text-center mb-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block text-3xl sm:text-4xl mb-2"
                  >
                    📞
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white drop-shadow-lg">Get Free Consultation</h3>
                  <p className="text-xs sm:text-sm text-white/90">Fill the form and our team will contact you within 24 hours</p>
                </div>

                <form onSubmit={handleSubmit(onSubmitEnquiry)} className="space-y-2.5">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name *"
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-3 py-2.5 border-2 border-white/30 bg-white/90 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition placeholder:text-gray-500 text-sm"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Your Email *"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                          message: 'Invalid email address'
                        }
                      })}
                      className="w-full px-3 py-2.5 border-2 border-white/30 bg-white/90 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition placeholder:text-gray-500 text-sm"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <input
                      type="tel"
                      placeholder="Your Phone *"
                      {...register('phone', {
                        required: 'Phone is required',
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Invalid phone number'
                        }
                      })}
                      className="w-full px-3 py-2.5 border-2 border-white/30 bg-white/90 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition placeholder:text-gray-500 text-sm"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <select
                      {...register('service')}
                      className="w-full px-3 py-2.5 border-2 border-white/30 bg-white/90 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition text-gray-700 text-sm"
                    >
                      <option value="">Select Service</option>
                      <option value="YouTube Video Promotion">YouTube Video Promotion</option>
                      <option value="YouTube Video SEO">YouTube Video SEO</option>
                      <option value="YouTube Monetization">YouTube Monetization</option>
                      <option value="Google Ads">Google Ads</option>
                      <option value="Website Development">Website Development</option>
                      <option value="Website SEO">Website SEO</option>
                    </select>
                  </div>

                  <div>
                    <textarea
                      placeholder="Your Message"
                      {...register('message')}
                      rows="2"
                      className="w-full px-3 py-2.5 border-2 border-white/30 bg-white/90 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition resize-none placeholder:text-gray-500 text-sm"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? '⏳ Submitting...' : '✨ Get Free Consultation'}
                  </motion.button>
                </form>

                <p className="text-xs text-white/80 mt-2.5 text-center flex items-center justify-center gap-2">
                  <FaShieldAlt className="text-green-400" />
                  Your information is 100% safe and secure with us
                </p>
              </motion.div>
            </div>

            {/* Quick Contact Info - Below Form */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-4 -translate-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.65, type: "spring" }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center bg-gradient-to-br from-white to-gray-50 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-200 hover:shadow-2xl hover:border-emerald-300 transition-all"
              >
                <div className="text-2xl sm:text-3xl mb-2 flex justify-center text-emerald-600"><FaWhatsapp /></div>
                <div className="text-xs sm:text-sm text-gray-700 font-semibold">WhatsApp</div>
                <a href="https://wa.me/919616164131" target="_blank" rel="noopener noreferrer" className="text-base sm:text-lg font-bold text-emerald-600 hover:text-emerald-700 transition-colors">+91 9616164131</a>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center bg-gradient-to-br from-white to-gray-50 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-200 hover:shadow-2xl hover:border-indigo-300 transition-all"
              >
                <div className="text-2xl sm:text-3xl mb-2 flex justify-center text-indigo-600"><FaPhone /></div>
                <div className="text-xs sm:text-sm text-gray-700 font-semibold">Call Us</div>
                <a href="tel:+918081447837" className="text-base sm:text-lg font-bold text-indigo-600 hover:text-indigo-700 transition-colors">+91 8081447837</a>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.75, type: "spring" }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center bg-gradient-to-br from-white to-gray-50 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-200 hover:shadow-2xl hover:border-rose-300 transition-all"
              >
                <div className="text-2xl sm:text-3xl mb-2 flex justify-center text-rose-600"><FaEnvelope /></div>
                <div className="text-xs sm:text-sm text-gray-700 font-semibold">Email</div>
                <a href="mailto:contact@tubebirdspromotion.com" className="text-base sm:text-lg font-bold text-rose-600 hover:text-rose-700 transition-colors break-all">contact@tubebirdspromotion.com</a>
              </motion.div>
            </motion.div>

            {/* Animated Stats - Below Contact Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-4 -translate-y-4"
            >
              {[
                { number: '1000+', label: 'Happy Clients', icon: <FaUsers />, color: 'text-blue-600', hoverBorder: 'hover:border-blue-300' },
                { number: '100M+', label: 'Views Delivered', icon: <FaYoutube />, color: 'text-red-600', hoverBorder: 'hover:border-red-300' },
                { number: '99.8%', label: 'Success Rate', icon: <FaStar />, color: 'text-amber-600', hoverBorder: 'hover:border-amber-300' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`text-center bg-gradient-to-br from-white to-gray-50 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-200 hover:shadow-2xl transition-all ${stat.hoverBorder}`}
                >
                  <div className={`text-2xl sm:text-3xl mb-2 flex justify-center ${stat.color}`}>{stat.icon}</div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900">{stat.number}</div>
                  <div className="text-xs sm:text-sm text-gray-700 mt-1 font-semibold">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Trusted By Section */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-gray-50 to-blue-50 border-b-2">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-6 font-bold tracking-wider">TRUSTED BY 500+ YOUTUBERS ACROSS INDIA</p>
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12">
              <motion.div whileHover={{ scale: 1.2, rotate: 5 }}>
                <FaYoutube className="text-4xl sm:text-5xl md:text-6xl text-red-600" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2, rotate: -5 }}>
                <FaChartLine className="text-4xl sm:text-5xl md:text-6xl text-green-600" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2, rotate: 5 }}>
                <FaUsers className="text-4xl sm:text-5xl md:text-6xl text-purple-600" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2, rotate: -5 }}>
                <FaMoneyBillWave className="text-4xl sm:text-5xl md:text-6xl text-yellow-600" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2, rotate: 5 }}>
                <FaRocket className="text-4xl sm:text-5xl md:text-6xl text-blue-600" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* YouTube Promotion Services in India */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              YouTube Promotion Services in India
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Accelerate your YouTube channel's success with Tubebirds Promotion. We offer authentic views, real subscribers, and professional promotion strategies backed by expert assistance. As a trusted name in YouTube promotion across India, Tubebirds Promotion helps you achieve impressive growth with effective, results-driven solutions.
            </p>
          </motion.div>

          {/* Boost Your Subscribers Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-red-50 to-orange-50 p-8 md:p-12 rounded-2xl shadow-xl mb-16"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Boost Your Subscribers and Views With Our Professional YouTube Promotion
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              Tubebirds Promotion offers specialized YouTube promotion solutions that help expand your channel and increase your reach. With our targeted and strategic approach, we ensure your videos stand out and reach more people, resulting in higher subscriber counts and improved viewership.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Our skilled team works to maximize your channel's visibility by applying effective techniques that enhance engagement, draw in real organic viewers, and connect with your ideal audience. Through video optimization, smart keyword targeting, and customized growth plans, we help your channel achieve strong and consistent growth.
            </p>
          </motion.div>

          {/* YouTube Promotion Service */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
            >
              <div className="flex items-center mb-6">
                <FaGoogle className="text-5xl text-red-600 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">YouTube Promotion Service</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                At Tubebirds Promotion, we are committed to using only real and organic methods for YouTube video promotion. Our focus on genuine results has earned us thousands of daily inquiries from creators seeking reliable growth.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                With an expert team specializing in YouTube advertising, we ensure every strategy is executed efficiently and effectively. By working with Tubebirds Promotion, you gain access to tailored solutions crafted to support your channel's growth.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg border border-blue-200"
            >
              <div className="flex items-center mb-6">
                <FaVideo className="text-5xl text-blue-600 mr-4" />
                <h3 className="text-2xl font-bold text-gray-900">YouTube Video Promotion</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                At Tubebirds Promotion, we are committed to using only genuine and natural techniques for YouTube video promotion. Our focus on producing real outcomes has resulted in thousands of daily inquiries from creators seeking reliable growth.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                With an expert team experienced in YouTube ads, we run the entire system efficiently to get the best possible results from our promotion efforts.
              </p>
            </motion.div>
          </div>

          {/* Authentic Promotion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 md:p-12 rounded-2xl shadow-xl border border-green-200 mb-16"
          >
            <div className="flex items-center mb-6">
              <FaShieldAlt className="text-5xl text-green-600 mr-4" />
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                Authentic YouTube Promotion With Tubebirds Promotion
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              Want genuine growth and real results for your YouTube channel? Tubebirds Promotion is here to support you with reliable and organic YouTube promotion services in India. Our experienced team and tested methods help you attract the right viewers, increase your subscriber base, and elevate your channel's performance.
            </p>
            <p className="text-green-900 leading-relaxed text-lg font-semibold">
              Don't let this opportunity for organic YouTube growth slip away—get in touch with Tubebirds Promotion now.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How We Promote Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              How We Promote Your YouTube Videos
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              At Tubebirds Promotion, we provide cost-effective and authentic YouTube views using natural, organic promotion techniques. As a trusted YouTube marketing agency, we focus on helping you reach the right audience, run precision-targeted YouTube ads, and achieve real growth in views, subscribers, and overall channel performance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <FaUsers className="text-5xl text-red-500 mb-4" />,
                title: "1. Audience Analysis",
                description: "Tubebirds Promotion begins the process by studying your ideal viewers. We identify the people who would be most interested in your video and adjust our promotional approach accordingly. By learning about their age group, interests, and viewing habits, we make sure your content is delivered to the right audience for maximum impact."
              },
              {
                icon: <FaBullhorn className="text-5xl text-blue-500 mb-4" />,
                title: "2. Precision-Based YouTube Advertising",
                description: "At Tubebirds Promotion, we run highly focused YouTube ad campaigns designed to put your video in front of the right audience. We use detailed targeting options, including user interests, keywords, and demographic filters, to boost your ad performance and extend your video's visibility."
              },
              {
                icon: <FaCheckCircle className="text-5xl text-green-500 mb-4" />,
                title: "3. Achieve Authentic Views and True Subscribers",
                description: "With Tubebirds Promotion, you receive real views and genuine subscribers who actually value your content. Our proven promotion techniques drive consistent organic growth and stronger engagement for your channel. We prioritize sustainable, long-term results rather than short-term, low-quality gains."
              },
              {
                icon: <FaLightbulb className="text-5xl text-yellow-500 mb-4" />,
                title: "4. Tailored Promotion Plans",
                description: "At Tubebirds Promotion, we recognize that each creator has unique goals and content. We provide custom promotion solutions that fit your channel perfectly. Our experts work with you to craft strategies aligned with your niche and objectives. From video optimization to detailed keyword analysis, we implement methods that enhance your reach and support strong, consistent growth."
              },
              {
                icon: <FaChartLine className="text-5xl text-purple-500 mb-4" />,
                title: "5. Clear and Insightful Reporting",
                description: "Tubebirds Promotion values transparency above all. We deliver regular, comprehensive reports that track the results of your YouTube promotion campaigns. By providing data on views, subscriber increases, and engagement levels, we ensure you can evaluate the effectiveness of our services and see the tangible impact on your channel's growth."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 hover:bg-white/15 transition-all"
              >
                <div className="flex justify-center">{step.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-center">{step.title}</h3>
                <p className="text-white/80 leading-relaxed text-center">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-r from-red-600 to-orange-600 p-8 md:p-12 rounded-2xl text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-white">Get in Touch With Us</h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <a 
                href="tel:+918081447837"
                className="bg-white/20 backdrop-blur-md p-6 rounded-xl border border-white/30 hover:bg-white/30 transition-all flex flex-col items-center justify-center text-center"
              >
                <FaPhone className="text-4xl text-white mb-3" />
                <div className="text-sm text-white/90 mb-2 font-semibold">Call Us</div>
                <div className="text-xl sm:text-2xl font-bold text-white">+91 8081447837</div>
              </a>
              <a 
                href="https://wa.me/919616164131"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 backdrop-blur-md p-6 rounded-xl border border-white/30 hover:bg-white/30 transition-all flex flex-col items-center justify-center text-center"
              >
                <FaWhatsapp className="text-4xl text-white mb-3" />
                <div className="text-sm text-white/90 mb-2 font-semibold">WhatsApp</div>
                <div className="text-xl sm:text-2xl font-bold text-white">+91 9616164131</div>
              </a>
              <a 
                href="mailto:contact@tubebirdspromotion.com"
                className="bg-white/20 backdrop-blur-md p-6 rounded-xl border border-white/30 hover:bg-white/30 transition-all flex flex-col items-center justify-center text-center"
              >
                <FaEnvelope className="text-4xl text-white mb-3" />
                <div className="text-sm text-white/90 mb-2 font-semibold">Email</div>
                <div className="text-lg sm:text-xl font-bold text-white break-all">contact@tubebirdspromotion.com</div>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Counter Section with Parallax */}
      <Parallax
        blur={0}
        bgImage="https://images.unsplash.com/photo-1551817958-20142e3a5f33?w=1920&q=80"
        strength={200}
      >
        <section className="py-20 bg-gradient-to-r from-black/60 via-red-900/50 to-black/60">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-3"
                >
                  🎯
                </motion.div>
                <div className="text-4xl font-bold mb-2">1000+</div>
                <div className="text-gray-200">Projects Completed</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="text-5xl mb-3"
                >
                  ⚡
                </motion.div>
                <div className="text-4xl font-bold mb-2">100M+</div>
                <div className="text-gray-200">Total Views</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="text-5xl mb-3"
                >
                  💰
                </motion.div>
                <div className="text-4xl font-bold mb-2">₹5Cr+</div>
                <div className="text-gray-200">Revenue Generated</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                  className="text-5xl mb-3"
                >
                  🏆
                </motion.div>
                <div className="text-4xl font-bold mb-2">15+</div>
                <div className="text-gray-200">Awards Won</div>
              </motion.div>
            </div>
          </div>
        </section>
      </Parallax>

      {/* Services Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20" />
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block bg-red-100 text-red-600 px-4 sm:px-6 py-2 rounded-full font-semibold mb-4 text-sm sm:text-base"
            >
              🎯 OUR SERVICES
            </motion.span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent px-4">
              Comprehensive YouTube Growth Solutions
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Everything you need to grow your channel from zero to hero with our proven strategies
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaYoutube />,
                color: 'from-red-500 to-red-600',
                title: 'YouTube Video Promotion',
                description: 'Get real organic views and engagement from genuine users worldwide through targeted campaigns',
                features: ['Organic Views', 'Real Engagement', 'Targeted Audience']
              },
              {
                icon: <FaSearch />,
                color: 'from-green-500 to-green-600',
                title: 'YouTube Video SEO',
                description: 'Optimize your videos to rank higher in YouTube and Google search results',
                features: ['Keyword Research', 'Tag Optimization', 'Thumbnail Design']
              },
              {
                icon: <FaMoneyBillWave />,
                color: 'from-yellow-500 to-orange-600',
                title: 'YouTube Monetization',
                description: 'Fast-track your channel to meet YouTube Partner Program requirements',
                features: ['4000 Hours Watch', '1000 Subscribers', 'Policy Compliance']
              },
              {
                icon: <FaGoogle />,
                color: 'from-blue-500 to-blue-600',
                title: 'Google Ads Campaign',
                description: 'Run targeted Google Ads campaigns to boost your video visibility',
                features: ['Ad Strategy', 'Budget Optimization', 'ROI Tracking']
              },
              {
                icon: <FaCode />,
                color: 'from-purple-500 to-purple-600',
                title: 'Website Development',
                description: 'Build a professional website to complement your YouTube channel',
                features: ['Custom Design', 'SEO Ready', 'Mobile Responsive']
              },
              {
                icon: <FaChartLine />,
                color: 'from-pink-500 to-pink-600',
                title: 'Website SEO',
                description: 'Improve your website ranking on search engines for more traffic',
                features: ['On-Page SEO', 'Link Building', 'Content Strategy']
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative h-full"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 sm:p-8 h-full border-2 border-gray-100 hover:border-red-200 flex flex-col">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-white text-3xl mb-6 shadow-lg group-hover:shadow-xl`}
                  >
                    {service.icon}
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">{service.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed flex-grow">{service.description}</p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <FaCheckCircle className="text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Learn More Link */}
                  <Link
                    to="/services"
                    className="inline-flex items-center text-red-600 hover:text-red-700 font-semibold group"
                  >
                    Learn More 
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Services Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/services" className="btn bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 shadow-xl px-8 py-4 text-lg">
              View All Services <FaRocket className="inline ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <Parallax
        blur={0}
        bgImage="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&q=80"
        strength={300}
      >
        <section className="section-padding bg-gradient-to-r from-gray-900/80 to-black/75 text-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16 px-4"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Why Choose TubeBirds?</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300">We deliver results that matter to your channel growth</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                {
                  icon: <FaShieldAlt />,
                  title: '100% Safe & Organic',
                  description: 'All our methods comply with YouTube policies'
                },
                {
                  icon: <FaClock />,
                  title: '24/7 Support',
                  description: 'Round the clock customer support for your queries'
                },
                {
                  icon: <FaTrophy />,
                  title: 'Proven Results',
                  description: '500+ channels grown with our strategies'
                },
                {
                  icon: <FaGlobe />,
                  title: 'Global Reach',
                  description: 'Promote your content to worldwide audience'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 sm:p-6 bg-white/5 rounded-2xl backdrop-blur-sm"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    className="text-4xl sm:text-5xl md:text-6xl mb-4 text-yellow-400 flex justify-center"
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-300">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Parallax>

      {/* Success Stories Parallax */}
      <Parallax
        blur={0}
        bgImage="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80"
        strength={350}
      >
        <section className="py-24 bg-gradient-to-br from-purple-900/70 via-pink-800/60 to-red-900/70">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 text-white"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Success Stories</h2>
              <p className="text-xl text-gray-200">Real results from real YouTubers</p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { before: '500', after: '50K', metric: 'Subscribers', time: '6 months', image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop' },
                { before: '1K', after: '100K', metric: 'Monthly Views', time: '4 months', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop' },
                { before: '₹0', after: '₹2L', metric: 'Monthly Revenue', time: '8 months', image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=400&h=300&fit=crop' }
              ].map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={story.image} alt="Success" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>
                  <div className="p-6 text-white text-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div>
                        <div className="text-3xl font-bold text-red-400">{story.before}</div>
                        <div className="text-sm text-gray-300">Before</div>
                      </div>
                      <div className="text-4xl">→</div>
                      <div>
                        <div className="text-3xl font-bold text-green-400">{story.after}</div>
                        <div className="text-sm text-gray-300">After</div>
                      </div>
                    </div>
                    <div className="text-lg font-semibold mb-1">{story.metric}</div>
                    <div className="text-sm text-gray-300">In just {story.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Parallax>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white relative overflow-hidden">
        {/* Animated Background */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl"
        />

        <div className="container-custom text-center relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl sm:text-6xl mb-6"
            >
              🚀
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Ready to Grow Your YouTube Channel?
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Join 500+ successful YouTubers who trust TubeBirds for their channel growth. 
              Start your journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link to="/pricing" className="btn bg-white text-red-600 hover:bg-yellow-400 hover:text-black text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 shadow-2xl w-full sm:w-auto">
                  <FaRocket className="inline mr-2" />
                  View Our Plans
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link to="/contact" className="btn border-2 border-white text-white hover:bg-white hover:text-red-600 text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 shadow-xl w-full sm:w-auto">
                  <FaHeadset className="inline mr-2" />
                  Talk to Expert
                </Link>
              </motion.div>
            </div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 sm:mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto border border-white/20"
            >
              <div className="flex items-center justify-center mb-4 gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <FaStar className="text-yellow-400 text-xl sm:text-2xl" />
                  </motion.div>
                ))}
              </div>
              <p className="text-base sm:text-lg italic mb-4 leading-relaxed">
                "TubeBirds helped me grow from 500 to 50,000 subscribers in just 6 months! Their strategies are authentic and really work!"
              </p>
              <p className="font-semibold text-sm sm:text-base">- Rahul Sharma, Tech YouTuber</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
