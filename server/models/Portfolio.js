import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Portfolio extends Model {}

Portfolio.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM('report', 'review'),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please provide a title' }
      }
    },
    // For Reports
    clientName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    serviceName: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    beforeStats: {
      type: DataTypes.JSON,
      defaultValue: {},
      comment: 'Stores views, subscribers, engagement before service'
    },
    afterStats: {
      type: DataTypes.JSON,
      defaultValue: {},
      comment: 'Stores views, subscribers, engagement after service'
    },
    reportImages: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: 'Array of {url, caption}'
    },
    // For Reviews
    customerName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    customerAvatar: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    platform: {
      type: DataTypes.ENUM('google', 'trustpilot', 'facebook', 'other'),
      defaultValue: 'google'
    },
    // Common fields
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Display order on frontend'
    }
  },
  {
    sequelize,
    modelName: 'Portfolio',
    tableName: 'portfolios',
    timestamps: true,
    indexes: [
      { fields: ['type'] },
      { fields: ['isActive'] },
      { fields: ['isFeatured'] }
    ]
  }
);

export default Portfolio;
