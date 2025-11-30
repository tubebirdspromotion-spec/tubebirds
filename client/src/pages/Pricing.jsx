import { useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Parallax } from 'react-parallax'
import { 
  FaYoutube, FaCheckCircle, FaRocket, FaStar, FaCrown,
  FaUsers, FaEye, FaChartLine, FaMoneyBillWave, FaTrophy,
  FaShieldAlt, FaClock, FaBolt, FaFireAlt, FaTimes, FaInfoCircle,
  FaThumbsUp, FaGem, FaMedal, FaAward
} from 'react-icons/fa'
import toast from 'react-hot-toast'

const Pricing = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [selectedCategory, setSelectedCategory] = useState('views')
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const openModal = (plan) => {
    setSelectedPlan(plan)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPlan(null)
  }

  const categories = [
    { id: 'views', name: 'Views Plans', icon: <FaEye /> },
    { id: 'subscribers', name: 'Subscribers Plans', icon: <FaUsers /> },
    { id: 'monetization', name: 'Monetization Plans', icon: <FaMoneyBillWave /> },
    { id: 'revenue', name: 'Revenue Plans', icon: <FaChartLine /> }
  ]

  const pricingPlans = {
    views: {
      title: "YouTube Views Plans",
      description: "Boost your video visibility with real, organic YouTube views from genuine users. Our view packages help increase your video's reach, improve search rankings, and attract more organic traffic to your content.",
      plans: [
        {
          id: 'views-1',
          name: 'Starter Views',
          badge: 'BEST FOR BEGINNERS',
          icon: <FaRocket className="text-4xl" />,
          quantity: '5,000+ Views',
          price: 750,
          originalPrice: 1500,
          discount: 50,
          popular: false,
          gradient: 'from-blue-500 to-blue-600',
          features: [
            '5,000+ Real YouTube Views',
            '100% Safe & Organic',
            'Gradual Delivery (Natural Growth)',
            'No Password Required',
            'Retention Rate: 60-80%',
            'Start Time: 12-24 Hours',
            'Completion: 5-7 Days',
            '24/7 Customer Support'
          ],
          details: 'Perfect for new creators looking to give their videos an initial boost. Our Starter Views package delivers 5,000+ genuine views from real users, helping your content gain initial traction and appear more credible to new viewers.'
        },
        {
          id: 'views-2',
          name: 'Growth Booster',
          badge: 'POPULAR CHOICE',
          icon: <FaChartLine className="text-4xl" />,
          quantity: '10,000+ Views',
          price: 1500,
          originalPrice: 3000,
          discount: 50,
          popular: true,
          gradient: 'from-green-500 to-green-600',
          features: [
            '10,000+ Real YouTube Views',
            '100% Safe & Organic',
            'Natural Delivery Pattern',
            'High Retention Rate: 70-85%',
            'Boost Search Rankings',
            'Start Time: 6-12 Hours',
            'Completion: 7-10 Days',
            'Priority Support'
          ],
          details: 'Our most popular package! Ideal for growing channels that want to increase visibility and credibility. 10,000 views significantly boost your video\'s performance in YouTube\'s algorithm.'
        },
        {
          id: 'views-3',
          name: 'Pro Package',
          badge: 'GREAT VALUE',
          icon: <FaTrophy className="text-4xl" />,
          quantity: '20,000+ Views',
          price: 2600,
          originalPrice: 5200,
          discount: 50,
          popular: false,
          gradient: 'from-purple-500 to-purple-600',
          features: [
            '20,000+ Real YouTube Views',
            'Premium Quality Views',
            'High Retention: 75-90%',
            'Faster Delivery',
            'Improved Channel Authority',
            'Start Time: 3-6 Hours',
            'Completion: 10-14 Days',
            'Dedicated Account Manager'
          ],
          details: 'Take your content to the next level with 20,000+ premium views. Perfect for established creators looking to accelerate growth and dominate their niche.'
        },
        {
          id: 'views-4',
          name: 'Elite Package',
          badge: 'MOST POWERFUL',
          icon: <FaCrown className="text-4xl" />,
          quantity: '50,000+ Views',
          price: 5500,
          originalPrice: 11000,
          discount: 50,
          popular: true,
          gradient: 'from-orange-500 to-red-600',
          features: [
            '50,000+ Real YouTube Views',
            'Premium Elite Quality',
            'Maximum Retention: 80-95%',
            'Rapid Delivery',
            'Massive Reach Expansion',
            'Viral Potential Boost',
            'Start Time: 1-3 Hours',
            'Completion: 14-20 Days'
          ],
          details: 'Our Elite package delivers massive visibility with 50,000+ high-quality views. Ideal for viral campaigns and channels serious about explosive growth.'
        },
        {
          id: 'views-5',
          name: 'Mega Viral',
          badge: 'TRENDING MAKER',
          icon: <FaFireAlt className="text-4xl" />,
          quantity: '1 Lakh+ Views',
          price: 10000,
          originalPrice: 20000,
          discount: 50,
          popular: false,
          gradient: 'from-pink-500 to-rose-600',
          features: [
            '1,00,000+ Real YouTube Views',
            'Ultra Premium Quality',
            'Highest Retention: 85-98%',
            'Lightning Fast Delivery',
            'Guaranteed Trending Potential',
            'Algorithm Optimization',
            'Start Time: Instant',
            'Completion: 20-30 Days'
          ],
          details: 'Go viral with 1 lakh+ views! This package is designed to make your video trend and reach millions of potential viewers organically.'
        },
        {
          id: 'views-6',
          name: 'Ultimate Domination',
          badge: 'LEGEND STATUS',
          icon: <FaGem className="text-4xl" />,
          quantity: '10 Lakh+ Views',
          price: 80000,
          originalPrice: 160000,
          discount: 50,
          popular: false,
          gradient: 'from-yellow-500 to-amber-600',
          features: [
            '10,00,000+ Real YouTube Views',
            'Absolute Premium Quality',
            'Near-Perfect Retention: 90-99%',
            'Maximum Speed Delivery',
            'Guaranteed Viral Status',
            'Complete Channel Transformation',
            'Celebrity-Level Reach',
            'White-Glove Service & Support'
          ],
          details: 'The ultimate package for serious creators and businesses. 10 lakh+ views transforms your channel into a major authority in your niche with massive organic reach.'
        }
      ]
    },
    subscribers: {
      title: "YouTube Subscribers Plans",
      description: "Grow your YouTube family with real, engaged subscribers who genuinely love your content. Our subscriber packages help you build a loyal community, increase channel authority, and meet monetization requirements faster.",
      plans: [
        {
          id: 'subs-1',
          name: 'Bronze Community',
          badge: 'STARTER PACK',
          icon: <FaUsers className="text-4xl" />,
          quantity: '100 Subscribers',
          price: 500,
          originalPrice: 1000,
          discount: 50,
          popular: false,
          gradient: 'from-amber-600 to-amber-700',
          features: [
            '100 Real YouTube Subscribers',
            '100% Safe & Permanent',
            'Active & Engaged Users',
            'No Password Required',
            'Natural Growth Pattern',
            'Start Time: 12-24 Hours',
            'Completion: 3-5 Days',
            'Lifetime Guarantee'
          ],
          details: 'Start building your YouTube community with 100 genuine subscribers. Perfect for new channels looking to establish credibility and social proof.'
        },
        {
          id: 'subs-2',
          name: 'Silver Community',
          badge: 'POPULAR',
          icon: <FaMedal className="text-4xl" />,
          quantity: '200 Subscribers',
          price: 1000,
          originalPrice: 2000,
          discount: 50,
          popular: true,
          gradient: 'from-gray-400 to-gray-600',
          features: [
            '200 Real YouTube Subscribers',
            'High-Quality Active Users',
            'Permanent & Safe',
            'Engagement Boost',
            'Channel Authority Increase',
            'Start Time: 6-12 Hours',
            'Completion: 5-7 Days',
            'Priority Support'
          ],
          details: 'Double your credibility with 200 engaged subscribers. This package gives your channel the momentum needed to attract organic subscribers.'
        },
        {
          id: 'subs-3',
          name: 'Gold Community',
          badge: 'BEST VALUE',
          icon: <FaGem className="text-4xl" />,
          quantity: '500 Subscribers',
          price: 2000,
          originalPrice: 4000,
          discount: 50,
          popular: true,
          gradient: 'from-yellow-500 to-yellow-600',
          features: [
            '500 Real YouTube Subscribers',
            'Premium Quality Members',
            'High Engagement Rate',
            'Permanent & Guaranteed',
            'Significant Authority Boost',
            'Start Time: 3-6 Hours',
            'Completion: 7-10 Days',
            'Dedicated Support'
          ],
          details: 'Reach the 500 subscriber milestone! This package significantly boosts your channel\'s credibility and helps unlock YouTube features faster.'
        },
        {
          id: 'subs-4',
          name: 'Platinum Community',
          badge: 'MONETIZATION READY',
          icon: <FaCrown className="text-4xl" />,
          quantity: '1,000 Subscribers',
          price: 4000,
          originalPrice: 8000,
          discount: 50,
          popular: true,
          gradient: 'from-cyan-500 to-blue-600',
          features: [
            '1,000 Real YouTube Subscribers',
            'Monetization Milestone!',
            'Premium Engaged Members',
            'Permanent & Safe',
            'Maximum Channel Credibility',
            'Start Time: 1-3 Hours',
            'Completion: 10-15 Days',
            'VIP Support'
          ],
          details: 'Hit the crucial 1K subscriber mark! This package brings you to YouTube\'s monetization threshold with genuine, engaged subscribers.'
        },
        {
          id: 'subs-5',
          name: 'Diamond Elite',
          badge: 'AUTHORITY BUILDER',
          icon: <FaGem className="text-4xl" />,
          quantity: '5,000 Subscribers',
          price: 18000,
          originalPrice: 36000,
          discount: 50,
          popular: false,
          gradient: 'from-purple-500 to-indigo-600',
          features: [
            '5,000 Real YouTube Subscribers',
            'Elite Quality Community',
            'Massive Authority Boost',
            'Permanent & Guaranteed',
            'Influencer Status',
            'Premium Engagement',
            'Start Time: Instant',
            'Completion: 15-25 Days'
          ],
          details: 'Join the influencer league with 5,000 subscribers! This package establishes you as a serious authority in your niche.'
        },
        {
          id: 'subs-6',
          name: 'Ultimate Legend',
          badge: 'CELEBRITY STATUS',
          icon: <FaFireAlt className="text-4xl" />,
          quantity: '10,000 Subscribers',
          price: 35000,
          originalPrice: 70000,
          discount: 50,
          popular: false,
          gradient: 'from-red-500 to-pink-600',
          features: [
            '10,000 Real YouTube Subscribers',
            'Celebrity-Level Community',
            'Maximum Authority & Influence',
            'Premium Engagement Guaranteed',
            'Industry Leader Status',
            'Full Channel Transformation',
            'Start Time: Instant',
            'Completion: 25-40 Days'
          ],
          details: 'Achieve celebrity status with 10,000 subscribers! This package transforms your channel into a major player in your industry.'
        }
      ]
    },
    monetization: {
      title: "YouTube Monetization Plans",
      description: "Fast-track your YouTube monetization journey! Our comprehensive packages help you meet YouTube's Partner Program requirements with genuine watch hours and subscribers, getting you eligible for ad revenue quickly and safely.",
      plans: [
        {
          id: 'mon-1',
          name: 'Starter Boost',
          badge: 'QUICK START',
          icon: <FaRocket className="text-4xl" />,
          quantity: '200 Hours + 25-30K Views',
          price: 2000,
          originalPrice: 4000,
          discount: 50,
          popular: false,
          gradient: 'from-green-500 to-green-600',
          features: [
            '200 Watch Hours Guaranteed',
            '25,000-30,000 Real Views',
            '100% Safe & Organic',
            'Natural Watch Pattern',
            'High Retention Rate',
            'Progress Towards Monetization',
            'Start Time: 24 Hours',
            'Completion: 10-15 Days'
          ],
          details: 'Begin your monetization journey! This package provides 200 watch hours with 25-30K views, giving you a solid foundation towards YouTube Partner Program eligibility.'
        },
        {
          id: 'mon-2',
          name: 'Growth Accelerator',
          badge: 'POPULAR',
          icon: <FaChartLine className="text-4xl" />,
          quantity: '500 Hours + 70-80K Views',
          price: 4500,
          originalPrice: 9000,
          discount: 50,
          popular: true,
          gradient: 'from-blue-500 to-blue-600',
          features: [
            '500 Watch Hours Guaranteed',
            '70,000-80,000 Real Views',
            'Premium Quality Views',
            'High Retention (75-85%)',
            'Faster Path to Monetization',
            'Algorithm-Friendly Growth',
            'Start Time: 12 Hours',
            'Completion: 15-20 Days'
          ],
          details: 'Accelerate your growth! 500 hours with 70-80K views puts you halfway to monetization requirements with premium quality engagement.'
        },
        {
          id: 'mon-3',
          name: 'Pro Monetization',
          badge: 'BEST VALUE',
          icon: <FaMoneyBillWave className="text-4xl" />,
          quantity: '1,000 Hours + 1.2-1.5L Views + 250 Subs',
          price: 8500,
          originalPrice: 17000,
          discount: 50,
          popular: true,
          gradient: 'from-purple-500 to-purple-600',
          features: [
            '1,000 Watch Hours (Full Requirement!)',
            '1.2-1.5 Lakh Real Views',
            '250 Real Subscribers',
            'Complete Monetization Package',
            'Premium Quality Engagement',
            'High Retention (80-90%)',
            'Start Time: 6 Hours',
            'Completion: 20-30 Days'
          ],
          details: 'Complete monetization solution! This package fulfills the entire 1,000-hour requirement plus adds 250 subscribers and up to 1.5 lakh views for maximum impact.'
        },
        {
          id: 'mon-4',
          name: 'Elite Monetization',
          badge: 'DOUBLE POWER',
          icon: <FaCrown className="text-4xl" />,
          quantity: '2,000 Hours + 2.5-3L Views + 500 Subs',
          price: 16000,
          originalPrice: 32000,
          discount: 50,
          popular: true,
          gradient: 'from-orange-500 to-red-600',
          features: [
            '2,000 Watch Hours (2x Requirement!)',
            '2.5-3 Lakh Real Views',
            '500 Real Subscribers',
            'Premium Elite Package',
            'Maximum Retention (85-95%)',
            'Rapid Channel Growth',
            'Start Time: 3 Hours',
            'Completion: 25-35 Days'
          ],
          details: 'Go beyond requirements! Double the watch hours (2,000) plus 2.5-3 lakh views and 500 subscribers ensures you stay monetized with room for fluctuation.'
        },
        {
          id: 'mon-5',
          name: 'Premium Authority',
          badge: 'TRIPLE POWER',
          icon: <FaTrophy className="text-4xl" />,
          quantity: '3,000 Hours + 3.75-4.5L Views + 750 Subs',
          price: 23000,
          originalPrice: 46000,
          discount: 50,
          popular: false,
          gradient: 'from-pink-500 to-rose-600',
          features: [
            '3,000 Watch Hours (3x Requirement!)',
            '3.75-4.5 Lakh Real Views',
            '750 Real Subscribers',
            'Authority-Building Package',
            'Near-Perfect Retention (90-95%)',
            'Massive Channel Boost',
            'Start Time: 1 Hour',
            'Completion: 30-40 Days'
          ],
          details: 'Build serious authority! Triple the requirements with 3,000 hours, up to 4.5 lakh views, and 750 subscribers for a dominant channel presence.'
        },
        {
          id: 'mon-6',
          name: 'Ultimate Domination',
          badge: 'MAXIMUM IMPACT',
          icon: <FaGem className="text-4xl" />,
          quantity: '4,000 Hours + 5-6L Views + 1,000 Subs',
          price: 30000,
          originalPrice: 60000,
          discount: 50,
          popular: false,
          gradient: 'from-yellow-500 to-amber-600',
          features: [
            '4,000 Watch Hours (4x Requirement!)',
            '5-6 Lakh Real Views',
            '1,000 Real Subscribers (Monetization Ready!)',
            'Ultimate Growth Package',
            'Maximum Retention (95-99%)',
            'Complete Channel Transformation',
            'Start Time: Instant',
            'Completion: 35-50 Days'
          ],
          details: 'The ultimate monetization package! Quadruple the watch hour requirement with 5-6 lakh views and hit the 1K subscriber milestone simultaneously.'
        }
      ]
    },
    revenue: {
      title: "YouTube Revenue Plans",
      description: "Generate real AdSense revenue with our proven revenue packages! These plans deliver targeted views from high-CPM countries with maximum ad engagement, helping you earn actual money while growing your channel organically.",
      plans: [
        {
          id: 'rev-1',
          name: 'Revenue Starter',
          badge: 'FIRST EARNINGS',
          icon: <FaMoneyBillWave className="text-4xl" />,
          quantity: '8K-12K Views = $8-$12 Revenue',
          price: 2500,
          originalPrice: 5000,
          discount: 50,
          popular: false,
          gradient: 'from-green-500 to-emerald-600',
          features: [
            '8,000-12,000 High-CPM Views',
            'Expected Revenue: $8-$12',
            '100% AdSense Safe',
            'Tier 1 Country Traffic',
            'High Ad Engagement',
            'Real Revenue Generation',
            'Start Time: 24 Hours',
            'Completion: 7-10 Days'
          ],
          details: 'Start earning today! This package delivers 8-12K views from high-CPM countries, generating $8-$12 in real AdSense revenue for your channel.'
        },
        {
          id: 'rev-2',
          name: 'Revenue Booster',
          badge: 'POPULAR CHOICE',
          icon: <FaChartLine className="text-4xl" />,
          quantity: '17K-25K Views = $17-$25 Revenue',
          price: 5000,
          originalPrice: 10000,
          discount: 50,
          popular: true,
          gradient: 'from-blue-500 to-cyan-600',
          features: [
            '17,000-25,000 High-CPM Views',
            'Expected Revenue: $17-$25',
            'Premium Tier 1 Traffic',
            'Maximum Ad Visibility',
            'High Click-Through Rate',
            'Proven Revenue Results',
            'Start Time: 12 Hours',
            'Completion: 10-14 Days'
          ],
          details: 'Double your earnings! Get 17-25K premium views generating $17-$25 in revenue. Our most popular revenue package for consistent earnings.'
        },
        {
          id: 'rev-3',
          name: 'Revenue Pro',
          badge: 'BEST VALUE',
          icon: <FaTrophy className="text-4xl" />,
          quantity: '35K-50K Views = $35-$50 Revenue',
          price: 9000,
          originalPrice: 18000,
          discount: 50,
          popular: true,
          gradient: 'from-purple-500 to-violet-600',
          features: [
            '35,000-50,000 High-CPM Views',
            'Expected Revenue: $35-$50',
            'Elite Tier 1 Countries',
            'Premium Ad Engagement',
            'Multiple Revenue Streams',
            'Optimized for Maximum Earnings',
            'Start Time: 6 Hours',
            'Completion: 14-20 Days'
          ],
          details: 'Professional revenue generation! 35-50K elite views from top-paying countries, delivering $35-$50 in AdSense earnings with high engagement.'
        },
        {
          id: 'rev-4',
          name: 'Revenue Elite',
          badge: 'HIGH EARNER',
          icon: <FaCrown className="text-4xl" />,
          quantity: '70K-100K Views = $70-$100 Revenue',
          price: 16000,
          originalPrice: 32000,
          discount: 50,
          popular: true,
          gradient: 'from-orange-500 to-red-600',
          features: [
            '70,000-1,00,000 High-CPM Views',
            'Expected Revenue: $70-$100',
            'Premium USA/UK/Canada Traffic',
            'Maximum Revenue Optimization',
            'Multi-Ad Format Engagement',
            'Consistent High Earnings',
            'Start Time: 3 Hours',
            'Completion: 20-28 Days'
          ],
          details: 'Elite earnings package! 70-100K premium views generating $70-$100 in revenue. Perfect for serious creators looking for consistent income.'
        },
        {
          id: 'rev-5',
          name: 'Revenue Master',
          badge: 'MAXIMUM PROFIT',
          icon: <FaGem className="text-4xl" />,
          quantity: '140K-2L Views = $140-$200 Revenue',
          price: 30000,
          originalPrice: 60000,
          discount: 50,
          popular: false,
          gradient: 'from-yellow-500 to-amber-600',
          features: [
            '1,40,000-2,00,000 High-CPM Views',
            'Expected Revenue: $140-$200',
            'Ultra-Premium Traffic Sources',
            'Maximum CPM Countries Only',
            'All Ad Formats Optimized',
            'Professional Revenue Stream',
            'Start Time: Instant',
            'Completion: 25-35 Days'
          ],
          details: 'Master-level earnings! 140K-2 lakh ultra-premium views generating $140-$200 in revenue. Transform your channel into a profitable business.'
        }
      ]
    }
  }

  const currentPlans = pricingPlans[selectedCategory]

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'views': return <FaEye className="text-3xl" />
      case 'subscribers': return <FaUsers className="text-3xl" />
      case 'monetization': return <FaMoneyBillWave className="text-3xl" />
      case 'revenue': return <FaChartLine className="text-3xl" />
      default: return <FaYoutube className="text-3xl" />
    }
  }

  const handleOrderNow = (plan) => {
    if (!isAuthenticated) {
      toast.error('Please login to place an order')
      navigate('/login', { state: { returnTo: '/pricing' } })
      return
    }
    
    // Add category to plan data
    const planWithCategory = {
      ...plan,
      category: selectedCategory,
      pricingId: plan.id,
      serviceId: 1 // Default service ID, you can map categories to service IDs if needed
    }
    
    // Navigate to checkout with plan data
    navigate('/checkout', { state: { plan: planWithCategory } })
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Parallax
        blur={0}
        bgImage="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1920&q=80"
        strength={300}
      >
      <section className="relative bg-gradient-to-br from-red-600/95 via-red-500/95 to-orange-500/95 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ y }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-4"
            >
              💰
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Pricing Plans</h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Affordable YouTube Growth Packages for Every Creator
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-sm"
              >
                <FaShieldAlt className="inline mr-2" /> 100% Safe
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-sm"
              >
                <FaClock className="inline mr-2" /> Fast Delivery
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-sm"
              >
                <FaTrophy className="inline mr-2" /> 10,000+ Creators
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      </Parallax>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((cat, index) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                {cat.icon}
                <span>{cat.name}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Plan Description */}
      <section className="py-8 bg-white">
        <div className="container-custom">
          <motion.div
            {...fadeIn}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {currentPlans.title}
            </h2>
            <div className="w-20 h-1 bg-red-600 mx-auto mb-4"></div>
            <p className="text-base text-gray-700 leading-relaxed">
              {currentPlans.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-8 pb-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPlans.plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.03,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-red-500 shadow-red-200' 
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white py-2 text-center z-10">
                    <div className="flex items-center justify-center gap-2">
                      <FaFireAlt className="animate-pulse" />
                      <span className="font-bold text-sm">🔥 MOST POPULAR 🔥</span>
                    </div>
                  </div>
                )}

                {/* Card Header */}
                <div className={`bg-gradient-to-br ${plan.gradient} text-white p-4 ${plan.popular ? 'pt-10' : 'pt-4'} text-center relative overflow-hidden`}>
                  {/* Animated background elements */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white rounded-full blur-2xl"></div>
                  </div>

                  {/* Badge */}
                  <div className="relative mb-2">
                    <div className="inline-block bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full border border-white/30">
                      <span className="text-[10px] font-bold uppercase tracking-wider">{plan.badge}</span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="relative flex justify-center mb-2">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full border-2 border-white/40 text-2xl">
                      {plan.icon}
                    </div>
                  </div>

                  {/* Plan Name */}
                  <h3 className="relative text-lg md:text-xl font-bold mb-1">{plan.name}</h3>

                  {/* Quantity */}
                  <div className="relative text-sm font-semibold mb-2 opacity-95 leading-tight">
                    {plan.quantity}
                  </div>

                  {/* Price */}
                  <div className="relative">
                    {/* Original Price - Strikethrough */}
                    <div className="text-xs mb-1">
                      <span className="line-through opacity-75">₹{plan.originalPrice.toLocaleString()}</span>
                      <span className="ml-1.5 bg-yellow-400 text-gray-900 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                        {plan.discount}% OFF
                      </span>
                    </div>
                    
                    {/* Current Price */}
                    <div className="text-3xl md:text-4xl font-black mb-1">
                      ₹{plan.price.toLocaleString()}
                    </div>
                    
                    {/* Price Label */}
                    <div className="text-sm font-semibold opacity-90">
                      In Just ₹{plan.price.toLocaleString()}! 🎉
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  {/* Features List */}
                  <ul className="space-y-1.5 mb-4">
                    {plan.features.slice(0, 6).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-gray-700">
                        <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-xs" />
                        <span className="text-[11px] font-medium leading-tight">{feature}</span>
                      </li>
                    ))}
                    {plan.features.length > 6 && (
                      <li className="text-[11px] text-gray-500 italic pl-4">
                        +{plan.features.length - 6} more features
                      </li>
                    )}
                  </ul>

                  {/* Action Buttons */}
                  <div className="space-y-1.5">
                    {/* Buy Now Button */}
                    <button
                      onClick={() => handleOrderNow(plan)}
                      className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700'
                          : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700'
                      }`}
                    >
                      <FaRocket className="text-xs" />
                      <span>Buy Now</span>
                    </button>

                    {/* Info Button */}
                    <button
                      onClick={() => openModal(plan)}
                      className="w-full py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-1.5 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                    >
                      <FaInfoCircle className="text-xs" />
                      <span>More Details</span>
                    </button>
                  </div>

                  {/* Trust Badge */}
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-600">
                      <FaShieldAlt className="text-green-600 text-xs" />
                      <span className="font-semibold">100% Safe & Guaranteed</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Modal */}
      <AnimatePresence>
        {showModal && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`bg-gradient-to-br ${selectedPlan.gradient} text-white p-8 relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                </div>
                
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-all"
                >
                  <FaTimes className="text-2xl" />
                </button>

                <div className="relative text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full border-2 border-white/40">
                      {selectedPlan.icon}
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{selectedPlan.name}</h3>
                  <div className="text-xl mb-4">{selectedPlan.quantity}</div>
                  <div className="text-4xl font-black">₹{selectedPlan.price.toLocaleString()}</div>
                  <div className="text-lg mt-2 opacity-90">
                    <span className="line-through">₹{selectedPlan.originalPrice.toLocaleString()}</span>
                    <span className="ml-2">• Save {selectedPlan.discount}%</span>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8">
                <div className="mb-6">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaInfoCircle className="text-blue-600" />
                    About This Plan
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {selectedPlan.details}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaStar className="text-yellow-500" />
                    What's Included
                  </h4>
                  <ul className="space-y-3">
                    {selectedPlan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200 mb-6">
                  <div className="flex items-start gap-3">
                    <FaThumbsUp className="text-green-600 text-2xl flex-shrink-0 mt-1" />
                    <div>
                      <h5 className="font-bold text-gray-900 mb-2">Why Choose This Package?</h5>
                      <p className="text-gray-700 leading-relaxed">
                        This package is perfect for creators who want real, measurable results. All our services are 100% safe, comply with YouTube's policies, and deliver genuine engagement from real users.
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/login"
                  onClick={() => {
                    closeModal()
                    handleOrderNow(selectedPlan)
                  }}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl bg-gradient-to-r ${selectedPlan.gradient} text-white`}
                >
                  <FaRocket />
                  <span>Order {selectedPlan.name} Now</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Why Choose Our Pricing Section */}
      <Parallax
        blur={0}
        bgImage="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80"
        strength={200}
      >
      <section className="py-12 bg-gradient-to-br from-gray-900/95 to-gray-800/95 text-white">
        <div className="container-custom">
          <motion.div {...fadeIn} className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our Pricing Plans?
            </h2>
            <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FaShieldAlt className="text-5xl text-green-400" />,
                title: "100% Safe & Secure",
                description: "All our services comply with YouTube's policies. Your channel is completely safe with us."
              },
              {
                icon: <FaBolt className="text-5xl text-yellow-400" />,
                title: "Fast Delivery",
                description: "Get results quickly! Most orders start showing results within 24-48 hours."
              },
              {
                icon: <FaUsers className="text-5xl text-blue-400" />,
                title: "Real & Organic",
                description: "We only provide real, organic views and subscribers from genuine users."
              },
              {
                icon: <FaFireAlt className="text-5xl text-red-400" />,
                title: "24/7 Support",
                description: "Our dedicated support team is available round the clock to assist you."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring"
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5
                }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl text-center hover:bg-white/15 transition-all"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      </Parallax>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 relative overflow-hidden">
        <div className="container-custom relative z-10">
          {/* Animated Background Elements */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl"
          />
          <motion.div
            {...fadeIn}
            className="text-center text-white relative"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Ready to Grow Your Channel?
            </h2>
            <p className="text-lg md:text-xl mb-6 text-white/90">
              Choose a plan that fits your goals and start seeing results today!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold text-base hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl inline-block"
                >
                  Get Started Now
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/contact"
                  className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-xl font-bold text-base hover:bg-white hover:text-red-600 transition-all shadow-xl inline-block"
                >
                  Contact Us
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom max-w-4xl">
          <motion.div {...fadeIn} className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="w-20 h-1 bg-red-600 mx-auto"></div>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "Are your services safe for my YouTube channel?",
                a: "Yes, absolutely! All our services are 100% safe and comply with YouTube's terms of service. We use only organic promotion methods that won't put your channel at risk."
              },
              {
                q: "How long does it take to see results?",
                a: "Most orders start showing results within 24-48 hours. The complete delivery time depends on the package you choose, typically ranging from 7-15 days."
              },
              {
                q: "Can I get a refund if I'm not satisfied?",
                a: "We offer a satisfaction guarantee. If you're not happy with the results, please contact our support team within 7 days of order completion."
              },
              {
                q: "Do you provide real views and subscribers?",
                a: "Yes! We only provide real, organic views and subscribers from genuine users who are interested in your content."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring"
                }}
                whileHover={{ 
                  x: 10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                }}
                className="bg-white p-5 rounded-xl shadow-lg"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-start gap-2">
                  <FaStar className="text-yellow-500 mt-1 flex-shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-gray-700 ml-7">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Pricing
