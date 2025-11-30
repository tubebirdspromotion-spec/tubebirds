import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Pricing from '../models/Pricing.js';
import Portfolio from '../models/Portfolio.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@tubebirds.com' });
    
    if (adminExists) {
      console.log('⚠️  Admin user already exists');
      return;
    }

    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'Admin User',
      email: process.env.ADMIN_EMAIL || 'admin@tubebirds.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin',
      phone: '9999999999',
      isVerified: true,
      isActive: true
    });

    console.log('✅ Admin user created successfully');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
  }
};

const seedServices = async () => {
  try {
    const servicesCount = await Service.countDocuments();
    
    if (servicesCount > 0) {
      console.log('⚠️  Services already exist');
      return;
    }

    const services = [
      {
        title: 'YouTube Video Promotion',
        slug: 'youtube-video-promotion',
        shortDescription: 'Get real organic views, likes, and engagement for your YouTube videos',
        description: 'Our YouTube Video Promotion service helps you reach a wider audience through organic marketing strategies. We use proven techniques to boost your video visibility and engagement.',
        icon: 'FaYoutube',
        features: [
          'Real organic views from genuine users',
          'Targeted audience based on niche',
          'Increase in watch time',
          'Better video ranking',
          'Detailed analytics report'
        ],
        benefits: [
          'Boost video visibility',
          'Increase engagement rate',
          'Grow your subscriber base',
          'Improve search rankings'
        ],
        order: 1
      },
      {
        title: 'YouTube Video SEO',
        slug: 'youtube-video-seo',
        shortDescription: 'Optimize your videos for better search rankings and visibility',
        description: 'Expert YouTube SEO services to help your videos rank higher in YouTube search and suggested videos. We optimize titles, descriptions, tags, and more.',
        icon: 'FaSearch',
        features: [
          'Keyword research and optimization',
          'Title and description optimization',
          'Tag optimization',
          'Thumbnail optimization tips',
          'Competitor analysis'
        ],
        benefits: [
          'Higher search rankings',
          'More organic traffic',
          'Better CTR',
          'Increased discoverability'
        ],
        order: 2
      },
      {
        title: 'YouTube Video Monetization',
        slug: 'youtube-video-monetisation',
        shortDescription: 'Fast-track your channel to monetization with our proven methods',
        description: 'Get your channel monetized quickly with our comprehensive monetization service. We help you meet YouTube Partner Program requirements.',
        icon: 'FaDollarSign',
        features: [
          '4000 watch hours assistance',
          '1000 subscribers growth',
          'Content strategy guidance',
          'Policy compliance check',
          'Monetization application support'
        ],
        benefits: [
          'Quick monetization eligibility',
          'Genuine subscribers and views',
          'Long-term channel growth',
          'Revenue generation'
        ],
        order: 3
      },
      {
        title: 'Google Ads Services',
        slug: 'google-ads-services',
        shortDescription: 'Professional Google Ads campaign management for maximum ROI',
        description: 'Drive targeted traffic to your videos or website with expertly managed Google Ads campaigns. We optimize for maximum conversions at minimum cost.',
        icon: 'FaGoogle',
        features: [
          'Campaign setup and optimization',
          'Keyword research',
          'Ad copy creation',
          'A/B testing',
          'Performance tracking'
        ],
        benefits: [
          'Targeted audience reach',
          'Cost-effective advertising',
          'Measurable results',
          'Professional management'
        ],
        order: 4
      },
      {
        title: 'Website Development Services',
        slug: 'website-development-services',
        shortDescription: 'Custom website development for businesses and content creators',
        description: 'Professional website development services tailored to your needs. From simple landing pages to complex web applications.',
        icon: 'FaCode',
        features: [
          'Responsive design',
          'SEO-friendly structure',
          'Fast loading speed',
          'Custom functionality',
          'Content management system'
        ],
        benefits: [
          'Professional online presence',
          'Better user experience',
          'Mobile-friendly design',
          'Easy content updates'
        ],
        order: 5
      },
      {
        title: 'Website SEO Services',
        slug: 'website-seo-services',
        shortDescription: 'Comprehensive SEO services to rank your website higher on Google',
        description: 'Boost your website rankings with our professional SEO services. We use white-hat techniques to improve your organic search visibility.',
        icon: 'FaChartLine',
        features: [
          'On-page SEO optimization',
          'Off-page SEO and link building',
          'Technical SEO audit',
          'Content optimization',
          'Monthly performance reports'
        ],
        benefits: [
          'Higher Google rankings',
          'Increased organic traffic',
          'Better conversion rates',
          'Long-term results'
        ],
        order: 6
      }
    ];

    await Service.insertMany(services);
    console.log('✅ Services seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding services:', error.message);
  }
};

const seedPricing = async () => {
  try {
    const pricingCount = await Pricing.countDocuments();
    
    if (pricingCount > 0) {
      console.log('⚠️  Pricing plans already exist');
      return;
    }

    const pricingPlans = [
      // YouTube Views Plans
      {
        planName: 'Starter Views',
        category: 'views',
        price: 499,
        originalPrice: 999,
        discount: 50,
        quantity: '1000 Views',
        features: [
          '1000 Real YouTube Views',
          'Organic and Safe',
          'Gradual Delivery',
          '7-10 Days Delivery',
          'No Password Required'
        ],
        deliveryTime: '7-10 days',
        order: 1
      },
      {
        planName: 'Professional Views',
        category: 'views',
        price: 1999,
        originalPrice: 3999,
        discount: 50,
        quantity: '5000 Views',
        features: [
          '5000 Real YouTube Views',
          'Organic and Safe',
          'High Retention Views',
          '10-15 Days Delivery',
          'Priority Support'
        ],
        isPopular: true,
        deliveryTime: '10-15 days',
        order: 2
      },
      {
        planName: 'Premium Views',
        category: 'views',
        price: 3499,
        originalPrice: 6999,
        discount: 50,
        quantity: '10000 Views',
        features: [
          '10000 Real YouTube Views',
          'Premium Quality Views',
          'Targeted Audience',
          '15-20 Days Delivery',
          'Dedicated Manager'
        ],
        deliveryTime: '15-20 days',
        order: 3
      },
      
      // YouTube Subscribers Plans
      {
        planName: 'Starter Subscribers',
        category: 'subscribers',
        price: 999,
        originalPrice: 1999,
        discount: 50,
        quantity: '100 Subscribers',
        features: [
          '100 Real Subscribers',
          'Organic Growth',
          'Active Users',
          '7-10 Days Delivery',
          'Lifetime Support'
        ],
        deliveryTime: '7-10 days',
        order: 4
      },
      {
        planName: 'Growth Subscribers',
        category: 'subscribers',
        price: 2999,
        originalPrice: 5999,
        discount: 50,
        quantity: '500 Subscribers',
        features: [
          '500 Real Subscribers',
          'High Retention Rate',
          'Niche Targeted',
          '10-15 Days Delivery',
          'Priority Support'
        ],
        isPopular: true,
        deliveryTime: '10-15 days',
        order: 5
      },
      {
        planName: 'Pro Subscribers',
        category: 'subscribers',
        price: 4999,
        originalPrice: 9999,
        discount: 50,
        quantity: '1000 Subscribers',
        features: [
          '1000 Real Subscribers',
          'Premium Quality',
          'Engaged Audience',
          '15-20 Days Delivery',
          'Dedicated Manager'
        ],
        deliveryTime: '15-20 days',
        order: 6
      },
      
      // Monetization Plans
      {
        planName: 'Basic Monetization',
        category: 'monetization',
        price: 9999,
        originalPrice: 19999,
        discount: 50,
        quantity: '1000 Subscribers + 4000 Watch Hours',
        features: [
          '1000 Real Subscribers',
          '4000 Watch Hours',
          'Organic Growth',
          '30-45 Days Delivery',
          'Monetization Support'
        ],
        deliveryTime: '30-45 days',
        order: 7
      },
      {
        planName: 'Premium Monetization',
        category: 'monetization',
        price: 14999,
        originalPrice: 29999,
        discount: 50,
        quantity: '1500 Subscribers + 6000 Watch Hours',
        features: [
          '1500 Real Subscribers',
          '6000 Watch Hours',
          'Fast Track Growth',
          '25-35 Days Delivery',
          'Priority Support',
          'Application Assistance'
        ],
        isPopular: true,
        deliveryTime: '25-35 days',
        order: 8
      },
      
      // Revenue Plans
      {
        planName: 'Revenue Booster',
        category: 'revenue',
        price: 19999,
        originalPrice: 39999,
        discount: 50,
        quantity: 'Complete Channel Growth Package',
        features: [
          '2000+ Subscribers',
          '10000+ Watch Hours',
          'SEO Optimization',
          'Content Strategy',
          'Monetization + Revenue Growth',
          '3 Months Support'
        ],
        deliveryTime: '45-60 days',
        order: 9
      }
    ];

    await Pricing.insertMany(pricingPlans);
    console.log('✅ Pricing plans seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding pricing:', error.message);
  }
};

const seedPortfolio = async () => {
  try {
    const portfolioCount = await Portfolio.countDocuments();
    
    if (portfolioCount > 0) {
      console.log('⚠️  Portfolio items already exist');
      return;
    }

    const portfolioItems = [
      // Reports
      {
        type: 'report',
        title: 'Tech Channel Growth - 500K Views',
        clientName: 'TechGuru Channel',
        serviceName: 'YouTube Video Promotion',
        beforeStats: {
          views: 50000,
          subscribers: 1200,
          engagement: 2.5
        },
        afterStats: {
          views: 550000,
          subscribers: 8500,
          engagement: 5.8
        },
        description: 'Successfully promoted tech review videos resulting in 10x view growth and 7x subscriber increase.',
        isFeatured: true,
        order: 1
      },
      {
        type: 'report',
        title: 'Cooking Channel Monetization',
        clientName: 'Chef\'s Kitchen',
        serviceName: 'YouTube Monetization',
        beforeStats: {
          views: 2500,
          subscribers: 450,
          engagement: 3.2
        },
        afterStats: {
          views: 120000,
          subscribers: 1850,
          engagement: 6.5
        },
        description: 'Helped achieve monetization requirements and establish sustainable revenue stream.',
        isFeatured: true,
        order: 2
      },
      
      // Reviews
      {
        type: 'review',
        customerName: 'Rahul Sharma',
        customerAvatar: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=4F46E5&color=fff',
        rating: 5,
        review: 'Excellent service! Got my channel monetized in just 35 days. The team was very professional and supportive throughout the process. Highly recommended!',
        platform: 'google',
        isFeatured: true,
        order: 3
      },
      {
        type: 'review',
        customerName: 'Priya Patel',
        customerAvatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=EC4899&color=fff',
        rating: 5,
        review: 'Best YouTube promotion service in India! My views increased by 300% within 2 weeks. Real organic traffic and great customer support.',
        platform: 'google',
        isFeatured: true,
        order: 4
      },
      {
        type: 'review',
        customerName: 'Amit Kumar',
        customerAvatar: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=10B981&color=fff',
        rating: 5,
        review: 'Very satisfied with the SEO service. My videos now rank on first page for target keywords. Professional team and timely delivery.',
        platform: 'trustpilot',
        isFeatured: true,
        order: 5
      },
      {
        type: 'review',
        customerName: 'Sneha Reddy',
        customerAvatar: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=F59E0B&color=fff',
        rating: 5,
        review: 'Outstanding results! Gained 1500+ real subscribers in 20 days. The growth was organic and sustainable. Thank you TubeBirds!',
        platform: 'facebook',
        order: 6
      }
    ];

    await Portfolio.insertMany(portfolioItems);
    console.log('✅ Portfolio items seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding portfolio:', error.message);
  }
};

const seedDatabase = async () => {
  await connectDB();

  console.log('\n🌱 Starting database seeding...\n');

  await seedAdmin();
  await seedServices();
  await seedPricing();
  await seedPortfolio();

  console.log('\n✅ Database seeding completed!\n');
  
  console.log('📝 Default Admin Credentials:');
  console.log(`   Email: ${process.env.ADMIN_EMAIL || 'admin@tubebirds.com'}`);
  console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
  console.log('\n⚠️  Please change the admin password after first login!\n');

  process.exit(0);
};

seedDatabase();
