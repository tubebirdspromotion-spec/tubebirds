import { Sequelize } from 'sequelize';

// Create Sequelize instance with MySQL configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || 'tubebirds_dev',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    
    // Connection pool configuration for better performance
    pool: {
      max: 10,        // Maximum number of connections
      min: 0,         // Minimum number of connections
      acquire: 30000, // Maximum time (ms) to get connection before throwing error
      idle: 10000     // Maximum time (ms) a connection can be idle before being released
    },
    
    // Logging configuration
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
    
    // Timezone configuration
    timezone: '+05:30', // IST timezone (adjust as needed)
    
    // Prevent automatic sync in production
    sync: process.env.NODE_ENV === 'production' ? { force: false, alter: false } : undefined,
    
    // Define options for all models
    define: {
      timestamps: true,           // Add createdAt and updatedAt
      underscored: false,         // Use camelCase instead of snake_case
      freezeTableName: true,      // Don't pluralize table names
      charset: 'utf8mb4',         // Support emojis and special characters
      collate: 'utf8mb4_unicode_ci'
    }
  }
);

// Test database connection
const connectDB = async () => {
  try {
    // Skip database connection if SKIP_DB is true (for testing without DB access)
    if (process.env.SKIP_DB === 'true') {
      console.log('⚠️  Database connection skipped (SKIP_DB=true)');
      console.log('ℹ️  Server will run but database operations will fail');
      console.log('ℹ️  To enable DB: Set SKIP_DB=false in .env\n');
      return;
    }

    await sequelize.authenticate();
    console.log('✅ MySQL Database Connected Successfully');
    
    // Check if auto-sync is explicitly enabled (for Hostinger/remote DB scenarios)
    const enableAutoSync = process.env.ENABLE_AUTO_SYNC === 'true';
    
    if (enableAutoSync) {
      // Auto-sync enabled - alter tables to match models
      await sequelize.sync({ alter: true });
      console.log('✅ Database Synchronized (Auto Sync ENABLED)');
      console.log('⚠️  Schema changes applied automatically');
    } else {
      // Auto-sync disabled (safe default)
      console.log('✅ Database Connected (Auto Sync DISABLED)');
      console.log('ℹ️  To sync schema: Set ENABLE_AUTO_SYNC=true in .env');
      console.log('ℹ️  Or use manual migration: /api/seed/migrate');
    }
    
  } catch (error) {
    console.error('❌ Unable to connect to MySQL database:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await sequelize.close();
    console.log('MySQL connection closed due to app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error closing database connection:', error);
    process.exit(1);
  }
});

export { sequelize, connectDB };
export default connectDB;
