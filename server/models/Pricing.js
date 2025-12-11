import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Pricing extends Model {}

Pricing.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Plan name (e.g., "Starter Views", "Pro Package")'
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'URL-friendly slug'
    },
    category: {
      type: DataTypes.ENUM('views', 'subscribers', 'monetization', 'revenue'),
      allowNull: false,
      comment: 'Service category'
    },
    // Pricing Details
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Original price before discount'
    },
    discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Discount percentage (0-100)',
      validate: {
        min: 0,
        max: 100
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Final price after discount',
      validate: {
        min: { args: [0], msg: 'Price cannot be negative' },
        notEmpty: { msg: 'Please provide a price' }
      }
    },
    // Plan Details
    quantity: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'e.g., "5,000+ Views", "1,000 Hours + 250 Subs"'
    },
    deliveryTime: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'e.g., "5-7 Days", "10-15 Days"'
    },
    startTime: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'e.g., "12-24 Hours", "Instant"'
    },
    retentionRate: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'e.g., "60-80%", "90-100%"'
    },
    // Plan Description
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'About this plan (detailed description)'
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array of features included in the plan'
    },
    // Plan Metadata
    tier: {
      type: DataTypes.ENUM('starter', 'basic', 'growth', 'pro', 'elite', 'premium', 'ultimate'),
      defaultValue: 'basic',
      comment: 'Plan tier/level'
    },
    isPopular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Show "Most Popular" badge'
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Order in listing (lower number = displayed first)'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Is plan available for purchase'
    }
  },
  {
    sequelize,
    modelName: 'Pricing',
    tableName: 'pricings',
    timestamps: true,
    indexes: [
      { fields: ['serviceId'] },
      { fields: ['category'] },
      { fields: ['slug'] },
      { fields: ['price'] },
      { fields: ['isActive'] },
      { fields: ['isPopular'] }
    ]
  }
);

export default Pricing;
