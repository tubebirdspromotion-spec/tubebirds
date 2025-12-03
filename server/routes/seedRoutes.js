import express from 'express';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Pricing from '../models/Pricing.js';
import Portfolio from '../models/Portfolio.js';
import { protect, authorize } from '../middleware/auth.js';
import '../models/index.js'; // Load model associations

const router = express.Router();

// @desc    Sync pricing plans only (Update/Insert)
// @route   POST /api/seed/sync-pricing
// @access  Private/Admin
router.post('/sync-pricing', protect, authorize('admin'), async (req, res) => {
  try {
    console.log('🔄 Syncing pricing plans...');

    // Get or create YouTube Views service
    let viewService = await Service.findOne({ where: { slug: 'youtube-views' } });
    if (!viewService) {
      viewService = await Service.create({
        title: 'YouTube Views',
        slug: 'youtube-views',
        description: 'Boost your video visibility with real, high-retention YouTube views from genuine users. Our view packages help increase your video\'s reach, improve search rankings, and attract more organic traffic to your content.',
        shortDescription: 'Boost your video visibility with real, high-retention YouTube views',
        icon: 'FaEye',
        features: JSON.stringify(['Real users, not bots', 'High retention rate (60-95%)', 'Gradual delivery for safety', '24/7 customer support', 'Money-back guarantee']),
        benefits: JSON.stringify(['Improve video ranking', 'Increase organic reach', 'Build social proof', 'Boost credibility']),
        category: 'youtube',
        order: 1,
        isActive: true,
        isFeatured: true
      });
      console.log('✅ Created YouTube Views service');
    } else {
      console.log('✅ YouTube Views service already exists');
    }

    // Pricing plans to sync (matches frontend)
    const pricingData = [
      {
        planName: 'Starter Views',
        quantity: '5,000+ Views',
        price: 750,
        originalPrice: 1500,
        discount: 50,
        deliveryTime: '5-7 days',
        features: JSON.stringify(['5,000+ Real YouTube Views', '100% Safe & Organic', 'Gradual Delivery (Natural Growth)', 'No Password Required', 'Retention Rate: 60-80%', 'Start Time: 12-24 Hours', 'Completion: 5-7 Days', '24/7 Customer Support']),
        isPopular: false,
        order: 1
      },
      {
        planName: 'Growth Booster',
        quantity: '10,000+ Views',
        price: 1500,
        originalPrice: 3000,
        discount: 50,
        deliveryTime: '7-10 days',
        features: JSON.stringify(['10,000+ Real YouTube Views', '100% Safe & Organic', 'Natural Delivery Pattern', 'High Retention Rate: 70-85%', 'Boost Search Rankings', 'Start Time: 6-12 Hours', 'Completion: 7-10 Days', 'Priority Support']),
        isPopular: true,
        order: 2
      },
      {
        planName: 'Pro Package',
        quantity: '20,000+ Views',
        price: 2600,
        originalPrice: 5200,
        discount: 50,
        deliveryTime: '10-14 days',
        features: JSON.stringify(['20,000+ Real YouTube Views', 'Premium Quality Views', 'High Retention: 75-90%', 'Faster Delivery', 'Improved Channel Authority', 'Start Time: 3-6 Hours', 'Completion: 10-14 Days', 'Dedicated Account Manager']),
        isPopular: false,
        order: 3
      },
      {
        planName: 'Elite Package',
        quantity: '50,000+ Views',
        price: 5500,
        originalPrice: 11000,
        discount: 50,
        deliveryTime: '14-20 days',
        features: JSON.stringify(['50,000+ Real YouTube Views', 'Premium Elite Quality', 'Maximum Retention: 80-95%', 'Rapid Delivery', 'Massive Reach Expansion', 'Viral Potential Boost', 'Start Time: 1-3 Hours', 'Completion: 14-20 Days']),
        isPopular: true,
        order: 4
      },
      {
        planName: 'Mega Viral',
        quantity: '1 Lakh+ Views',
        price: 10000,
        originalPrice: 20000,
        discount: 50,
        deliveryTime: '20-30 days',
        features: JSON.stringify(['1,00,000+ Real YouTube Views', 'Ultra Premium Quality', 'Extreme Retention: 85-98%', 'Express Delivery', 'Trending Page Potential', 'Algorithm Boost', 'Start Time: Instant', 'Completion: 20-30 Days']),
        isPopular: false,
        order: 5
      }
    ];

    let created = 0;
    let updated = 0;

    for (const planData of pricingData) {
      const [plan, wasCreated] = await Pricing.findOrCreate({
        where: { 
          serviceId: viewService.id,
          planName: planData.planName 
        },
        defaults: {
          ...planData,
          serviceId: viewService.id,
          category: 'youtube-views'
        }
      });

      if (!wasCreated) {
        // Update existing plan
        await plan.update(planData);
        updated++;
      } else {
        created++;
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Pricing plans synced successfully',
      data: {
        service: viewService.name,
        created,
        updated,
        total: created + updated
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
