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
      allowNull: true,
      references: {
        model: 'services',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    planName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please provide a plan name' }
      }
    },
    category: {
      type: DataTypes.ENUM('views', 'subscribers', 'monetization', 'revenue'),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: 'Price cannot be negative' },
        notEmpty: { msg: 'Please provide a price' }
      }
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    duration: {
      type: DataTypes.STRING(50),
      defaultValue: 'one-time'
    },
    quantity: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'e.g., "1000 views", "500 subscribers"'
    },
    features: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      comment: 'Array of plan features'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isPopular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    deliveryTime: {
      type: DataTypes.STRING(50),
      defaultValue: '7-15 days'
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Display order on frontend'
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
      { fields: ['isActive'] }
    ]
  }
);

export default Pricing;
