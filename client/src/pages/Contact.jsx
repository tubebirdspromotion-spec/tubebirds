import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { 
  FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, 
  FaClock, FaYoutube, FaInstagram, FaFacebook, FaLinkedin 
} from 'react-icons/fa'

const Contact = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await api.post('/contact', {
        ...data,
        subject: data.subject || 'General Inquiry'
      })
      toast.success('Thank you! We will contact you soon.')
      reset()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: <FaPhone className="text-3xl" />,
      title: "Call Us",
      value: "+91 8081447837",
      link: "tel:+918081447837",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <FaWhatsapp className="text-3xl" />,
      title: "WhatsApp",
      value: "+91 9616164131",
      link: "https://wa.me/919616164131",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <FaEnvelope className="text-3xl" />,
      title: "Email",
      value: "contact@tubebirdspromotion.com",
      link: "mailto:contact@tubebirdspromotion.com",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <FaClock className="text-3xl" />,
      title: "Working Hours",
      value: "Mon - Sat: 9 AM - 6 PM",
      link: null,
      color: "from-purple-500 to-purple-600"
    }
  ]

  const socialLinks = [
    { icon: <FaYoutube />, link: "https://www.youtube.com/@TubeBirds", color: "hover:text-red-600" },
    { icon: <FaInstagram />, link: "https://www.instagram.com/tubebirdspromotion?igsh=MTg2b3pzdjRrZmVseQ==", color: "hover:text-pink-600" },
    { icon: <FaFacebook />, link: "https://www.facebook.com/share/17oFsdsk91/", color: "hover:text-blue-600" },
    { icon: <FaLinkedin />, link: "https://www.linkedin.com/company/tubebirds-promotion/", color: "hover:text-blue-400" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              📞
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">Contact Us</h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed px-4">
              Let's Discuss How We Can Grow Your YouTube Channel Together
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className={`bg-gradient-to-br ${info.color} text-white p-6 flex justify-center`}>
                  {info.icon}
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                  {info.link ? (
                    <a 
                      href={info.link} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-red-600 transition-colors font-semibold"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-gray-600 font-semibold">{info.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Contact Section */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div {...fadeIn} className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                      placeholder="Your Name"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Phone Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { 
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Invalid phone number (10 digits)'
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                      placeholder="1234567890"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Subject
                    </label>
                    <select
                      {...register('subject')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="YouTube Promotion">YouTube Promotion</option>
                      <option value="SEO Services">SEO Services</option>
                      <option value="Pricing Information">Pricing Information</option>
                      <option value="Support">Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Message <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    {...register('message', { required: 'Message is required' })}
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"
                    placeholder="Tell us about your YouTube channel and how we can help..."
                  />
                  {errors.message && (
                    <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-4 px-6 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            </motion.div>

            {/* Additional Info */}
            <motion.div {...fadeIn} className="space-y-8">
              {/* Quick Contact */}
              <div className="bg-gradient-to-br from-red-600 to-orange-600 text-white p-8 md:p-10 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold mb-6">Quick Contact</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-white/80 mb-2">Call us directly:</p>
                    <a 
                      href="tel:+918081447837" 
                      className="text-2xl font-bold hover:text-yellow-300 transition-colors flex items-center"
                    >
                      <FaPhone className="mr-3" />
                      +91 8081447837
                    </a>
                  </div>
                  <div className="border-t border-white/20 pt-4">
                    <p className="text-white/80 mb-2">WhatsApp us:</p>
                    <a 
                      href="https://wa.me/919616164131" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl font-bold hover:text-green-300 transition-colors flex items-center"
                    >
                      <FaWhatsapp className="mr-3" />
                      +91 9616164131
                    </a>
                  </div>
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Tubebirds?</h3>
                <ul className="space-y-4">
                  {[
                    'Trusted by 3,000+ YouTube Channels',
                    '100% Organic & Safe Promotion',
                    'Real Views & Genuine Engagement',
                    'Expert YouTube SEO Services',
                    '24/7 Customer Support',
                    'Proven Track Record of Success'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="bg-red-100 p-2 rounded-full mr-3 flex-shrink-0">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 md:p-10 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-bold mb-6">Follow Us</h3>
                <p className="text-white/80 mb-6">
                  Stay connected with us on social media for the latest updates, tips, and success stories.
                </p>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`bg-white/10 backdrop-blur-md p-4 rounded-full text-2xl ${social.color} transition-colors border border-white/20`}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map or CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-100 to-gray-50">
        <div className="container-custom">
          <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Grow Your YouTube Channel?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Contact us today and let's discuss how we can help you achieve your YouTube goals!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="https://wa.me/919616164131"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn bg-green-600 text-white hover:bg-green-700 px-8 py-4 text-lg shadow-xl inline-flex items-center justify-center"
              >
                <FaWhatsapp className="mr-2 text-xl" />
                Chat on WhatsApp
              </motion.a>
              <motion.a
                href="tel:+918081447837"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn bg-red-600 text-white hover:bg-red-700 px-8 py-4 text-lg shadow-xl inline-flex items-center justify-center"
              >
                <FaPhone className="mr-2 text-xl" />
                Call Now
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact
