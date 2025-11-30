import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  FaYoutube, FaRocket, FaCheckCircle, FaUsers, FaChartLine, 
  FaGoogle, FaEye, FaThumbsUp, FaBullhorn, FaSearch, FaTags,
  FaFileAlt, FaImage, FaVideo, FaClock, FaShieldAlt, FaGlobe,
  FaMoneyBillWave, FaPlay, FaTrophy, FaLightbulb, FaCode
} from 'react-icons/fa'

const Services = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  const videoPromotionBenefits = [
    "Wide Range of YouTube Ads: Access diverse ad formats to maximize reach.",
    "Retargeting Campaigns: Reconnect with viewers on YouTube and the broader audience network.",
    "Creative Support: Professional copywriting and video production teams to enhance your content.",
    "Real-Time Analytics: Track performance and measure results instantly.",
    "Innovative Video Design: Eye-catching and engaging video creatives tailored for your audience.",
    "Expert Guidance: Work with a skilled team dedicated to your channel's growth."
  ]

  const performanceMetrics = [
    {
      icon: <FaEye className="text-4xl text-red-600" />,
      title: "Views",
      description: "This metric shows the total number of times your ad was watched or engaged with. It also helps identify which audience segments are most interested in your content, allowing you to target them more effectively."
    },
    {
      icon: <FaThumbsUp className="text-4xl text-red-600" />,
      title: "Clicks",
      description: "This measures how many times viewers clicked on your video or ad. Tracking clicks helps you understand how appealing and engaging your ad is to the audience."
    },
    {
      icon: <FaPlay className="text-4xl text-red-600" />,
      title: "Video Completion Rate",
      description: "This metric indicates how much of your video viewers are watching—25%, 50%, 75%, or the full 100%. It provides insights into where viewers might lose interest and helps you refine your content to maintain engagement throughout the video."
    }
  ]

  const promotionStrategies = [
    {
      icon: <FaTags className="text-5xl text-red-600" />,
      title: "Promote and Optimize Your YouTube Videos",
      description: "Promoting YouTube videos is easy, but making them stand out from the competition and reach their full potential requires a strategic approach. At Tubebirds Promotion, we provide comprehensive planning that ensures your videos shine. This includes producing high-quality content, engaging visuals, and optimized metadata.",
      points: [
        "Keyword-Rich Titles: Crafting well-defined video titles that include target keywords for better discoverability.",
        "Optimized Descriptions: Writing detailed video descriptions with relevant information about your content.",
        "Effective Video Tags: Using appropriate tags to increase your video's exposure.",
        "Custom Thumbnails: Designing eye-catching thumbnails that grab attention and encourage clicks."
      ]
    },
    {
      icon: <FaYoutube className="text-5xl text-red-600" />,
      title: "Promote Your YouTube Channel the Right Way!",
      description: "Promoting your YouTube channel is more than just boosting individual videos—it's about enhancing your overall presence on the platform. To grow effectively, you need to focus on optimizing your channel as a whole, not just your video content.",
      points: [
        "Complete Your Channel Profile: Use a visually appealing profile picture and banner. Make sure your channel reflects your brand identity and clearly communicates the type of content viewers can expect.",
        "Create a Channel Trailer: Upload an engaging trailer that captures attention, hooks viewers, and encourages them to subscribe.",
        "Boost Watch Time: Organize related videos into playlists to help viewers discover similar content. Utilize end screens and cards to keep your audience engaged and increase overall watch time.",
        "Engage With Your Audience: Reply to comments and interact with viewers regularly. This builds a strong sense of community and makes your audience feel connected to your content."
      ]
    },
    {
      icon: <FaBullhorn className="text-5xl text-red-600" />,
      title: "Activate Ads on Your YouTube Channel!",
      description: "Wondering how to run ads on YouTube? You're in the right place! Paid YouTube ads are a powerful way to increase your channel's visibility and reach your target audience—but you don't need a huge budget to get started.",
      points: [
        "Display Ads: Appear on the right-hand sidebar of videos, visible on desktop only.",
        "Overlay Ads: Semi-transparent ads displayed at the bottom of videos, available on desktop.",
        "Skippable & Non-Skippable Video Ads: Shown before, during, or after a video. Skippable ads can be skipped after 5 seconds, while non-skippable ads must be watched.",
        "Bumper Ads: Short, non-skippable ads that play before the main video.",
        "Sponsored Cards: Displayed within relevant videos to promote products or other content effectively."
      ]
    }
  ]

  const seoServices = [
    {
      icon: <FaSearch className="text-4xl text-red-600" />,
      title: "Keyword Research",
      description: "Keywords are the backbone of YouTube SEO. Our SEO experts perform in-depth keyword research using premium tools to discover high-performing keywords your target audience is searching for."
    },
    {
      icon: <FaFileAlt className="text-4xl text-red-600" />,
      title: "Title Optimization",
      description: "A compelling, SEO-friendly title can make all the difference. We craft engaging video titles that naturally include targeted keywords and help YouTube understand your video's topic."
    },
    {
      icon: <FaCode className="text-4xl text-red-600" />,
      title: "Description Optimization",
      description: "Video descriptions summarize your content and provide context for both viewers and search engines. Our team writes optimized, concise descriptions with relevant keywords and clear calls-to-action."
    },
    {
      icon: <FaImage className="text-4xl text-red-600" />,
      title: "Thumbnail Optimization",
      description: "Your thumbnail is critical for click-through rates. We design custom, attention-grabbing thumbnails that perfectly represent your video content and entice viewers to click."
    },
    {
      icon: <FaTags className="text-4xl text-red-600" />,
      title: "Tag Optimization",
      description: "Tags enhance your video's searchability. We select a set of highly relevant and targeted keywords as tags, helping YouTube understand your content and improve its chances of appearing in related searches."
    },
    {
      icon: <FaRocket className="text-4xl text-red-600" />,
      title: "Video Promotion",
      description: "After optimizing your video, we scale your reach with strategic promotions including organic promotion through social media, paid ad campaigns for targeted exposure, and influencer outreach."
    }
  ]

  const seobenefits = [
    "Video Optimization: Ensure your videos are structured for maximum discoverability with SEO-friendly titles, descriptions, tags, and metadata.",
    "Top Search Rankings: Improve your chances of appearing in YouTube and Google search results for your target keywords.",
    "Outperform Competitors: Stay ahead in your niche by leveraging strategic SEO techniques tailored to your channel and content.",
    "Eye-Catching Thumbnails: Design visually appealing thumbnails that attract clicks and increase viewer engagement.",
    "Higher Traffic & Engagement: Drive more views, retain audience attention, and grow your subscriber base organically."
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
              🚀
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">Our Services</h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed px-4">
              Professional YouTube Promotion & SEO Solutions for Channel Growth
            </p>
          </motion.div>
        </div>
      </section>

      {/* YouTube Video Promotion Service */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              YouTube Video Promotion
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
            <p className="text-2xl md:text-3xl font-bold text-red-600 mb-6">
              "Don't Just Plan, Perform!"
            </p>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              YouTube gives you the opportunity to establish your identity and share your skills with a global audience of more than 2 billion users.
            </p>
          </motion.div>

          {/* YouTube Promotion Strategy Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { icon: <FaChartLine />, title: "YouTube Promotion Strategy Planning", desc: "Kickstart your channel's growth today and watch your views soar!" },
              { icon: <FaGoogle />, title: "Google Ads Campaigns", desc: "Boost your channel quickly with steadily increasing daily views." },
              { icon: <FaUsers />, title: "Targeted Audience Reach", desc: "Attract genuine viewers through precise Google Ads targeting." },
              { icon: <FaGlobe />, title: "Expand Your Audience", desc: "Gain more subscribers and extend your reach with smart audience-focused strategies." }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-red-100"
              >
                <div className="text-5xl text-red-600 mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Benefits Section */}
          <motion.div {...fadeIn} className="bg-gradient-to-br from-gray-50 to-white p-8 md:p-12 rounded-2xl shadow-xl mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Benefits of Our YouTube Promotion Packages
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {videoPromotionBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <FaCheckCircle className="text-red-600 text-xl mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div {...fadeIn} className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              How to Measure the Success of Your YouTube Promotion Campaign
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {performanceMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  <div className="mb-4 flex justify-center">{metric.icon}</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 text-center">{metric.title}</h4>
                  <p className="text-gray-600 leading-relaxed text-center">{metric.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Promotion Strategies */}
          <div className="space-y-12 mb-16">
            {promotionStrategies.map((strategy, index) => (
              <motion.div
                key={index}
                {...fadeIn}
                className="bg-gradient-to-br from-red-50 to-orange-50 p-8 md:p-12 rounded-2xl shadow-xl border border-red-100"
              >
                <div className="flex items-start mb-6">
                  <div className="mr-6">{strategy.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{strategy.title}</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">{strategy.description}</p>
                    <ul className="space-y-3">
                      {strategy.points.map((point, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-red-600 text-xl mr-3 flex-shrink-0">⭐</span>
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Why Promote & Safety */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div {...fadeIn} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
              <FaTrophy className="text-5xl text-red-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why You Should Promote Your YouTube Videos</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                YouTube is the #1 platform for sharing video content, and today, millions of creators are uploading videos to gain fame and grow their channels. However, if your videos aren't receiving the engagement they deserve, it becomes challenging to monetize your channel or establish yourself as a YouTube star.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our promotion services don't just focus on India—we connect your content with a global audience of viewers who share the same interests, ensuring your videos reach the right people worldwide.
              </p>
            </motion.div>

            <motion.div {...fadeIn} className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg border border-green-200">
              <FaShieldAlt className="text-5xl text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Is It Safe to Buy YouTube Views?</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Absolutely! It is 100% safe</strong> to buy YouTube views through us. Not only do we provide genuine views, but we also prioritize the security of your channel. Our process is fully compliant with YouTube's Terms of Service (TOS), ensuring there's no risk to your account.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We also respect your privacy—we never ask for your login details. All we need is your YouTube channel URL to deliver results safely.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* YouTube SEO Services */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container-custom">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              YouTube SEO Services
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Grow Your Channel with a YouTube SEO Agency
            </p>
            <p className="text-lg text-white/80 max-w-4xl mx-auto mt-4">
              With over 5 million videos uploaded on YouTube, standing out can be challenging. Our YouTube SEO specialists ensure that your content reaches the right audience, no matter your niche. We use white-hat SEO strategies and advanced technologies to boost your channel's visibility, optimize your videos, and enhance overall engagement.
            </p>
          </motion.div>

          {/* SEO Importance */}
          <motion.div {...fadeIn} className="bg-white/10 backdrop-blur-md p-8 md:p-12 rounded-2xl mb-16 border border-white/20">
            <h3 className="text-3xl font-bold mb-6">The Importance of YouTube SEO for Channel Growth</h3>
            <p className="text-white/90 leading-relaxed mb-6">
              YouTube SEO is a vital factor in driving the success of your channel and increasing video visibility. Just like website SEO, optimizing your YouTube content ensures your videos reach the right audience, attract organic views, and help your channel grow faster.
            </p>
            <p className="text-white/90 leading-relaxed mb-6">
              At Tubebirds Promotion, our professional YouTube SEO services make your videos and channel more discoverable on YouTube, Google, and other search engines. By implementing effective SEO strategies, your content has a higher chance of ranking for relevant searches and reaching your target audience.
            </p>
          </motion.div>

          {/* SEO Services Benefits */}
          <motion.div {...fadeIn} className="mb-16">
            <h3 className="text-3xl font-bold mb-8 text-center">
              Why Your Business Needs YouTube SEO Services
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {seobenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20"
                >
                  <FaCheckCircle className="text-red-500 text-xl mr-3 mt-1 flex-shrink-0" />
                  <p className="text-white/90">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* SEO Strategy */}
          <motion.div {...fadeIn} className="mb-16">
            <h3 className="text-3xl font-bold mb-12 text-center">
              Our YouTube SEO and Promotion Strategy
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {seoServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20"
                >
                  <div className="mb-4 flex justify-center">{service.icon}</div>
                  <h4 className="text-xl font-bold mb-3 text-center">{service.title}</h4>
                  <p className="text-white/80 leading-relaxed text-center">{service.description}</p>
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
              Ready to Boost Your YouTube Channel?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Get started with our professional YouTube promotion and SEO services today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/pricing" className="btn bg-white text-red-600 hover:bg-yellow-400 hover:text-black px-8 py-4 text-lg shadow-xl inline-block">
                  View Our Plans
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/contact" className="btn border-2 border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 text-lg inline-block">
                  Contact Us Today
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Services
