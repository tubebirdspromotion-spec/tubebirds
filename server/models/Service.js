import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Service extends Model {}

Service.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: {
        msg: 'Service title already exists'
      },
      validate: {
        notEmpty: { msg: 'Please provide a service title' }
      }
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      set(value) {
        this.setDataValue('slug', value.toLowerCase());
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please provide a description' }
      }
    },
    shortDescription: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please provide a short description' }
      }
    },
    icon: {
      type: DataTypes.STRING(100),
      defaultValue: 'FaYoutube'
    },
    features: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: 'Array of service features'
    },
    benefits: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: 'Array of service benefits'
    },
    image: {
      type: DataTypes.STRING(500),
      defaultValue: 'https://via.placeholder.com/800x600'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Display order on frontend'
    },
    metaTitle: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    metaDescription: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    metaKeywords: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: 'Array of SEO keywords'
    }
  },
  {
    sequelize,
    modelName: 'Service',
    tableName: 'services',
    timestamps: true,
    indexes: [
      { fields: ['slug'] },
      { fields: ['isActive'] }
    ]
  }
);

export default Service;
