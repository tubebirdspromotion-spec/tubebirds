import { motion } from 'framer-motion'
import { FaFileContract, FaYoutube, FaUserCheck, FaMoneyBillWave, FaCopyright, FaExclamationTriangle } from 'react-icons/fa'

const TermsConditions = () => {
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
            <FaFileContract className="text-6xl mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-xl text-white/90">
              Tubebirds Promotion – Please Read Carefully
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
                Welcome to Tubebirds Promotion. By accessing our website or purchasing any of our services, you agree to follow the Terms and Conditions outlined below. Please read them carefully before using our platform.
              </p>

              {/* Service Overview */}
              <motion.div {...fadeIn} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaYoutube className="text-3xl text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Service Overview</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tubebirds Promotion specializes in authentic YouTube video promotion through trusted and compliant advertising methods. Our services include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Video Promotion Packages</strong> – to boost visibility and audience reach</li>
                  <li><strong>Channel Growth Packages</strong> – to support organic subscriber growth and engagement</li>
                  <li><strong>Channel Optimization Packages</strong> – focused on SEO improvements for better ranking</li>
                  <li><strong>Audience Engagement Packages</strong> – designed to strengthen interaction and retention</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  We exclusively use legitimate advertising sources to ensure your videos remain compliant with YouTube's rules and community standards.
                </p>
              </motion.div>

              {/* User Responsibilities */}
              <motion.div {...fadeIn} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaUserCheck className="text-3xl text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">User Responsibilities</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To ensure smooth service delivery, clients must:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Provide accurate and valid YouTube video links or channel URLs</li>
                  <li>Submit content that complies with YouTube Community Guidelines, copyright rules, and other legal requirements</li>
                  <li>Ensure that videos do not contain prohibited or sensitive material such as hate speech, adult content, or misleading claims</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4 font-semibold">
                  Tubebirds Promotion reserves full rights to deny or suspend services for any video or channel that violates these policies.
                </p>
              </motion.div>

              {/* Performance and Results */}
              <motion.div {...fadeIn} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaExclamationTriangle className="text-3xl text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Performance and Results</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  While Tubebirds Promotion uses advanced marketing strategies, advertising tools, and targeted audience outreach to promote your content, we cannot guarantee specific numbers of views, subscribers, or likes. Results depend on factors such as audience interest, user behavior, and YouTube's algorithm.
                </p>
              </motion.div>

              {/* Payments */}
              <motion.div {...fadeIn} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaMoneyBillWave className="text-3xl text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Payments</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  All services must be paid for in advance using our secure online payment methods. Pricing is clearly displayed on our website, and we maintain a transparent fee structure with no hidden charges. All prices include 18% GST as per Indian tax regulations.
                </p>
              </motion.div>

              {/* Intellectual Property */}
              <motion.div {...fadeIn} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaCopyright className="text-3xl text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Intellectual Property</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  All graphics, text, logos, creative materials, and digital assets displayed on the Tubebirds Promotion website are the exclusive property of Tubebirds Promotion India. Reproduction, distribution, or reuse of our content is strictly prohibited without prior written consent.
                </p>
              </motion.div>

              {/* Limitation of Liability */}
              <motion.div {...fadeIn} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  Tubebirds Promotion is not responsible for any indirect, incidental, or consequential losses arising from the use of our services. We are also not liable for performance changes caused by YouTube policy updates, algorithm changes, or external factors beyond our control.
                </p>
              </motion.div>

              {/* Modifications to Terms */}
              <motion.div {...fadeIn} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Modifications to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  Tubebirds Promotion may update, modify, or discontinue any part of its services at any time. Any changes to these Terms and Conditions will be posted on this page along with the updated date.
                </p>
              </motion.div>

              {/* Contact Information */}
              <motion.div {...fadeIn} className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Questions?</h3>
                <p className="text-gray-700">
                  For any questions about these Terms & Conditions, please contact us at{' '}
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

export default TermsConditions
