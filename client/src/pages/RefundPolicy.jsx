import { motion } from 'framer-motion'
import { FaUndo, FaCheckCircle, FaTimesCircle, FaClock, FaQuestionCircle } from 'react-icons/fa'

const RefundPolicy = () => {
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
            <FaUndo className="text-6xl mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Refund Policy</h1>
            <p className="text-xl text-white/90">
              Tubebirds Promotion – Customer Satisfaction First
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
                At Tubebirds Promotion, we prioritize customer satisfaction and aim to deliver effective, high-quality YouTube video promotion services. Because our work involves digital advertising and third-party ad platforms, certain policies and limitations apply to refund requests.
              </p>

              {/* Eligibility for Refunds */}
              <motion.div {...fadeIn} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaCheckCircle className="text-3xl text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Eligibility for Refunds</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  A refund may be issued only under the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Your promotion campaign has not started within 48 hours of order confirmation</li>
                  <li>A technical issue on our end prevented your campaign from launching</li>
                  <li>Duplicate payments were accidentally made for the same service</li>
                </ul>
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
                  <p className="text-gray-800 font-semibold">
                    ⚠️ Important: Once a campaign begins—meaning ads have been launched or promotional activity has started—refunds cannot be issued, as advertising spends are immediately applied.
                  </p>
                </div>
              </motion.div>

              {/* Non-Refundable Situations */}
              <motion.div {...fadeIn} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaTimesCircle className="text-3xl text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Non-Refundable Situations</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Refunds will not be provided if:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>The client provides an invalid, incorrect, or non-eligible video URL or channel link</li>
                  <li>The submitted video violates YouTube policies, contains banned content, or includes copyrighted material</li>
                  <li>The client chooses to stop or cancel the promotion after the campaign has already started</li>
                </ul>
              </motion.div>

              {/* Refund Processing Time */}
              <motion.div {...fadeIn} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaClock className="text-3xl text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Refund Processing Time</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  If your refund request is approved, the amount will be issued within <strong>7–10 business days</strong> using the same payment method used during purchase.
                </p>
              </motion.div>

              {/* Need Help With a Refund? */}
              <motion.div {...fadeIn} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FaQuestionCircle className="text-3xl text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900 m-0">Need Help With a Refund?</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  For any billing or refund-related questions, please reach out to our support team with your order ID and registered email address. Our team will review your request quickly and guide you through the next steps.
                </p>
              </motion.div>

              {/* Contact Information */}
              <motion.div {...fadeIn} className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Contact Support</h3>
                <p className="text-gray-700">
                  Email us at{' '}
                  <a href="mailto:contact@tubebirdspromotion.com" className="text-red-600 font-semibold hover:underline">
                    contact@tubebirdspromotion.com
                  </a>
                  {' '}with your Order ID for assistance.
                </p>
              </motion.div>

            </div>

          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default RefundPolicy
