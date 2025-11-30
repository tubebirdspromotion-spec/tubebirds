import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Review extends Model {}

Review.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // One review per order
      references: {
        model: 'orders',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: 'Rating must be at least 1' },
        max: { args: [5], msg: 'Rating cannot exceed 5' }
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Please provide a review comment' }
      }
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Admin approval status'
    },
    approvedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Show on website'
    }
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['orderId'], unique: true },
      { fields: ['serviceId'] },
      { fields: ['isApproved'] },
      { fields: ['isPublished'] },
      { fields: ['rating'] }
    ]
  }
);

export default Review;
