import { motion } from 'framer-motion'
import { FaYoutube, FaRocket, FaCheckCircle, FaUsers, FaTrophy, FaChartLine, FaHeart, FaGlobe, FaShieldAlt } from 'react-icons/fa'

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  const features = [
    {
      icon: <FaUsers className="text-4xl text-red-600" />,
      title: "Personalized Promotion Solutions",
      description: "We design unique promotional plans that perfectly fit your goals and target audience, ensuring effective and relevant results."
    },
    {
      icon: <FaChartLine className="text-4xl text-red-600" />,
      title: "Accurate Audience Targeting",
      description: "By leveraging deep analytics, we make sure your ads reach the right people—those who are most likely to engage with your videos."
    },
    {
      icon: <FaRocket className="text-4xl text-red-600" />,
      title: "Advanced Video Optimization",
      description: "Our optimization techniques help your videos rank better and become more discoverable, increasing your chances of gaining organic views."
    },
    {
      icon: <FaHeart className="text-4xl text-red-600" />,
      title: "Higher Viewer Interaction",
      description: "With attractive thumbnails, catchy titles, and strong CTAs, we help boost viewer engagement, encouraging more subscriptions and social interactions."
    },
    {
      icon: <FaTrophy className="text-4xl text-red-600" />,
      title: "Data-Driven Results",
      description: "We focus on delivering strong outcomes. Our experts continuously track performance metrics and adjust strategies to get you the best return on investment."
    }
  ]

  const achievements = [
    { icon: <FaUsers />, number: "3,000+", label: "Channels Grown" },
    { icon: <FaYoutube />, number: "20,000+", label: "Views Delivered" },
    { icon: <FaTrophy />, number: "100%", label: "Organic Growth" },
    { icon: <FaGlobe />, number: "Global", label: "Reach" }
  ]

  const supports = [
    "Promoting your videos so more people become aware of your content.",
    "Helping your channel expand and reach new audiences.",
    "Offering an easy method to gain real, genuine viewers for your videos.",
    "Enabling you to achieve monetization goals by increasing watch hours and subscribers.",
    "Enhancing your video's visibility to improve its potential to go viral."
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
              🎯
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">About Us</h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed px-4">
              Your Trusted Partner for YouTube Growth Since 2022
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div {...fadeIn} className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <FaYoutube className="text-6xl text-red-600 mr-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Story</h2>
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p className="text-lg">
                Tubebirds Promotion, founded in <strong>2022 by Vishal Kushwaha</strong>, is a trusted and authentic YouTube promotion platform built specifically for content creators. Our goal is to help YouTubers grow by connecting their videos with the right audience. Just like "content matchmakers," we ensure your videos reach viewers who are genuinely interested in your niche.
              </p>
              
              <p className="text-lg">
                Using a strategic mix of promotion expertise and advanced algorithm-based targeting, Tubebirds Promotion has successfully supported the growth of over <strong>3,000 YouTube channels</strong> across multiple categories.
              </p>

              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-8 rounded-2xl my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Over time, we have:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <FaCheckCircle className="text-red-600 mr-3 mt-1 flex-shrink-0" />
                    <span>Helped musicians get noticed and signed</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-red-600 mr-3 mt-1 flex-shrink-0" />
                    <span>Supported the launch of major Android and iOS applications</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-red-600 mr-3 mt-1 flex-shrink-0" />
                    <span>Turned small creators into well-known digital brands</span>
                  </li>
                </ul>
              </div>

              <p className="text-lg italic bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                There's a good chance that one of the channels you regularly watch has partnered with Tubebirds Promotion to grow their reach!
              </p>

              <p className="text-lg">
                Whether you want to promote a specific video or scale your entire YouTube channel, Tubebirds Promotion provides the tools and support you need. Our mission is to deliver real views, genuine engagement, and long-term YouTube success for every creator.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Achievements Stats */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl mb-3 flex justify-center text-red-500">
                  {achievement.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{achievement.number}</div>
                <div className="text-gray-400 text-sm md:text-base">{achievement.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Partner */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container-custom">
          <motion.div {...fadeIn} className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Your Trusted Partner for YouTube Video Growth
              </h2>
              <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p className="text-lg">
                At Tubebirds Promotion, we recognize the impact YouTube can have in spreading your message across the world. As a premium YouTube promotion service, our focus is on helping creators, businesses, and brands enhance their visibility and grow their online influence.
              </p>

              <p className="text-lg">
                With YouTube becoming increasingly saturated, standing out has become difficult. That's why Tubebirds Promotion offers expert support—using precision-targeted ads, strategic optimization, and proven engagement methods to boost your video performance.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
                <p className="text-lg mb-0">
                  Our experienced team thoroughly understands YouTube's algorithm and growth patterns. By applying these insights, we help your videos achieve higher visibility, stronger engagement, and faster audience growth. Choosing Tubebirds Promotion ensures you stay ahead of the competition and opens the door to greater success on YouTube.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div {...fadeIn} className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Who We Are
              </h2>
              <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p className="text-lg">
                At Tubebirds Promotion, we provide a simple yet powerful way to make sure your YouTube videos are seen by real, interested viewers. Our platform is crafted to help creators gain the watch hours and subscribers needed for YouTube monetization. With our professional support, your videos can attract the attention they deserve and even go viral.
              </p>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                <p className="text-lg font-semibold text-green-900 mb-2">Success Story:</p>
                <p className="text-lg mb-0">
                  One of our notable success stories includes promoting a music band through top music platforms, helping them gain over <strong>20,000 views</strong> and <strong>hundreds of new subscribers</strong> in just three days.
                </p>
              </div>

              <p className="text-lg">
                Our advanced promotion process is fine-tuned to perform well in any location. No matter your target region, we deliver authentic, organic views from the specific audience you want to reach.
              </p>

              <p className="text-lg">
                By choosing Tubebirds Promotion, you can expand your global reach, enhance your brand image, and significantly improve the performance of your YouTube video campaigns.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why We Stand Out */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container-custom">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Tubebirds Promotion Stands Out
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine innovation, expertise, and dedication to deliver exceptional results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Support You */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container-custom">
          <motion.div {...fadeIn} className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How Tubebirds Promotion Supports You
              </h2>
              <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {supports.map((support, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all"
                >
                  <FaShieldAlt className="text-red-500 text-2xl mr-4 mt-1 flex-shrink-0" />
                  <p className="text-white/90 leading-relaxed">{support}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 to-orange-600 text-white">
        <div className="container-custom">
          <motion.div 
            {...fadeIn}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Grow Your YouTube Channel?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of successful creators who trust Tubebirds Promotion for authentic, organic growth
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/pricing"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn bg-white text-red-600 hover:bg-yellow-400 hover:text-black px-8 py-4 text-lg shadow-xl"
              >
                View Our Plans
              </motion.a>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn border-2 border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 text-lg"
              >
                Contact Us Today
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About
