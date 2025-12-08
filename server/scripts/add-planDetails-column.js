import { sequelize } from '../config/db.js';
import { QueryTypes } from 'sequelize';

/**
 * Script to add planDetails column to orders table if it doesn't exist
 * This stores plan information when orders are created from frontend pricing (pricingId is null)
 */

async function addPlanDetailsColumn() {
  try {
    console.log('🔍 Checking if planDetails column exists in orders table...');

    // Check if column exists
    const results = await sequelize.query(
      `SELECT COLUMN_NAME 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = DATABASE() 
       AND TABLE_NAME = 'orders' 
       AND COLUMN_NAME = 'planDetails'`,
      { type: QueryTypes.SELECT }
    );

    if (results && results.length > 0) {
      console.log('✅ planDetails column already exists. No action needed.');
      process.exit(0);
    }

    console.log('⚠️  planDetails column does not exist. Adding it now...');

    // Add the column
    await sequelize.query(
      `ALTER TABLE orders 
       ADD COLUMN planDetails JSON NULL 
       COMMENT 'Stores plan info when pricingId is null: {name, price, quantity, category}'`
    );

    console.log('✅ Successfully added planDetails column to orders table!');
    console.log('📋 Column details:');
    console.log('   - Type: JSON');
    console.log('   - Nullable: Yes');
    console.log('   - Purpose: Store frontend plan details when pricingId is null');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding planDetails column:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run the migration
addPlanDetailsColumn();
