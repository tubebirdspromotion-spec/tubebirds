/**
 * Script to update Revenue Plan prices
 * 
 * Usage: Run this script to update the pricing table with new revenue plan prices
 * 
 * Revenue Plans Price Updates:
 * - Revenue Starter: Rs. 1600
 * - Revenue Booster: Rs. 3200
 * - Revenue Pro: Rs. 6400
 * - Revenue Elite: Rs. 12,000
 * - Revenue Master: Rs. 23,000
 * 
 * All with 0% discount (no discount)
 */

import { sequelize } from '../config/db.js';
import { Pricing } from '../models/index.js';

const updateRevenuePrices = async () => {
  try {
    console.log('🚀 Starting Revenue Plan Price Update...\n');

    // Define the new prices
    const revenuePriceUpdates = [
      {
        planName: 'Revenue Starter',
        newPrice: 1600,
        discount: 0
      },
      {
        planName: 'Revenue Booster',
        newPrice: 3200,
        discount: 0
      },
      {
        planName: 'Revenue Pro',
        newPrice: 6400,
        discount: 0
      },
      {
        planName: 'Revenue Elite',
        newPrice: 12000,
        discount: 0
      },
      {
        planName: 'Revenue Master',
        newPrice: 23000,
        discount: 0
      }
    ];

    // Update each plan
    for (const update of revenuePriceUpdates) {
      const plan = await Pricing.findOne({
        where: {
          planName: update.planName,
          category: 'revenue'
        }
      });

      if (!plan) {
        console.log(`⚠️  Plan "${update.planName}" not found in database`);
        continue;
      }

      const oldPrice = plan.price;
      const oldDiscount = plan.discount;

      // Update the plan
      await plan.update({
        price: update.newPrice,
        originalPrice: update.newPrice, // Set originalPrice same as price (no discount)
        discount: update.discount
      });

      console.log(`✅ Updated: ${update.planName}`);
      console.log(`   Old Price: ₹${oldPrice} (${oldDiscount}% discount)`);
      console.log(`   New Price: ₹${update.newPrice} (${update.discount}% discount)\n`);
    }

    console.log('✨ Revenue Plan Price Update Completed Successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating revenue prices:', error.message);
    process.exit(1);
  }
};

// Run the update
updateRevenuePrices();
