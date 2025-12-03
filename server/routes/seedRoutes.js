import express from 'express';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Pricing from '../models/Pricing.js';
import Portfolio from '../models/Portfolio.js';
import { protect, authorize } from '../middleware/auth.js';
import '../models/index.js'; // Load model associations

const router = express.Router();

// @desc    Run database migrations (Update schema without data loss)
// @route   POST /api/seed/migrate
// @access  Private/Admin
router.post('/migrate', protect, authorize('admin'), async (req, res) => {
  try {
    console.log('🔄 Running database migrations...');
    
    const { sequelize } = await import('../config/db.js');
    
    // Direct SQL to modify pricingId column to allow NULL
    console.log('Making pricingId nullable...');
    await sequelize.query(`
      ALTER TABLE orders 
      MODIFY COLUMN pricingId INT NULL
    `);
    
    console.log('Adding planDetails column if not exists...');
    await sequelize.query(`
      ALTER TABLE orders 
      ADD COLUMN IF NOT EXISTS planDetails JSON NULL
    `).catch(err => {
      if (err.message.includes('Duplicate column')) {
        console.log('planDetails column already exists');
      } else {
        throw err;
      }
    });
    
    // Sync database schema (alter tables without dropping)
    await sequelize.sync({ alter: true });
    
    console.log('✅ Database schema updated successfully');
    
    res.status(200).json({
      status: 'success',
      message: 'Database schema migrated successfully',
      info: 'pricingId is now nullable, planDetails column added'
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to run migrations',
      error: error.message,
      details: error.stack
    });
  }
});

// @desc    Sync ALL pricing plans (Views, Subscribers, Monetization, Revenue)
// @route   POST /api/seed/sync-pricing
// @access  Private/Admin
router.post('/sync-pricing', protect, authorize('admin'), async (req, res) => {
  try {
    console.log('🔄 Syncing ALL pricing plans...');

    let totalCreated = 0;
    let totalUpdated = 0;
    const results = {};

    // ==================== YOUTUBE VIEWS SERVICE ====================
    let viewService = await Service.findOne({ where: { slug: 'youtube-views' } });
    if (!viewService) {
      viewService = await Service.create({
        title: 'YouTube Views',
        slug: 'youtube-views',
        description: 'Boost your video visibility with real, high-retention YouTube views from genuine users.',
        shortDescription: 'Boost your video visibility with real, high-retention YouTube views',
        icon: 'FaEye',
        features: JSON.stringify(['Real users, not bots', 'High retention rate', 'Gradual delivery', '24/7 support']),
        benefits: JSON.stringify(['Improve ranking', 'Increase reach', 'Build social proof', 'Boost credibility']),
        category: 'youtube',
        order: 1,
        isActive: true,
        isFeatured: true
      });
    }

    const viewsPlans = [
      { planName: 'Starter Views', quantity: '5,000+ Views', price: 750, originalPrice: 1500, discount: 50, deliveryTime: '5-7 days', features: JSON.stringify(['5,000+ Real YouTube Views', '100% Safe & Organic', 'Gradual Delivery', 'Retention Rate: 60-80%', 'Start Time: 12-24 Hours', '24/7 Customer Support']), isPopular: false, order: 1 },
      { planName: 'Growth Booster', quantity: '10,000+ Views', price: 1500, originalPrice: 3000, discount: 50, deliveryTime: '7-10 days', features: JSON.stringify(['10,000+ Real YouTube Views', 'Natural Delivery Pattern', 'High Retention: 70-85%', 'Boost Search Rankings', 'Priority Support']), isPopular: true, order: 2 },
      { planName: 'Pro Package', quantity: '20,000+ Views', price: 2600, originalPrice: 5200, discount: 50, deliveryTime: '10-14 days', features: JSON.stringify(['20,000+ Real YouTube Views', 'Premium Quality', 'High Retention: 75-90%', 'Improved Channel Authority', 'Dedicated Account Manager']), isPopular: false, order: 3 },
      { planName: 'Elite Package', quantity: '50,000+ Views', price: 5500, originalPrice: 11000, discount: 50, deliveryTime: '14-20 days', features: JSON.stringify(['50,000+ Real YouTube Views', 'Maximum Retention: 80-95%', 'Massive Reach Expansion', 'Viral Potential Boost']), isPopular: true, order: 4 },
      { planName: 'Mega Viral', quantity: '1 Lakh+ Views', price: 10000, originalPrice: 20000, discount: 50, deliveryTime: '20-30 days', features: JSON.stringify(['1,00,000+ Real YouTube Views', 'Extreme Retention: 85-98%', 'Trending Page Potential', 'Algorithm Boost']), isPopular: false, order: 5 },
      { planName: 'Ultimate Domination', quantity: '10 Lakh+ Views', price: 80000, originalPrice: 160000, discount: 50, deliveryTime: '40-60 days', features: JSON.stringify(['10,00,000+ Real YouTube Views', 'Near-Perfect Retention: 90-99%', 'Guaranteed Viral Status', 'Complete Channel Transformation', 'Celebrity-Level Reach', 'White-Glove Service']), isPopular: false, order: 6 }
    ];

    let created = 0, updated = 0;
    for (const planData of viewsPlans) {
      const [plan, wasCreated] = await Pricing.findOrCreate({
        where: { serviceId: viewService.id, planName: planData.planName },
        defaults: { ...planData, serviceId: viewService.id, category: 'youtube-views' }
      });
      if (!wasCreated) { await plan.update(planData); updated++; } else { created++; }
    }
    results.views = { created, updated, total: created + updated };
    totalCreated += created; totalUpdated += updated;

    // ==================== YOUTUBE SUBSCRIBERS SERVICE ====================
    let subsService = await Service.findOne({ where: { slug: 'youtube-subscribers' } });
    if (!subsService) {
      subsService = await Service.create({
        title: 'YouTube Subscribers',
        slug: 'youtube-subscribers',
        description: 'Grow your YouTube family with real, engaged subscribers who genuinely love your content.',
        shortDescription: 'Grow your channel with genuine YouTube subscribers',
        icon: 'FaUsers',
        features: JSON.stringify(['Real subscribers', 'Permanent', 'No password needed', 'Safe delivery']),
        benefits: JSON.stringify(['Grow channel authority', 'Unlock monetization', 'Increase engagement', 'Build community']),
        category: 'youtube',
        order: 2,
        isActive: true,
        isFeatured: true
      });
    }

    const subscribersPlans = [
      { planName: 'Bronze Community', quantity: '100 Subscribers', price: 500, originalPrice: 1000, discount: 50, deliveryTime: '3-5 days', features: JSON.stringify(['100 Real YouTube Subscribers', '100% Safe & Permanent', 'Active & Engaged Users', 'No Password Required', 'Lifetime Guarantee']), isPopular: false, order: 1 },
      { planName: 'Silver Community', quantity: '200 Subscribers', price: 1000, originalPrice: 2000, discount: 50, deliveryTime: '5-7 days', features: JSON.stringify(['200 Real YouTube Subscribers', 'High-Quality Active Users', 'Permanent & Safe', 'Engagement Boost', 'Priority Support']), isPopular: true, order: 2 },
      { planName: 'Gold Community', quantity: '500 Subscribers', price: 2000, originalPrice: 4000, discount: 50, deliveryTime: '7-10 days', features: JSON.stringify(['500 Real YouTube Subscribers', 'Premium Quality Members', 'High Engagement Rate', 'Channel Authority Boost']), isPopular: true, order: 3 },
      { planName: 'Platinum Community', quantity: '1,000 Subscribers', price: 4000, originalPrice: 8000, discount: 50, deliveryTime: '10-15 days', features: JSON.stringify(['1,000 Real YouTube Subscribers', 'Monetization Milestone!', 'Premium Engaged Members', 'Maximum Channel Credibility', 'VIP Support']), isPopular: true, order: 4 },
      { planName: 'Diamond Elite', quantity: '5,000 Subscribers', price: 18000, originalPrice: 36000, discount: 50, deliveryTime: '15-25 days', features: JSON.stringify(['5,000 Real YouTube Subscribers', 'Elite Quality Community', 'Massive Authority Boost', 'Influencer Status', 'Premium Engagement']), isPopular: false, order: 5 },
      { planName: 'Ultimate Legend', quantity: '10,000 Subscribers', price: 35000, originalPrice: 70000, discount: 50, deliveryTime: '25-40 days', features: JSON.stringify(['10,000 Real YouTube Subscribers', 'Celebrity-Level Community', 'Maximum Authority & Influence', 'Industry Leader Status', 'Full Channel Transformation']), isPopular: false, order: 6 }
    ];

    created = 0; updated = 0;
    for (const planData of subscribersPlans) {
      const [plan, wasCreated] = await Pricing.findOrCreate({
        where: { serviceId: subsService.id, planName: planData.planName },
        defaults: { ...planData, serviceId: subsService.id, category: 'youtube-subscribers' }
      });
      if (!wasCreated) { await plan.update(planData); updated++; } else { created++; }
    }
    results.subscribers = { created, updated, total: created + updated };
    totalCreated += created; totalUpdated += updated;

    // ==================== MONETIZATION SERVICE ====================
    let monService = await Service.findOne({ where: { slug: 'youtube-monetization' } });
    if (!monService) {
      monService = await Service.create({
        title: 'YouTube Monetization',
        slug: 'youtube-monetization',
        description: 'Meet YouTube Partner Program requirements with watch hours and subscribers.',
        shortDescription: 'Unlock YouTube monetization with watch hours & subscribers',
        icon: 'FaMoneyBillWave',
        features: JSON.stringify(['Meet YPP requirements', '4000 watch hours', '1000 subscribers', '100% safe']),
        benefits: JSON.stringify(['Enable monetization', 'Start earning', 'Join YPP', 'Grow revenue']),
        category: 'monetization',
        order: 3,
        isActive: true,
        isFeatured: true
      });
    }

    const monetizationPlans = [
      { planName: 'Starter Boost', quantity: '200 Hours + 25-30K Views', price: 2000, originalPrice: 4000, discount: 50, deliveryTime: '10-15 days', features: JSON.stringify(['200 Watch Hours Guaranteed', '25,000-30,000 Real Views', '100% Safe & Organic', 'Natural Watch Pattern', 'Progress Towards Monetization']), isPopular: false, order: 1 },
      { planName: 'Growth Accelerator', quantity: '500 Hours + 70-80K Views', price: 4500, originalPrice: 9000, discount: 50, deliveryTime: '15-20 days', features: JSON.stringify(['500 Watch Hours Guaranteed', '70,000-80,000 Real Views', 'Premium Quality Views', 'High Retention (75-85%)', 'Algorithm-Friendly Growth']), isPopular: true, order: 2 },
      { planName: 'Pro Monetization', quantity: '1,000 Hours + 1.2-1.5L Views + 250 Subs', price: 8500, originalPrice: 17000, discount: 50, deliveryTime: '20-30 days', features: JSON.stringify(['1,000 Watch Hours (Full Requirement!)', '1.2-1.5 Lakh Real Views', '250 Real Subscribers', 'Complete Monetization Package', 'High Retention (80-90%)']), isPopular: true, order: 3 },
      { planName: 'Elite Monetization', quantity: '2,000 Hours + 2.5-3L Views + 500 Subs', price: 16000, originalPrice: 32000, discount: 50, deliveryTime: '25-35 days', features: JSON.stringify(['2,000 Watch Hours (2x Requirement!)', '2.5-3 Lakh Real Views', '500 Real Subscribers', 'Premium Elite Package', 'Maximum Retention (85-95%)']), isPopular: true, order: 4 },
      { planName: 'Premium Authority', quantity: '3,000 Hours + 3.75-4.5L Views + 750 Subs', price: 23000, originalPrice: 46000, discount: 50, deliveryTime: '30-40 days', features: JSON.stringify(['3,000 Watch Hours (3x Requirement!)', '3.75-4.5 Lakh Real Views', '750 Real Subscribers', 'Authority-Building Package', 'Near-Perfect Retention (90-95%)']), isPopular: false, order: 5 },
      { planName: 'Ultimate Domination', quantity: '4,000 Hours + 5-6L Views + 1,000 Subs', price: 30000, originalPrice: 60000, discount: 50, deliveryTime: '35-50 days', features: JSON.stringify(['4,000 Watch Hours (4x Requirement!)', '5-6 Lakh Real Views', '1,000 Real Subscribers', 'Ultimate Growth Package', 'Maximum Retention (95-99%)']), isPopular: false, order: 6 }
    ];

    created = 0; updated = 0;
    for (const planData of monetizationPlans) {
      const [plan, wasCreated] = await Pricing.findOrCreate({
        where: { serviceId: monService.id, planName: planData.planName },
        defaults: { ...planData, serviceId: monService.id, category: 'youtube-monetization' }
      });
      if (!wasCreated) { await plan.update(planData); updated++; } else { created++; }
    }
    results.monetization = { created, updated, total: created + updated };
    totalCreated += created; totalUpdated += updated;

    // ==================== REVENUE SERVICE ====================
    let revService = await Service.findOne({ where: { slug: 'youtube-revenue' } });
    if (!revService) {
      revService = await Service.create({
        title: 'YouTube Revenue Boost',
        slug: 'youtube-revenue',
        description: 'Maximize your YouTube revenue with strategic growth and engagement.',
        shortDescription: 'Maximize YouTube revenue with strategic growth',
        icon: 'FaChartLine',
        features: JSON.stringify(['Revenue optimization', 'Strategic growth', 'Engagement boost', 'Analytics support']),
        benefits: JSON.stringify(['Increase earnings', 'Optimize CPM', 'Grow revenue', 'Scale income']),
        category: 'revenue',
        order: 4,
        isActive: true,
        isFeatured: false
      });
    }

    const revenuePlans = [
      { planName: 'Revenue Starter', quantity: '8K-12K Views = $8-$12 Revenue', price: 2500, originalPrice: 5000, discount: 50, deliveryTime: '7-10 days', features: JSON.stringify(['8,000-12,000 High-CPM Views', 'Expected Revenue: $8-$12', '100% AdSense Safe', 'Tier 1 Country Traffic', 'High Ad Engagement']), isPopular: false, order: 1 },
      { planName: 'Revenue Booster', quantity: '17K-25K Views = $17-$25 Revenue', price: 5000, originalPrice: 10000, discount: 50, deliveryTime: '10-14 days', features: JSON.stringify(['17,000-25,000 High-CPM Views', 'Expected Revenue: $17-$25', 'Premium Tier 1 Traffic', 'Maximum Ad Visibility', 'Proven Revenue Results']), isPopular: true, order: 2 },
      { planName: 'Revenue Pro', quantity: '35K-50K Views = $35-$50 Revenue', price: 9000, originalPrice: 18000, discount: 50, deliveryTime: '14-20 days', features: JSON.stringify(['35,000-50,000 High-CPM Views', 'Expected Revenue: $35-$50', 'Elite Tier 1 Countries', 'Premium Ad Engagement', 'Optimized for Maximum Earnings']), isPopular: true, order: 3 },
      { planName: 'Revenue Elite', quantity: '70K-100K Views = $70-$100 Revenue', price: 16000, originalPrice: 32000, discount: 50, deliveryTime: '20-28 days', features: JSON.stringify(['70,000-1,00,000 High-CPM Views', 'Expected Revenue: $70-$100', 'Premium USA/UK/Canada Traffic', 'Maximum Revenue Optimization', 'Consistent High Earnings']), isPopular: true, order: 4 },
      { planName: 'Revenue Master', quantity: '140K-2L Views = $140-$200 Revenue', price: 30000, originalPrice: 60000, discount: 50, deliveryTime: '25-35 days', features: JSON.stringify(['1,40,000-2,00,000 High-CPM Views', 'Expected Revenue: $140-$200', 'Ultra-Premium Traffic Sources', 'Maximum CPM Countries Only', 'Professional Revenue Stream']), isPopular: false, order: 5 }
    ];

    created = 0; updated = 0;
    for (const planData of revenuePlans) {
      const [plan, wasCreated] = await Pricing.findOrCreate({
        where: { serviceId: revService.id, planName: planData.planName },
        defaults: { ...planData, serviceId: revService.id, category: 'youtube-revenue' }
      });
      if (!wasCreated) { await plan.update(planData); updated++; } else { created++; }
    }
    results.revenue = { created, updated, total: created + updated };
    totalCreated += created; totalUpdated += updated;

    res.status(200).json({
      status: 'success',
      message: 'All pricing plans synced successfully',
      data: {
        totalCreated,
        totalUpdated,
        totalPlans: totalCreated + totalUpdated,
        breakdown: results
      }
    });

  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to sync pricing plans',
      error: error.message
    });
  }
});

// @desc    Seed database (Secure - Admin only)
// @route   POST /api/seed/initialize
// @access  Private/Admin
router.post('/initialize', protect, authorize('admin'), async (req, res) => {
  try {
    console.log('🌱 Starting database seed via API...');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      where: { email: 'tubebirdspromotion@gmail.com' } 
    }).catch(err => {
      console.error('Error checking admin:', err);
      return null;
    });

    let admin = existingAdmin;
    
    // Create admin only if doesn't exist
    if (!existingAdmin) {
      console.log('Creating admin user...');
      admin = await User.create({
        name: 'Admin User',
        email: 'tubebirdspromotion@gmail.com',
        password: 'Vishal8081@#$',
        phone: '9876543210',
        role: 'admin',
        isVerified: true,
        isActive: true
      });
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists, skipping...');
    }

    // ============================================
    // 2. CREATE SERVICES
    // ============================================
    console.log('Creating services...');
    
    // Check if services already exist
    const existingServicesCount = await Service.count();
    let services = [];
    
    if (existingServicesCount > 0) {
      console.log('✅ Services already exist, fetching existing services...');
      services = await Service.findAll({ order: [['order', 'ASC']] });
    } else {
      services = await Service.bulkCreate([
        {
          name: 'YouTube Video Promotion',
          slug: 'youtube-video-promotion',
          category: 'youtube',
          description: 'Boost your video visibility with real, high-retention YouTube views',
          icon: 'eye',
          order: 1,
          isActive: true,
          isFeatured: true
        },
        {
          name: 'YouTube Channel Growth',
          slug: 'youtube-channel-growth',
          category: 'youtube',
          description: 'Grow your channel with genuine YouTube subscribers',
          icon: 'users',
          order: 2,
          isActive: true,
          isFeatured: true
        },
        {
          name: 'YouTube Video SEO',
          slug: 'youtube-video-seo',
          category: 'seo',
          description: 'Optimize your videos for better search rankings',
          icon: 'search',
          order: 3,
          isActive: true,
          isFeatured: false
        },
        {
          name: 'YouTube Monetization',
          slug: 'youtube-monetization',
          category: 'monetization',
          description: 'Get your channel monetization ready with watch hours',
          icon: 'dollar-sign',
          order: 4,
          isActive: true,
          isFeatured: true
        },
        {
          name: 'Audience Engagement',
          slug: 'audience-engagement',
          category: 'engagement',
          description: 'Increase likes, comments and engagement on your videos',
          icon: 'heart',
          order: 5,
          isActive: true,
          isFeatured: false
        }
      ]);
      console.log('✅ Created 5 services');
    }

    // ============================================
    // 3. CREATE PRICING PLANS
    // ============================================
    console.log('Creating pricing plans...');
    
    // Check if pricing plans already exist
    const existingPricingCount = await Pricing.count();
    
    if (existingPricingCount > 0) {
      console.log('✅ Pricing plans already exist, skipping...');
    } else {
      const pricingPlans = [];
      
      // Views packages
      pricingPlans.push(
        { serviceId: services[0].id, name: 'Starter Views', quantity: '5000 Views', price: 750, duration: '5-7 days', features: JSON.stringify(['5000+ Real Views', '100% Safe', 'High Retention']), popular: false },
        { serviceId: services[0].id, name: 'Growth Booster', quantity: '10000 Views', price: 1500, duration: '7-10 days', features: JSON.stringify(['10000+ Real Views', 'Priority Support']), popular: true },
        { serviceId: services[0].id, name: 'Pro Package', quantity: '20000 Views', price: 2600, duration: '10-14 days', features: JSON.stringify(['20000+ Real Views', 'Premium Quality']), popular: false }
      );
      
      // Subscriber packages
      pricingPlans.push(
        { serviceId: services[1].id, name: 'Bronze Community', quantity: '100 Subscribers', price: 500, duration: '3-5 days', features: JSON.stringify(['100 Real Subscribers', 'Permanent']), popular: false },
        { serviceId: services[1].id, name: 'Silver Growth', quantity: '500 Subscribers', price: 2000, duration: '7-10 days', features: JSON.stringify(['500 Real Subscribers', 'High Quality']), popular: true },
        { serviceId: services[1].id, name: 'Gold Authority', quantity: '1000 Subscribers', price: 3500, duration: '10-15 days', features: JSON.stringify(['1000 Real Subscribers', 'Premium']), popular: false }
      );

      // SEO packages
      pricingPlans.push(
        { serviceId: services[2].id, name: 'Basic SEO', quantity: '5 Videos', price: 1000, duration: '3-5 days', features: JSON.stringify(['Title Optimization', 'Tag Research']), popular: false },
        { serviceId: services[2].id, name: 'Advanced SEO', quantity: '10 Videos', price: 1800, duration: '5-7 days', features: JSON.stringify(['Complete Optimization', 'Competitor Analysis']), popular: true }
      );

      // Monetization packages
      pricingPlans.push(
        { serviceId: services[3].id, name: 'Fast Track', quantity: '1000 Hours + 1K Subs', price: 8000, duration: '20-30 days', features: JSON.stringify(['Meet YPP Requirements', '100% Safe']), popular: true },
        { serviceId: services[3].id, name: 'Elite Package', quantity: '2000 Hours + 2K Subs', price: 16000, duration: '30-40 days', features: JSON.stringify(['Double Requirements', 'Premium Support']), popular: false }
      );

      // Engagement packages
      pricingPlans.push(
        { serviceId: services[4].id, name: 'Starter Engagement', quantity: '500 Likes + 50 Comments', price: 800, duration: '3-5 days', features: JSON.stringify(['Real Engagement', 'Organic Growth']), popular: false },
        { serviceId: services[4].id, name: 'Pro Engagement', quantity: '1000 Likes + 100 Comments', price: 1500, duration: '5-7 days', features: JSON.stringify(['High Quality', 'Boost Algorithm']), popular: true },
        { serviceId: services[4].id, name: 'Ultimate Engagement', quantity: '2000 Likes + 200 Comments', price: 2800, duration: '7-10 days', features: JSON.stringify(['Maximum Impact', 'Premium Quality']), popular: false }
      );

      await Pricing.bulkCreate(pricingPlans);
      console.log('✅ Created 13 pricing plans');
    }

    // ============================================
    // 4. CREATE PORTFOLIO ITEMS
    // ============================================
    console.log('Creating portfolio items...');
    
    // Check if portfolio items already exist
    const existingPortfolioCount = await Portfolio.count();
    
    if (existingPortfolioCount > 0) {
      console.log('✅ Portfolio items already exist, skipping...');
    } else {
      await Portfolio.bulkCreate([
        {
          title: 'Gaming Channel Success',
          clientName: 'TechGamer Pro',
          category: 'gaming',
          description: 'Helped gaming channel reach 100K subscribers in 6 months',
          beforeStats: JSON.stringify({ subscribers: '5K', views: '50K', watchTime: '500 hours' }),
          afterStats: JSON.stringify({ subscribers: '100K', views: '2M', watchTime: '10K hours' }),
          testimonial: 'TubeBirds helped us grow exponentially! Highly recommended.',
          image: '/images/portfolio/gaming.jpg',
          featured: true
        },
        {
          title: 'Cooking Channel Growth',
          clientName: 'Chef Delights',
          category: 'cooking',
          description: 'Monetized cooking channel in just 3 months',
          beforeStats: JSON.stringify({ subscribers: '200', views: '10K', watchTime: '100 hours' }),
          afterStats: JSON.stringify({ subscribers: '1.5K', views: '150K', watchTime: '4K hours' }),
          testimonial: 'Professional service with amazing results!',
          image: '/images/portfolio/cooking.jpg',
          featured: true
        },
        {
          title: 'Tech Review Success',
          clientName: 'TechReview Hub',
          category: 'tech',
          description: 'Boosted tech review channel to 50K subscribers',
          beforeStats: JSON.stringify({ subscribers: '2K', views: '100K', watchTime: '1K hours' }),
          afterStats: JSON.stringify({ subscribers: '50K', views: '1.5M', watchTime: '15K hours' }),
          testimonial: 'Best investment for my YouTube channel!',
          image: '/images/portfolio/tech.jpg',
          featured: false
        }
      ]);
      console.log('✅ Created 3 portfolio items');
    }

    console.log('🎉 Database seeded successfully!');

    res.status(200).json({
      status: 'success',
      message: 'Database seeded successfully! 🎉',
      data: {
        admin: {
          email: 'tubebirdspromotion@gmail.com',
          password: 'Vishal8081@#$',
          note: 'Use these credentials to login to admin dashboard'
        },
        created: {
          services: services.length,
          pricingPlans: pricingPlans.length,
          portfolioItems: 3
        },
        nextSteps: [
          'Login at: https://tube-birds.netlify.app/login',
          'Email: tubebirdspromotion@gmail.com',
          'Password: Vishal8081@#$'
        ]
      }
    });

  } catch (error) {
    console.error('❌ Seed error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to seed database',
      error: error.message
    });
  }
});

// @desc    Check seed status
// @route   GET /api/seed/status
// @access  Public
router.get('/status', async (req, res) => {
  try {
    const adminExists = await User.findOne({ 
      where: { email: 'tubebirdspromotion@gmail.com' } 
    });
    
    const servicesCount = await Service.count();
    const pricingCount = await Pricing.count();
    const portfolioCount = await Portfolio.count();

    res.status(200).json({
      status: 'success',
      data: {
        isSeeded: !!adminExists,
        counts: {
          services: servicesCount,
          pricingPlans: pricingCount,
          portfolioItems: portfolioCount
        },
        adminExists: !!adminExists
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;
