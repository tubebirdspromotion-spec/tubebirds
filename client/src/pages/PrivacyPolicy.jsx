import { motion } from 'framer-motion'
import { FaShieldAlt, FaLock, FaUserShield, FaCookie, FaKey } from 'react-icons/fa'

const PrivacyPolicy = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 text-white py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <FaShieldAlt className="text-6xl mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-white/90">
              Tubebirds Promotion – Your Privacy is Our Priority
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container-custom max-w-4xl">
          <motion.div {...fadeIn} className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            
            <div className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                At Tubebirds Promotion, your privacy is our top priority. We are committed to protecting your personal data and maintaining full transparency regarding how your information is collected, used, and secured when you visit our website or use our services.
              </p>

              {/* Information We Collect */}
              <motion.div {...fadeIn} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaUserShield className="text-3xl text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Information We Collect</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may collect certain personal details when you register or purchase any service. This includes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Your name, email address, and phone number</li>
                  <li>Payment and billing information</li>
                  <li>YouTube channel or video URL details</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  We may also collect non-personal data automatically, such as your IP address, browser type, device information, and usage statistics, to enhance website performance and user experience.
                </p>
              </motion.div>

              {/* How Your Information Is Used */}
              <motion.div {...fadeIn} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaKey className="text-3xl text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">How Your Information Is Used</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your data helps us deliver smooth and effective service. We use the collected information to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Provide and manage Video Promotion, Channel Growth, Channel Optimization, and Audience Engagement Packages</li>
                  <li>Process payments safely via trusted and secure gateways</li>
                  <li>Improve our website, service quality, and customer support</li>
                  <li>Send relevant updates, promotions, and service-related notifications</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4 font-semibold">
                  We do not sell, rent, or trade your personal data with third parties. Limited information may be shared only with trusted service partners who assist in delivering our services.
                </p>
              </motion.div>

              {/* Data Protection & Security */}
              <motion.div {...fadeIn} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaLock className="text-3xl text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Data Protection & Security</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  We use industry-standard security measures to safeguard your information from unauthorized access, misuse, or alteration. All payments are processed using SSL-encrypted and secure payment gateways to ensure maximum safety.
                </p>
              </motion.div>

              {/* Cookies Policy */}
              <motion.div {...fadeIn} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaCookie className="text-3xl text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Cookies Policy</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Tubebirds Promotion uses cookies to improve your browsing experience, analyze site performance, and deliver personalized content. You may choose to disable cookies from your browser settings, but certain features of the website may not work properly without them.
                </p>
              </motion.div>

              {/* Your Privacy Rights */}
              <motion.div {...fadeIn} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaShieldAlt className="text-3xl text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Your Privacy Rights</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  You can request to access, modify, or delete your personal data at any time. To make such a request, kindly contact us through our official support email.
                </p>
              </motion.div>

              {/* Updates to This Privacy Policy */}
              <motion.div {...fadeIn} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Privacy Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  Tubebirds Promotion may update this Privacy Policy occasionally to reflect changes in our services, practices, or legal requirements. Any modifications will be posted on this page with an updated effective date.
                </p>
              </motion.div>

              {/* Contact Information */}
              <motion.div {...fadeIn} className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Need Help?</h3>
                <p className="text-gray-700">
                  For any privacy-related questions or concerns, please contact us at{' '}
                  <a href="mailto:contact@tubebirdspromotion.com" className="text-red-600 font-semibold hover:underline">
                    contact@tubebirdspromotion.com
                  </a>
                </p>
              </motion.div>

            </div>

          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPolicy
