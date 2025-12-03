import { connectDB, sequelize } from '../config/db.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Pricing from '../models/Pricing.js';
import Portfolio from '../models/Portfolio.js';
import '../models/index.js'; // Load associations

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seed...\n');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await sequelize.sync({ force: true });
    console.log('✅ Database cleared and tables recreated\n');

    // ============================================
    // 1. CREATE ADMIN USER
    // ============================================
    const admin = await User.create({
      name: 'Admin User',
      email: 'tubebirdspromotion@gmail.com',
      password: 'Vishal8081@#$',
      phone: '9876543210',
      role: 'admin',
      isVerified: true,
      isActive: true
    });
    console.log('✅ Admin user created:', admin.email);

    // ============================================
    // 2. CREATE SAMPLE SERVICES
    // ============================================
    const services = await Service.bulkCreate([
      {
        name: 'YouTube Views',
        slug: 'youtube-views',
        category: 'youtube',
        description: 'Boost your video visibility with real, high-retention YouTube views',
        fullDescription: '<p>Get genuine YouTube views from real users to increase your video\'s reach and engagement. Our views are 100% real and come with high retention rates.</p><ul><li>Real users, not bots</li><li>High retention rate</li><li>Gradual delivery</li><li>Safe and secure</li></ul>',
        features: JSON.stringify(['Real users', 'High retention', 'Gradual delivery', 'Money-back guarantee']),
        benefits: JSON.stringify(['Improve video ranking', 'Increase organic reach', 'Build social proof', 'Boost credibility']),
        icon: 'eye',
        image: '/images/services/youtube-views.jpg',
        metaTitle: 'Buy YouTube Views - Real & High Retention | TubeBirds',
        metaDescription: 'Increase your YouTube video views with real users. Safe, gradual delivery. Money-back guarantee.',
        metaKeywords: 'youtube views, buy views, video views, youtube promotion',
        order: 1,
        isActive: true,
        isFeatured: true
      },
      {
        name: 'YouTube Subscribers',
        slug: 'youtube-subscribers',
        category: 'youtube',
        description: 'Grow your channel with genuine YouTube subscribers',
        fullDescription: '<p>Build a loyal subscriber base with real YouTube users interested in your content.</p><ul><li>Real subscribers</li><li>Permanent subscriptions</li><li>No password required</li><li>Safe delivery</li></ul>',
        features: JSON.stringify(['Real subscribers', 'Permanent', 'Safe', 'No password needed']),
        benefits: JSON.stringify(['Grow channel authority', 'Unlock monetization', 'Increase engagement', 'Build community']),
        icon: 'users',
        image: '/images/services/youtube-subscribers.jpg',
        metaTitle: 'Buy YouTube Subscribers - Real & Permanent | TubeBirds',
        metaDescription: 'Get genuine YouTube subscribers. Safe, permanent, no password required.',
        metaKeywords: 'youtube subscribers, buy subscribers, grow youtube channel',
        order: 2,
        isActive: true,
        isFeatured: true
      },
      {
        name: 'YouTube Likes',
        slug: 'youtube-likes',
        category: 'youtube',
        description: 'Get real likes on your YouTube videos to boost engagement',
        fullDescription: '<p>Enhance your video\'s credibility with authentic YouTube likes from real users.</p>',
        features: JSON.stringify(['Real likes', 'Instant delivery', 'Safe', 'High quality']),
        benefits: JSON.stringify(['Improve engagement rate', 'Attract more viewers', 'Build trust', 'Boost video ranking']),
        icon: 'thumbs-up',
        image: '/images/services/youtube-likes.jpg',
        metaTitle: 'Buy YouTube Likes - Real Engagement | TubeBirds',
        metaDescription: 'Boost your video with real YouTube likes. Safe and instant delivery.',
        metaKeywords: 'youtube likes, buy likes, video engagement',
        order: 3,
        isActive: true,
        isFeatured: false
      },
      {
        name: 'YouTube Watch Time',
        slug: 'youtube-watch-time',
        category: 'youtube',
        description: 'Increase your channel watch time for monetization',
        fullDescription: '<p>Meet YouTube\'s monetization requirements with genuine watch time hours.</p>',
        features: JSON.stringify(['Real watch time', 'High retention', 'Safe delivery', 'Monetization ready']),
        benefits: JSON.stringify(['Meet YPP requirements', 'Enable monetization', 'Improve ranking', 'Organic growth']),
        icon: 'clock',
        image: '/images/services/youtube-watch-time.jpg',
        metaTitle: 'Buy YouTube Watch Time - Monetization Ready | TubeBirds',
        metaDescription: 'Get real YouTube watch time hours. Meet monetization requirements safely.',
        metaKeywords: 'youtube watch time, watch hours, monetization, YPP',
        order: 4,
        isActive: true,
        isFeatured: true
      },
      {
        name: 'YouTube Comments',
        slug: 'youtube-comments',
        category: 'youtube',
        description: 'Get engaging comments on your YouTube videos',
        fullDescription: '<p>Add genuine, relevant comments to your videos to boost engagement and discussion.</p>',
        features: JSON.stringify(['Custom comments', 'Real users', 'Relevant', 'Natural']),
        benefits: JSON.stringify(['Boost engagement', 'Start discussions', 'Improve ranking', 'Build community']),
        icon: 'message-circle',
        image: '/images/services/youtube-comments.jpg',
        metaTitle: 'Buy YouTube Comments - Engaging & Real | TubeBirds',
        metaDescription: 'Get custom YouTube comments from real users. Boost engagement naturally.',
        metaKeywords: 'youtube comments, buy comments, video engagement',
        order: 5,
        isActive: true,
        isFeatured: false
      }
    ]);
    console.log(`✅ Created ${services.length} services\n`);

    // ============================================
    // 3. CREATE PRICING PLANS
    // ============================================
    const pricingPlans = [];
    
    // YouTube Views Pricing - Matches Frontend
    const viewService = services.find(s => s.slug === 'youtube-views');
    pricingPlans.push(...await Pricing.bulkCreate([
      {
        serviceId: viewService.id,
        planName: 'Starter Views',
        quantity: '5,000+ Views',
        price: 750,
        originalPrice: 1500,
        discount: 50,
        category: 'youtube-views',
        deliveryTime: '5-7 days',
        features: JSON.stringify(['5,000+ Real YouTube Views', '100% Safe & Organic', 'Gradual Delivery (Natural Growth)', 'No Password Required', 'Retention Rate: 60-80%', 'Start Time: 12-24 Hours', 'Completion: 5-7 Days', '24/7 Customer Support']),
        isPopular: false,
        order: 1
      },
      {
        serviceId: viewService.id,
        planName: 'Growth Booster',
        quantity: '10,000+ Views',
        price: 1500,
        originalPrice: 3000,
        discount: 50,
        category: 'youtube-views',
        deliveryTime: '7-10 days',
        features: JSON.stringify(['10,000+ Real YouTube Views', '100% Safe & Organic', 'Natural Delivery Pattern', 'High Retention Rate: 70-85%', 'Boost Search Rankings', 'Start Time: 6-12 Hours', 'Completion: 7-10 Days', 'Priority Support']),
        isPopular: true,
        order: 2
      },
      {
        serviceId: viewService.id,
        planName: 'Pro Package',
        quantity: '20,000+ Views',
        price: 2600,
        originalPrice: 5200,
        discount: 50,
        category: 'youtube-views',
        deliveryTime: '10-14 days',
        features: JSON.stringify(['20,000+ Real YouTube Views', 'Premium Quality Views', 'High Retention: 75-90%', 'Faster Delivery', 'Improved Channel Authority', 'Start Time: 3-6 Hours', 'Completion: 10-14 Days', 'Dedicated Account Manager']),
        isPopular: false,
        order: 3
      },
      {
        serviceId: viewService.id,
        planName: 'Elite Package',
        quantity: '50,000+ Views',
        price: 5500,
        originalPrice: 11000,
        discount: 50,
        category: 'youtube-views',
        deliveryTime: '14-20 days',
        features: JSON.stringify(['50,000+ Real YouTube Views', 'Premium Elite Quality', 'Maximum Retention: 80-95%', 'Rapid Delivery', 'Massive Reach Expansion', 'Viral Potential Boost', 'Start Time: 1-3 Hours', 'Completion: 14-20 Days']),
        isPopular: true,
        order: 4
      },
      {
        serviceId: viewService.id,
        planName: 'Mega Viral',
        quantity: '1 Lakh+ Views',
        price: 10000,
        originalPrice: 20000,
        discount: 50,
        category: 'youtube-views',
        deliveryTime: '20-30 days',
        features: JSON.stringify(['1,00,000+ Real YouTube Views', 'Ultra Premium Quality', 'Extreme Retention: 85-98%', 'Express Delivery', 'Trending Page Potential', 'Algorithm Boost', 'Start Time: Instant', 'Completion: 20-30 Days']),
        isPopular: false,
        order: 5
      }
    ]));

    // YouTube Subscribers Pricing
    const subsService = services.find(s => s.slug === 'youtube-subscribers');
    pricingPlans.push(...await Pricing.bulkCreate([
      {
        serviceId: subsService.id,
        planName: 'Starter Pack',
        quantity: '100 Subscribers',
        price: 599,
        originalPrice: 999,
        discount: 40,
        category: 'youtube-subscribers',
        deliveryTime: '3-5 days',
        features: JSON.stringify(['Real subscribers', 'Permanent', 'No password', 'Safe delivery']),
        isPopular: false,
        order: 1
      },
      {
        serviceId: subsService.id,
        planName: 'Growth Pack',
        quantity: '500 Subscribers',
        price: 2799,
        originalPrice: 4499,
        discount: 38,
        category: 'youtube-subscribers',
        deliveryTime: '5-7 days',
        features: JSON.stringify(['Real subscribers', 'Permanent', 'No password', 'Safe delivery', 'Priority support']),
        isPopular: true,
        order: 2
      },
      {
        serviceId: subsService.id,
        planName: 'Pro Pack',
        quantity: '1000 Subscribers',
        price: 4999,
        originalPrice: 7999,
        discount: 38,
        category: 'youtube-subscribers',
        deliveryTime: '7-10 days',
        features: JSON.stringify(['Real subscribers', 'Permanent', 'No password', 'Safe delivery', 'Priority support', 'Refill guarantee']),
        isPopular: false,
        order: 3
      }
    ]));

    // YouTube Likes Pricing
    const likesService = services.find(s => s.slug === 'youtube-likes');
    pricingPlans.push(...await Pricing.bulkCreate([
      {
        serviceId: likesService.id,
        planName: 'Basic Likes',
        quantity: '500 Likes',
        price: 199,
        originalPrice: 399,
        discount: 50,
        category: 'youtube-likes',
        deliveryTime: '1-2 days',
        features: JSON.stringify(['Real likes', 'Instant start', 'Safe', 'High quality']),
        isPopular: false,
        order: 1
      },
      {
        serviceId: likesService.id,
        planName: 'Standard Likes',
        quantity: '2000 Likes',
        price: 699,
        originalPrice: 1299,
        discount: 46,
        category: 'youtube-likes',
        deliveryTime: '2-3 days',
        features: JSON.stringify(['Real likes', 'Instant start', 'Safe', 'High quality', 'Priority processing']),
        isPopular: true,
        order: 2
      }
    ]));

    // Watch Time Pricing
    const watchService = services.find(s => s.slug === 'youtube-watch-time');
    pricingPlans.push(...await Pricing.bulkCreate([
      {
        serviceId: watchService.id,
        planName: 'Monetization Starter',
        quantity: '1000 Hours',
        price: 3999,
        originalPrice: 6999,
        discount: 43,
        category: 'youtube-watch-time',
        deliveryTime: '10-15 days',
        features: JSON.stringify(['Real watch time', 'High retention', 'Monetization ready', 'Safe delivery']),
        isPopular: false,
        order: 1
      },
      {
        serviceId: watchService.id,
        planName: 'Monetization Pro',
        quantity: '4000 Hours',
        price: 14999,
        originalPrice: 24999,
        discount: 40,
        category: 'youtube-watch-time',
        deliveryTime: '20-30 days',
        features: JSON.stringify(['Real watch time', 'High retention', 'Monetization ready', 'Safe delivery', 'Priority support', 'YPP guaranteed']),
        isPopular: true,
        order: 2
      }
    ]));

    console.log(`✅ Created ${pricingPlans.length} pricing plans\n`);

    // ============================================
    // 4. CREATE PORTFOLIO ITEMS
    // ============================================
    const portfolioItems = await Portfolio.bulkCreate([
      {
        title: 'Tech Review Channel - 100K Subscribers Growth',
        type: 'report',
        category: 'youtube-subscribers',
        description: 'Helped a tech review channel grow from 5K to 105K subscribers in 6 months',
        image: '/images/portfolio/tech-channel.jpg',
        images: JSON.stringify(['/images/portfolio/tech-1.jpg', '/images/portfolio/tech-2.jpg']),
        clientName: 'TechGenius',
        videoUrl: 'https://youtube.com/sample',
        stats: JSON.stringify({
          beforeSubscribers: '5,000',
          afterSubscribers: '105,000',
          growthRate: '2000%',
          timeframe: '6 months'
        }),
        order: 1,
        isActive: true,
        isFeatured: true
      },
      {
        title: 'Gaming Channel - 1M Views Achievement',
        type: 'report',
        category: 'youtube-views',
        description: 'Boosted video views from 10K to 1M+ with targeted view campaigns',
        image: '/images/portfolio/gaming-channel.jpg',
        images: JSON.stringify(['/images/portfolio/gaming-1.jpg', '/images/portfolio/gaming-2.jpg']),
        clientName: 'ProGamer',
        videoUrl: 'https://youtube.com/sample2',
        stats: JSON.stringify({
          beforeViews: '10,000',
          afterViews: '1,000,000+',
          engagement: '+350%',
          timeframe: '4 months'
        }),
        order: 2,
        isActive: true,
        isFeatured: true
      },
      {
        title: 'Cooking Channel - Monetization Success',
        type: 'review',
        category: 'youtube-watch-time',
        description: 'Achieved YouTube monetization requirements with 4000+ watch hours',
        image: '/images/portfolio/cooking-channel.jpg',
        images: JSON.stringify(['/images/portfolio/cooking-1.jpg']),
        clientName: 'ChefMaster',
        testimonial: 'TubeBirds helped me reach monetization in just 2 months! Highly recommended!',
        rating: 5,
        stats: JSON.stringify({
          watchHours: '4,500',
          subscribers: '1,200',
          monetized: 'Yes',
          timeframe: '2 months'
        }),
        order: 3,
        isActive: true,
        isFeatured: false
      }
    ]);
    console.log(`✅ Created ${portfolioItems.length} portfolio items\n`);

    console.log('🎉 Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: 1 (admin)`);
    console.log(`   - Services: ${services.length}`);
    console.log(`   - Pricing Plans: ${pricingPlans.length}`);
    console.log(`   - Portfolio Items: ${portfolioItems.length}\n`);
    
    console.log('🔐 Admin Login:');
    console.log('   Email: admin@tubebirdspromotion.com');
    console.log('   Password: Admin@123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
