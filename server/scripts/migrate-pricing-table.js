import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

import { sequelize } from '../config/db.js';
import Service from '../models/Service.js';

/**
 * Migration Script: Drop and Recreate Pricing Table
 * WARNING: This will delete all existing pricing data!
 * 
 * Run with: node server/scripts/migrate-pricing-table.js
 */

async function migratePricingTable() {
  try {
    console.log('🚀 Starting Pricing Table Migration...\n');

    // Step 1: Drop existing pricings table
    console.log('📋 Step 1: Dropping existing pricings table...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    await sequelize.query('DROP TABLE IF EXISTS pricings;');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('✅ Old pricings table dropped successfully\n');

    // Step 2: Create new pricings table with optimized structure
    console.log('📋 Step 2: Creating new pricings table...');
    await sequelize.query(`
      CREATE TABLE pricings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        serviceId INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        category ENUM('views', 'subscribers', 'monetization', 'revenue') NOT NULL,
        
        -- Pricing Details
        originalPrice DECIMAL(10, 2) NOT NULL COMMENT 'Original price before discount',
        discount INT DEFAULT 0 COMMENT 'Discount percentage (0-100)',
        price DECIMAL(10, 2) NOT NULL COMMENT 'Final price after discount',
        
        -- Plan Details
        quantity VARCHAR(100) NOT NULL COMMENT 'e.g., "5,000+ Views", "1,000 Hours"',
        deliveryTime VARCHAR(100) DEFAULT NULL COMMENT 'e.g., "5-7 Days"',
        startTime VARCHAR(100) DEFAULT NULL COMMENT 'e.g., "12-24 Hours"',
        retentionRate VARCHAR(50) DEFAULT NULL COMMENT 'e.g., "60-80%"',
        
        -- Plan Description
        description TEXT DEFAULT NULL COMMENT 'About this plan',
        features JSON DEFAULT NULL COMMENT 'Array of features included',
        
        -- Plan Metadata
        tier ENUM('starter', 'basic', 'growth', 'pro', 'elite', 'premium', 'ultimate') DEFAULT 'basic',
        isPopular BOOLEAN DEFAULT FALSE COMMENT 'Show "Most Popular" badge',
        displayOrder INT DEFAULT 0 COMMENT 'Order in listing (lower = first)',
        isActive BOOLEAN DEFAULT TRUE COMMENT 'Is plan available for purchase',
        
        -- Timestamps
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        -- Indexes
        INDEX idx_serviceId (serviceId),
        INDEX idx_category (category),
        INDEX idx_slug (slug),
        INDEX idx_price (price),
        INDEX idx_active (isActive),
        INDEX idx_popular (isPopular),
        
        -- Foreign Key
        FOREIGN KEY (serviceId) REFERENCES services(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ New pricings table created successfully\n');

    // Step 3: Get service IDs
    console.log('📋 Step 3: Fetching service IDs...');
    const services = await Service.findAll({
      attributes: ['id', 'slug', 'name']
    });
    
    const serviceMap = {};
    services.forEach(service => {
      serviceMap[service.slug] = service.id;
    });
    
    console.log('✅ Found services:', Object.keys(serviceMap).join(', '));
    console.log('');

    // Step 4: Seed new pricing data
    console.log('📋 Step 4: Seeding new pricing plans...\n');

    const pricingPlans = [
      // ========================================
      // YOUTUBE VIEWS
      // ========================================
      {
        serviceId: serviceMap['youtube-views'],
        name: 'Starter Views',
        slug: 'starter-views',
        category: 'views',
        originalPrice: 1500,
        discount: 50,
        price: 750,
        quantity: '5,000+ Views',
        deliveryTime: '5-7 Days',
        startTime: '12-24 Hours',
        retentionRate: '60-80%',
        description: 'Perfect for new creators looking to give their videos an initial boost. Our Starter Views package delivers 5,000+ genuine views from real users, helping your content gain initial traction and appear more credible to new viewers.',
        features: JSON.stringify([
          '5,000+ Real YouTube Views',
          '100% Safe & Organic',
          'Gradual Delivery (Natural Growth)',
          'Start Time: 12-24 Hours',
          'Completion: 5-7 Days',
          '24/7 Customer Support'
        ]),
        tier: 'starter',
        isPopular: false,
        displayOrder: 1,
        isActive: true
      },
      {
        serviceId: serviceMap['youtube-views'],
        name: 'Growth Booster',
        slug: 'growth-booster',
        category: 'views',
        originalPrice: 3000,
        discount: 50,
        price: 1500,
        quantity: '10,000+ Views',
        deliveryTime: '7-10 Days',
        startTime: '6-12 Hours',
        retentionRate: '70-85%',
        description: 'Our most popular package! Ideal for growing channels that want to increase visibility and credibility. 10,000 views significantly boost your video\'s performance in YouTube\'s algorithm.',
        features: JSON.stringify([
          '10,000+ Real YouTube Views',
          '100% Safe & Organic',
          'Natural Delivery Pattern',
          'Boost Search Rankings',
          'Start Time: 6-12 Hours',
          'Completion: 7-10 Days',
          'Priority Support'
        ]),
        tier: 'growth',
        isPopular: true,
        displayOrder: 2,
        isActive: true
      },
      {
        serviceId: serviceMap['youtube-views'],
        name: 'Pro Package',
        slug: 'pro-package-views',
        category: 'views',
        originalPrice: 5200,
        discount: 50,
        price: 2600,
        quantity: '20,000+ Views',
        deliveryTime: '10-14 Days',
        startTime: '3-6 Hours',
        retentionRate: '75-90%',
        description: 'Take your content to the next level with 20,000+ premium views. Perfect for established creators looking to accelerate growth and dominate their niche.',
        features: JSON.stringify([
          '20,000+ Real YouTube Views',
          'Premium Quality Views',
          'Faster Delivery',
          'Improved Channel Authority',
          'Start Time: 3-6 Hours',
          'Completion: 10-14 Days',
          'Dedicated Account Manager'
        ]),
        tier: 'pro',
        isPopular: false,
        displayOrder: 3,
        isActive: true
      },
      {
        serviceId: serviceMap['youtube-views'],
        name: 'Elite Package',
        slug: 'elite-package-views',
        category: 'views',
        originalPrice: 11000,
        discount: 50,
        price: 5500,
        quantity: '50,000+ Views',
        deliveryTime: '14-20 Days',
        startTime: '1-3 Hours',
        retentionRate: '80-95%',
        description: 'Our Elite package delivers massive visibility with 50,000+ high-quality views. Ideal for viral campaigns and channels serious about explosive growth.',
        features: JSON.stringify([
          '50,000+ Real YouTube Views',
          'Premium Elite Quality',
          'Rapid Delivery',
          'Viral Potential Boost',
          'Start Time: 1-3 Hours',
          'Completion: 14-20 Days'
        ]),
        tier: 'elite',
        isPopular: false,
        displayOrder: 4,
        isActive: true
      },
      {
        serviceId: serviceMap['youtube-views'],
        name: 'Mega Viral',
        slug: 'mega-viral',
        category: 'views',
        originalPrice: 20000,
        discount: 50,
        price: 10000,
        quantity: '1 Lakh+ Views',
        deliveryTime: '20-30 Days',
        startTime: 'Instant',
        retentionRate: '85-98%',
        description: 'Go viral with 1 lakh+ views! This package is designed to make your video trend and reach millions of potential viewers organically.',
        features: JSON.stringify([
          '1,00,000+ Real YouTube Views',
          'Ultra Premium Quality',
          'Lightning Fast Delivery',
          'Algorithm Optimization',
          'Start Time: Instant',
          'Completion: 20-30 Days'
        ]),
        tier: 'premium',
        isPopular: false,
        displayOrder: 5,
        isActive: true
      },
      {
        serviceId: serviceMap['youtube-views'],
        name: 'Ultimate Domination',
        slug: 'ultimate-domination-views',
        category: 'views',
        originalPrice: 160000,
        discount: 50,
        price: 80000,
        quantity: '10 Lakh+ Views',
        deliveryTime: '30-45 Days',
        startTime: 'Instant',
        retentionRate: '90-100%',
        description: 'The ultimate package for serious creators and businesses. 10 lakh+ views transforms your channel into a major authority in your niche with massive organic reach.',
        features: JSON.stringify([
          '10,00,000+ Real YouTube Views',
          'Absolute Premium Quality',
          'Maximum Speed Delivery',
          'Complete Channel Transformation',
          'Celebrity-Level Reach',
          'White-Glove Service & Support'
        ]),
        tier: 'ultimate',
        isPopular: false,
        displayOrder: 6,
        isActive: true
      },

      // ========================================
      // YOUTUBE MONETIZATION
      // ========================================
      {
        serviceId: serviceMap['youtube-monetization'],
        name: 'Starter Boost',
        slug: 'starter-boost-monetization',
        category: 'monetization',
        originalPrice: 4000,
        discount: 50,
        price: 2000,
        quantity: '200 Hours + 25-30K Views',
        deliveryTime: '10-15 Days',
        startTime: '24 Hours',
        retentionRate: '70-85%',
        description: 'Begin your monetization journey! This package provides 200 watch hours with 25–30K real views, giving you a strong foundation toward YouTube Partner Program eligibility.',
        features: JSON.stringify([
          '200 Watch Hours Guaranteed',
          '25,000–30,000 Real Views',
          '100% Safe & Organic',
          'Natural Watch Pattern',
          'Progress Towards Monetization',
          'Start Time: 24 Hours',
          'Completion: 10–15 Days'
        ]),
        tier: 'starter',
        isPopular: false,
        displayOrder: 1,
        isActive: true
      },
      {
        serviceId: serviceMap['youtube-monetization'],
        name: 'Growth Accelerator',
        slug: 'growth-accelerator-monetization',
        category: 'monetization',
        originalPrice: 9000,
        discount: 50,
        price: 4500,
        quantity: '500 Hours + 70-80K Views',
        deliveryTime: '15-20 Days',
        startTime: '12 Hours',
        retentionRate: '75-90%',
        description: 'Accelerate your channel growth! This package delivers 500 watch hours with 70–80K real views, putting you halfway toward monetization while ensuring premium-quality engagement.',
        features: JSON.stringify([
          '500 Watch Hours Guaranteed',
          '70,000–80,000 Real Views',
          'Premium Quality Views',
          'Faster Path to Monetization',
          'Algorithm-Friendly Growth',
          'Start Time: 12 Hours',
          'Completion: 15–20 Days'
        ]),
        tier: 'growth',
        isPopular: false,
        displayOrder: 2,
        isActive: true
      },
      {
        serviceId: serviceMap['youtube-monetization'],
        name: 'Pro Monetization',
        slug: 'pro-monetization',
        category: 'monetization',
        originalPrice: 17000,
        discount: 50,
        price: 8500,
        quantity: '1,000 Hours + 1.2-1.5L Views + 250 Subs',
        deliveryTime: '20-30 Days',
        startTime: '6 Hours',
        retentionRate: '80-95%',
        description: 'Complete monetization solution! This package fulfills the full 1,000-hour requirement and adds 250 real subscribers along with 1.2–1.5 lakh views for maximum channel impact.',
        features: JSON.stringify([
          '1,000 Watch Hours (Full Requirement!)',
          '1.2–1.5 Lakh Real Views',
          '250 Real Subscribers',
          'Complete Monetization Package',
          'Premium Quality Engagement',
          'Start Time: 6 Hours',
          'Completion: 20–30 Days'
        ]),
        tier: 'pro',
        isPopular: true,
        displayOrder: 3,
        isActive: true
      },
      {
        serviceId: serviceMap['youtube-monetization'],
        name: 'Elite Monetization',
        slug: 'elite-monetization',
        category: 'monetization',
        originalPrice: 32000,
        discount: 50,
        price: 16000,
        quantity: '2,000 Hours + 2.5-3L Views + 500 Subs',
        deliveryTime: '25-35 Days',
        startTime: '3 Hours',
        retentionRate: '85-98%',
        description: 'Go beyond basic monetization requirements! This package delivers 2,000 watch hours, 2.5–3 lakh real views, and 500 subscribers—ensuring long-term stability and protection against future drops.',
        features: JSON.stringify([
          '2,000 Watch Hours (2× Requirement!)',
          '2.5–3 Lakh Real Views',
          '500 Real Subscribers',
          'Premium Elite Package',
          'Rapid Channel Growth',
          'Start Time: 3 Hours',
          'Completion: 25–35 Days'
        ]),
        tier: 'elite',
        isPopular: false,
        displayOrder: 4,
        isActive: true
      },
      {
        serviceId: serviceMap['youtube-monetization'],
        name: 'Premium Authority',
        slug: 'premium-authority-monetization',
        category: 'monetization',
        originalPrice: 46000,
        discount: 50,
        price: 23000,
        quantity: '3,000 Hours + 3.75-4.5L Views + 750 Subs',
        deliveryTime: '30-40 Days',
        startTime: '1 Hour',
        retentionRate: '90-100%',
        description: 'Build serious authority! This package gives you 3,000 watch hours, up to 4.5 lakh views, and 750 real subscribers—creating a dominant and influential channel presence.',
        features: JSON.stringify([
          '3,000 Watch Hours (3× Requirement!)',
          '3.75–4.5 Lakh Real Views',
          '750 Real Subscribers',
          'Authority-Building Package',
          'Massive Channel Boost',
          'Start Time: 1 Hour',
          'Completion: 30–40 Days'
        ]),
        tier: 'premium',
        isPopular: false,
        displayOrder: 5,
        isActive: true
      },
      {
        serviceId: serviceMap['youtube-monetization'],
        name: 'Ultimate Domination',
        slug: 'ultimate-domination-monetization',
        category: 'monetization',
        originalPrice: 60000,
        discount: 50,
        price: 30000,
        quantity: '4,000 Hours + 5-6L Views + 1,000 Subs',
        deliveryTime: '35-50 Days',
        startTime: 'Instant',
        retentionRate: '95-100%',
        description: 'The ultimate monetization package! Get 4,000 watch hours, 5–6 lakh real views, and 1,000 genuine subscribers—hitting every YouTube monetization requirement in one powerful package.',
        features: JSON.stringify([
          '4,000 Watch Hours (4× Requirement!)',
          '5–6 Lakh Real Views',
          '1,000 Real Subscribers (Monetization Ready!)',
          'Ultimate Growth Package',
          'Complete Channel Transformation',
          'Start Time: Instant',
          'Completion: 35–50 Days'
        ]),
        tier: 'ultimate',
        isPopular: false,
        displayOrder: 6,
        isActive: true
      },

      // ========================================
      // YOUTUBE REVENUE
      // ========================================
      {
        serviceId: serviceMap['youtube-revenue'],
        name: 'Revenue Starter',
        slug: 'revenue-starter',
        category: 'revenue',
        originalPrice: 3200,
        discount: 50,
        price: 1600,
        quantity: '8K-12K Views = $8-$12 Revenue',
        deliveryTime: '7-10 Days',
        startTime: '24 Hours',
        retentionRate: '70-85%',
        description: 'Start earning instantly! This package provides 8–12K views from high-CPM countries, generating real AdSense revenue of $8–$12 directly into your channel.',
        features: JSON.stringify([
          '8,000–12,000 High-CPM Views',
          'Expected Revenue: $8–$12',
          '100% AdSense Safe',
          'Tier-1 Country Traffic',
          'High Ad Engagement',
          'Real Revenue Generation',
          'Start Time: 24 Hours',
          'Completion: 7–10 Days'
        ]),
        tier: 'starter',
        isPopular: false,
        displayOrder: 1,
        isActive: true
      },
      {
        serviceId: serviceMap['youtube-revenue'],
        name: 'Revenue Booster',
        slug: 'revenue-booster',
        category: 'revenue',
        originalPrice: 6400,
        discount: 50,
        price: 3200,
        quantity: '17K-25K Views = $17-$25 Revenue',
        deliveryTime: '10-14 Days',
        startTime: '12 Hours',
        retentionRate: '75-90%',
        description: 'Double your earnings! This package delivers 17–25K premium views from high-CPM countries, generating real AdSense revenue of $17–$25. One of the most popular revenue-focused packages.',
        features: JSON.stringify([
          '17,000–25,000 High-CPM Views',
          'Expected Revenue: $17–$25',
          'Premium Tier-1 Traffic',
          'Maximum Ad Visibility',
          'High Click-Through Rate',
          'Proven Revenue Results',
          'Start Time: 12 Hours',
          'Completion: 10–14 Days'
        ]),
        tier: 'growth',
        isPopular: true,
        displayOrder: 2,
        isActive: true
      },
      {
        serviceId: serviceMap['youtube-revenue'],
        name: 'Revenue Pro',
        slug: 'revenue-pro',
        category: 'revenue',
        originalPrice: 12800,
        discount: 50,
        price: 6400,
        quantity: '35K-50K Views = $35-$50 Revenue',
        deliveryTime: '14-20 Days',
        startTime: '6 Hours',
        retentionRate: '80-95%',
        description: 'Professional revenue generation! Get 35–50K elite views from top-paying countries, delivering $35–$50 in real AdSense earnings with strong ad engagement.',
        features: JSON.stringify([
          '35,000–50,000 High-CPM Views',
          'Expected Revenue: $35–$50',
          'Elite Tier-1 Countries',
          'Premium Ad Engagement',
          'Multiple Revenue Streams',
          'Optimized for Maximum Earnings',
          'Start Time: 6 Hours',
          'Completion: 14–20 Days'
        ]),
        tier: 'pro',
        isPopular: false,
        displayOrder: 3,
        isActive: true
      },
      {
        serviceId: serviceMap['youtube-revenue'],
        name: 'Revenue Elite',
        slug: 'revenue-elite',
        category: 'revenue',
        originalPrice: 24000,
        discount: 50,
        price: 12000,
        quantity: '70K-100K Views = $70-$100 Revenue',
        deliveryTime: '20-28 Days',
        startTime: '3 Hours',
        retentionRate: '85-98%',
        description: 'Elite earnings package! Get 70–100K premium views that generate $70–$100 in real AdSense revenue. Perfect for serious creators aiming for consistent and stable income.',
        features: JSON.stringify([
          '70,000–1,00,000 High-CPM Views',
          'Expected Revenue: $70–$100',
          'Premium USA/UK/Canada Traffic',
          'Maximum Revenue Optimization',
          'Multi-Ad Format Engagement',
          'Consistent High Earnings',
          'Start Time: 3 Hours',
          'Completion: 20–28 Days'
        ]),
        tier: 'elite',
        isPopular: false,
        displayOrder: 4,
        isActive: true
      },
      {
        serviceId: serviceMap['youtube-revenue'],
        name: 'Revenue Master',
        slug: 'revenue-master',
        category: 'revenue',
        originalPrice: 46000,
        discount: 50,
        price: 23000,
        quantity: '140K-2L Views = $140-$200 Revenue',
        deliveryTime: '25-35 Days',
        startTime: 'Instant',
        retentionRate: '90-100%',
        description: 'Master-level earnings! This package delivers 140K–2 lakh ultra-premium views, generating $140–$200 in real AdSense revenue. Perfect for turning your channel into a profitable business.',
        features: JSON.stringify([
          '1,40,000–2,00,000 High-CPM Views',
          'Expected Revenue: $140–$200',
          'Ultra-Premium Traffic Sources',
          'Maximum CPM Countries Only',
          'All Ad Formats Optimized',
          'Professional Revenue Stream',
          'Start Time: Instant',
          'Completion: 25–35 Days'
        ]),
        tier: 'ultimate',
        isPopular: false,
        displayOrder: 5,
        isActive: true
      }
    ];

    // Insert all pricing plans
    for (const plan of pricingPlans) {
      await sequelize.query(`
        INSERT INTO pricings (
          serviceId, name, slug, category, originalPrice, discount, price,
          quantity, deliveryTime, startTime, retentionRate, description,
          features, tier, isPopular, displayOrder, isActive, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, {
        replacements: [
          plan.serviceId,
          plan.name,
          plan.slug,
          plan.category,
          plan.originalPrice,
          plan.discount,
          plan.price,
          plan.quantity,
          plan.deliveryTime,
          plan.startTime,
          plan.retentionRate,
          plan.description,
          plan.features,
          plan.tier,
          plan.isPopular,
          plan.displayOrder,
          plan.isActive
        ]
      });
      
      console.log(`   ✓ ${plan.category.toUpperCase()}: ${plan.name} - ₹${plan.price}`);
    }

    console.log('\n✅ All pricing plans seeded successfully!\n');

    // Step 5: Verify data
    console.log('📋 Step 5: Verifying migration...');
    const [results] = await sequelize.query('SELECT COUNT(*) as count FROM pricings');
    const totalPlans = results[0].count;
    
    const [categoryResults] = await sequelize.query(`
      SELECT category, COUNT(*) as count 
      FROM pricings 
      GROUP BY category
    `);

    console.log(`\n📊 Migration Summary:`);
    console.log(`   Total Plans: ${totalPlans}`);
    categoryResults.forEach(row => {
      console.log(`   ${row.category}: ${row.count} plans`);
    });

    console.log('\n🎉 MIGRATION COMPLETED SUCCESSFULLY!\n');
    console.log('Next Steps:');
    console.log('1. Update Pricing model to match new schema');
    console.log('2. Test pricing endpoints');
    console.log('3. Verify frontend displays correctly');
    console.log('4. Fix payment integration vulnerabilities from report\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

// Run migration
migratePricingTable();
