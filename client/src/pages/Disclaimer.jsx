import { motion } from 'framer-motion'
import { FaExclamationTriangle, FaYoutube, FaChartLine, FaLink, FaBalanceScale, FaCheckCircle } from 'react-icons/fa'

const Disclaimer = () => {
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
            <FaExclamationTriangle className="text-6xl mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Disclaimer</h1>
            <p className="text-xl text-white/90">
              Tubebirds Promotion – Important Information
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
                The content provided on the Tubebirds Promotion website is intended for general information and promotional purposes only. While we aim to keep our information accurate and up to date, Tubebirds Promotion does not guarantee the completeness, accuracy, or suitability of any content displayed on our platform.
              </p>

              {/* Service Disclaimer */}
              <motion.div {...fadeIn} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaYoutube className="text-3xl text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Service Disclaimer</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Tubebirds Promotion delivers authentic YouTube video promotion and marketing services through verified and compliant advertising methods.
                </p>
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <p className="text-gray-800 font-semibold flex items-center gap-2">
                    <FaCheckCircle className="text-green-600" />
                    We do not sell fake views, subscribers, or engagement that violates YouTube's Terms of Service.
                  </p>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4">
                  All campaigns and promotional activities strictly follow YouTube and Google advertising policies to maintain the safety and integrity of your channel.
                </p>
              </motion.div>

              {/* No Assured or Guaranteed Results */}
              <motion.div {...fadeIn} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaChartLine className="text-3xl text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">No Assured or Guaranteed Results</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Although our team uses data-backed strategies to boost exposure, engagement, and discoverability, Tubebirds Promotion cannot promise specific results, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Exact view counts</li>
                  <li>Certain subscriber numbers</li>
                  <li>Revenue outcomes</li>
                  <li>Guaranteed ranking positions</li>
                </ul>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                  <p className="text-gray-800">
                    <strong>Important:</strong> Campaign results vary based on factors such as content quality, niche competition, audience behavior, and YouTube's algorithm updates.
                  </p>
                </div>
              </motion.div>

              {/* Third-Party Website Links */}
              <motion.div {...fadeIn} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaLink className="text-3xl text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Third-Party Website Links</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Our website may include links to external websites or resources managed by third parties. Tubebirds Promotion is not responsible for the content, policies, or activities of any external websites linked from our platform.
                </p>
              </motion.div>

              {/* Limitation of Liability */}
              <motion.div {...fadeIn} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaBalanceScale className="text-3xl text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Limitation of Liability</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Tubebirds Promotion will not be held responsible for any direct, indirect, or consequential damages that arise from the use of our website or services. Clients must ensure their videos meet YouTube's community guidelines and copyright laws before submitting them for promotion.
                </p>
              </motion.div>

              {/* User Consent */}
              <motion.div {...fadeIn} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">User Consent</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing our website or purchasing any service from Tubebirds Promotion, you acknowledge and agree to the terms outlined in this Disclaimer.
                </p>
              </motion.div>

              {/* Contact Information */}
              <motion.div {...fadeIn} className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Have Questions?</h3>
                <p className="text-gray-700">
                  For any questions or clarifications regarding this disclaimer, please contact us at{' '}
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

export default Disclaimer
