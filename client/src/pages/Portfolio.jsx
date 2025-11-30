import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FaYoutube, FaStar, FaChartLine, FaUsers, FaEye, 
  FaTrophy, FaQuoteLeft, FaGoogle, FaFacebook,
  FaCheckCircle, FaRocket, FaFireAlt, FaHeart
} from 'react-icons/fa'
import { SiTrustpilot } from 'react-icons/si'

const Portfolio = () => {
  const [selectedType, setSelectedType] = useState('all')

  const filterTypes = [
    { id: 'all', name: 'All' },
    { id: 'report', name: 'Success Reports' },
    { id: 'review', name: 'Client Reviews' }
  ]

  // Success Reports Data
  const successReports = [
    {
      id: 1,
      title: "Tech Review Channel Growth",
      clientName: "TechGuru India",
      serviceName: "10K Views + 500 Subscribers Package",
      beforeStats: { views: 5000, subscribers: 250, engagement: 2.5 },
      afterStats: { views: 18000, subscribers: 820, engagement: 8.2 },
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
      description: "Amazing growth! Within just 2 weeks, our tech review channel saw 260% increase in views and subscribers tripled. The engagement rate improved dramatically!"
    },
    {
      id: 2,
      title: "Cooking Channel Success",
      clientName: "Desi Rasoi by Priya",
      serviceName: "Monetization Package - 1000 Hours",
      beforeStats: { views: 15000, subscribers: 450, engagement: 3.8 },
      afterStats: { views: 125000, subscribers: 1280, engagement: 12.5 },
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
      description: "Finally monetized! Started with just 450 subscribers, now at 1280+ and earning from AdSense. Best investment for my cooking channel!"
    },
    {
      id: 3,
      title: "Gaming Channel Transformation",
      clientName: "ProGamer Rohan",
      serviceName: "50K Views + Monetization Boost",
      beforeStats: { views: 8000, subscribers: 380, engagement: 4.2 },
      afterStats: { views: 62000, subscribers: 1150, engagement: 15.8 },
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
      description: "My gaming channel exploded! From struggling creator to monetized channel in 3 weeks. Views increased by 675% and subscribers tripled!"
    },
    {
      id: 4,
      title: "Fitness Vlog Growth",
      clientName: "Fit India with Arjun",
      serviceName: "Revenue Package - $50 Target",
      beforeStats: { views: 12000, subscribers: 890, engagement: 5.5 },
      afterStats: { views: 58000, subscribers: 1650, engagement: 18.2 },
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      description: "Not only got views but actual revenue! Earned $65 in AdSense within the campaign period. Totally worth it for my fitness channel!"
    },
    {
      id: 5,
      title: "Comedy Sketches Viral",
      clientName: "Desi Comedy Hub",
      serviceName: "1 Lakh Views Package",
      beforeStats: { views: 25000, subscribers: 1200, engagement: 6.8 },
      afterStats: { views: 145000, subscribers: 3850, engagement: 22.5 },
      image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80",
      description: "My comedy sketches went viral! From 25K views to 145K in just one month. Subscribers increased by 220%. Organic reach is now amazing!"
    },
    {
      id: 6,
      title: "Educational Channel Boost",
      clientName: "Learn With Sneha",
      serviceName: "2000 Hours Monetization",
      beforeStats: { views: 35000, subscribers: 680, engagement: 7.2 },
      afterStats: { views: 285000, subscribers: 2100, engagement: 28.5 },
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
      description: "Teaching became my full-time income! Got monetized and now earning steady revenue. My educational content is reaching thousands!"
    },
    {
      id: 7,
      title: "Travel Vlog Success",
      clientName: "Wanderlust Vikram",
      serviceName: "10K Subscribers Package",
      beforeStats: { views: 18000, subscribers: 450, engagement: 4.5 },
      afterStats: { views: 95000, subscribers: 11200, engagement: 19.8 },
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
      description: "Travel blogging dream came true! Crossed 10K subscribers milestone. Now getting brand deals and sponsorships regularly!"
    },
    {
      id: 8,
      title: "Music Cover Channel",
      clientName: "Melodious Aisha",
      serviceName: "Revenue + Views Combo",
      beforeStats: { views: 22000, subscribers: 920, engagement: 8.5 },
      afterStats: { views: 178000, subscribers: 3450, engagement: 31.2 },
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
      description: "My music covers are now earning! Generated $180 in revenue and gained 2500+ new subscribers. Living my musical dream!"
    },
    {
      id: 9,
      title: "Motivational Speaker Rise",
      clientName: "Inspire India - Rajesh",
      serviceName: "Elite 50K Views",
      beforeStats: { views: 8500, subscribers: 340, engagement: 3.2 },
      afterStats: { views: 68000, subscribers: 1580, engagement: 16.5 },
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
      description: "My motivational speeches are reaching masses now! 8x growth in views and 4x subscribers. Making real impact on people's lives!"
    }
  ]

  // Client Reviews Data
  const clientReviews = [
    {
      id: 1,
      customerName: "Rahul Sharma",
      rating: 5,
      review: "Best YouTube promotion service in India! I tried many services before but TubeBirds gave me real, organic subscribers. My tech channel went from 200 to 1500 subscribers in just 3 weeks. Highly recommended for serious creators!",
      platform: "google",
      customerAvatar: "https://ui-avatars.com/api/?name=Rahul+Sharma&background=EF4444&color=fff&size=128"
    },
    {
      id: 2,
      customerName: "Priya Desai",
      rating: 5,
      review: "Absolutely amazing service! Got my cooking channel monetized within a month. The watch hours were genuine and my engagement actually improved. Customer support was super helpful throughout. Worth every rupee!",
      platform: "trustpilot",
      customerAvatar: "https://ui-avatars.com/api/?name=Priya+Desai&background=EC4899&color=fff&size=128"
    },
    {
      id: 3,
      customerName: "Vikram Patel",
      rating: 5,
      review: "I was skeptical at first but TubeBirds proved me wrong! My gaming channel got 50K real views and the retention rate was excellent. YouTube algorithm picked up my videos and now I'm getting organic views too. Thanks team!",
      platform: "google",
      customerAvatar: "https://ui-avatars.com/api/?name=Vikram+Patel&background=3B82F6&color=fff&size=128"
    },
    {
      id: 4,
      customerName: "Anjali Singh",
      rating: 5,
      review: "Best decision for my fashion channel! Started with 300 subs, now at 2000+ and still growing. The subscribers are real people who actually watch and comment. My engagement rate improved from 2% to 15%. Incredible results!",
      platform: "facebook",
      customerAvatar: "https://ui-avatars.com/api/?name=Anjali+Singh&background=F59E0B&color=fff&size=128"
    },
    {
      id: 5,
      customerName: "Arjun Reddy",
      rating: 5,
      review: "Finally a genuine YouTube promotion service! Got 1 lakh views package and every single view was real. My fitness videos are now ranking higher in search. AdSense revenue also increased significantly. 100% satisfied!",
      platform: "google",
      customerAvatar: "https://ui-avatars.com/api/?name=Arjun+Reddy&background=10B981&color=fff&size=128"
    },
    {
      id: 6,
      customerName: "Sneha Kapoor",
      rating: 5,
      review: "TubeBirds helped me achieve my YouTube dreams! My educational channel was struggling with only 500 subscribers. After their monetization package, I crossed 1000 subs and got monetized. Now earning monthly! Thank you so much!",
      platform: "trustpilot",
      customerAvatar: "https://ui-avatars.com/api/?name=Sneha+Kapoor&background=8B5CF6&color=fff&size=128"
    },
    {
      id: 7,
      customerName: "Karan Mehta",
      rating: 5,
      review: "Outstanding service! My comedy channel needed a push and TubeBirds delivered perfectly. 20K views package brought amazing results - views are real, retention is high, and organic growth started happening. Best investment ever!",
      platform: "google",
      customerAvatar: "https://ui-avatars.com/api/?name=Karan+Mehta&background=EF4444&color=fff&size=128"
    },
    {
      id: 8,
      customerName: "Divya Nair",
      rating: 5,
      review: "Highly professional team! Got my beauty channel from 400 to 1800 subscribers. The growth was natural and steady. My videos started appearing in recommendations. Revenue package also worked great - earned $120! Super happy!",
      platform: "facebook",
      customerAvatar: "https://ui-avatars.com/api/?name=Divya+Nair&background=EC4899&color=fff&size=128"
    },
    {
      id: 9,
      customerName: "Rohan Gupta",
      rating: 5,
      review: "Best YouTube growth service in India hands down! My travel vlog went from 600 to 11000 subscribers. Now getting brand collaborations and sponsorships. TubeBirds changed my YouTube journey completely. Must try!",
      platform: "google",
      customerAvatar: "https://ui-avatars.com/api/?name=Rohan+Gupta&background=3B82F6&color=fff&size=128"
    },
    {
      id: 10,
      customerName: "Aisha Khan",
      rating: 5,
      review: "Genuine and trustworthy service! My music channel was stuck at 800 subs for months. Took their 5K subscribers package and now at 6200+ subscribers. Views and engagement also increased dramatically. Totally recommend!",
      platform: "trustpilot",
      customerAvatar: "https://ui-avatars.com/api/?name=Aisha+Khan&background=10B981&color=fff&size=128"
    },
    {
      id: 11,
      customerName: "Suresh Kumar",
      rating: 5,
      review: "Excellent results for my tech review channel! Got monetization package and within 25 days I was eligible for YouTube Partner Program. Watch hours were genuine, subscribers were real. Very satisfied with the service!",
      platform: "google",
      customerAvatar: "https://ui-avatars.com/api/?name=Suresh+Kumar&background=F59E0B&color=fff&size=128"
    },
    {
      id: 12,
      customerName: "Meera Joshi",
      rating: 5,
      review: "Amazing experience! My cooking tutorials got 100K+ views and my channel authority increased so much. Now my new videos get thousands of views organically. TubeBirds team is professional and delivers what they promise!",
      platform: "facebook",
      customerAvatar: "https://ui-avatars.com/api/?name=Meera+Joshi&background=8B5CF6&color=fff&size=128"
    }
  ]

  const getPlatformIcon = (platform) => {
    switch(platform) {
      case 'google': return <FaGoogle className="text-blue-600" />
      case 'trustpilot': return <SiTrustpilot className="text-green-600" />
      case 'facebook': return <FaFacebook className="text-blue-700" />
      default: return <FaStar className="text-yellow-500" />
    }
  }

  const calculateGrowth = (before, after) => {
    if (!before || before === 0) return 0
    return Math.round(((after - before) / before) * 100)
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  // Filter items based on selected type
  const reports = selectedType === 'all' || selectedType === 'report' ? successReports : []
  const reviews = selectedType === 'all' || selectedType === 'review' ? clientReviews : []

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
              🏆
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">Portfolio</h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed px-4">
              Real Results, Real Growth, Real Success Stories
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-900 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
            {[
              { icon: <FaUsers className="text-5xl text-blue-400 mb-3" />, number: "10,000+", label: "Happy Clients" },
              { icon: <FaEye className="text-5xl text-green-400 mb-3" />, number: "50M+", label: "Views Delivered" },
              { icon: <FaYoutube className="text-5xl text-red-400 mb-3" />, number: "25,000+", label: "Channels Grown" },
              { icon: <FaTrophy className="text-5xl text-yellow-400 mb-3" />, number: "99.8%", label: "Success Rate" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl"
              >
                <div className="flex justify-center">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-6 sm:py-8 md:py-12 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
          >
            {filterTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${
                  selectedType === type.id
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                {type.name}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Success Reports Section */}
      {(selectedType === 'all' || selectedType === 'report') && reports.length > 0 && (
        <section className="py-10 sm:py-14 md:py-20 bg-white">
          <div className="container-custom">
            <motion.div {...fadeIn} className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Success Stories
              </h2>
              <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                See how we've helped creators like you achieve remarkable growth
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reports.map((report, index) => (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200 hover:border-red-600 transition-all duration-300 hover:shadow-2xl"
                >
                  {/* Report Image */}
                  {report.image && (
                    <div className="relative h-48 bg-gradient-to-br from-red-100 to-orange-100 overflow-hidden">
                      <img 
                        src={report.image} 
                        alt={report.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Success Story
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{report.title}</h3>
                    {report.clientName && (
                      <p className="text-gray-600 mb-4 flex items-center gap-2">
                        <FaYoutube className="text-red-600" />
                        {report.clientName}
                      </p>
                    )}
                    {report.serviceName && (
                      <p className="text-sm text-gray-500 mb-4">Service: {report.serviceName}</p>
                    )}

                    {/* Stats Comparison */}
                    {report.beforeStats && report.afterStats && (
                      <div className="space-y-4 mb-6">
                        {/* Views Growth */}
                        {report.beforeStats.views !== undefined && (
                          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-700">Views</span>
                              <span className="text-green-600 font-bold flex items-center gap-1">
                                <FaRocket />
                                +{calculateGrowth(report.beforeStats.views, report.afterStats.views)}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                {report.beforeStats.views?.toLocaleString()} → {report.afterStats.views?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Subscribers Growth */}
                        {report.beforeStats.subscribers !== undefined && (
                          <div className="bg-gradient-to-r from-red-50 to-orange-100 p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-700">Subscribers</span>
                              <span className="text-green-600 font-bold flex items-center gap-1">
                                <FaUsers />
                                +{calculateGrowth(report.beforeStats.subscribers, report.afterStats.subscribers)}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                {report.beforeStats.subscribers?.toLocaleString()} → {report.afterStats.subscribers?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Engagement Growth */}
                        {report.beforeStats.engagement !== undefined && (
                          <div className="bg-gradient-to-r from-purple-50 to-pink-100 p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-700">Engagement</span>
                              <span className="text-green-600 font-bold flex items-center gap-1">
                                <FaChartLine />
                                +{calculateGrowth(report.beforeStats.engagement, report.afterStats.engagement)}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                {report.beforeStats.engagement}% → {report.afterStats.engagement}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {report.description && (
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {report.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Client Reviews Section */}
      {(selectedType === 'all' || selectedType === 'review') && reviews.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container-custom">
            <motion.div {...fadeIn} className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                What Our Clients Say
              </h2>
              <div className="w-24 h-1 bg-red-600 mx-auto mb-8"></div>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Don't just take our word for it - hear from our satisfied clients
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 relative"
                >
                  {/* Quote Icon */}
                  <FaQuoteLeft className="text-4xl text-red-600/20 absolute top-6 right-6" />

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-xl" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 mb-6 leading-relaxed italic">
                    "{review.review}"
                  </p>

                  {/* Customer Info */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                    {review.customerAvatar ? (
                      <img 
                        src={review.customerAvatar} 
                        alt={review.customerName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-white font-bold text-xl">
                        {review.customerName?.charAt(0) || 'A'}
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{review.customerName}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {getPlatformIcon(review.platform)}
                        <span className="capitalize">{review.platform || 'Verified'} Review</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}



      {/* Achievement Badges */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container-custom">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Why Creators Trust Us
            </h2>
            <div className="w-24 h-1 bg-red-600 mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {[
              {
                icon: <FaCheckCircle className="text-5xl text-green-400" />,
                title: "Verified Results",
                description: "Every success story is real and verified by our team"
              },
              {
                icon: <FaRocket className="text-5xl text-blue-400" />,
                title: "Fast Growth",
                description: "See measurable results within days, not months"
              },
              {
                icon: <FaHeart className="text-5xl text-red-400" />,
                title: "Client Satisfaction",
                description: "99.8% of our clients recommend us to others"
              },
              {
                icon: <FaFireAlt className="text-5xl text-orange-400" />,
                title: "Proven Methods",
                description: "Strategies that have worked for 10,000+ channels"
              }
            ].map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-center hover:bg-white/15 transition-all"
              >
                <div className="flex justify-center mb-4">{badge.icon}</div>
                <h3 className="text-xl font-bold mb-3">{badge.title}</h3>
                <p className="text-white/80">{badge.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 via-orange-600 to-red-600">
        <div className="container-custom">
          <motion.div
            {...fadeIn}
            className="text-center text-white"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Ready to Join Our Success Stories?
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Let's create your own success story together. Start growing your YouTube channel today!
            </p>
            <motion.a
              href="/pricing"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-white text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl"
            >
              <FaRocket />
              <span>View Our Pricing Plans</span>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Portfolio
