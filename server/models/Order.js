import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Order extends Model {
  // Method to generate order number
  static async generateOrderNumber() {
    const date = new Date();
    const random = Math.floor(Math.random() * 10000);
    return `ORD-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${random}`;
  }
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      // Removed unique constraint to avoid "too many keys" error in production
      // Order numbers are still generated uniquely via generateOrderNumber()
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
    pricingId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'pricings',
        key: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      comment: 'Pricing plan ID (nullable for custom plans)'
    },
    editorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      comment: 'Editor assigned to this order'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Total amount including GST'
    },
    baseAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Base amount before GST'
    },
    gstAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'GST amount (18%)'
    },
    gstRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 18.00,
      comment: 'GST rate percentage'
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'in-progress', 'completed', 'cancelled', 'refunded'),
      defaultValue: 'pending'
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.ENUM('payu', 'razorpay', 'stripe', 'manual'),
      defaultValue: 'payu'
    },
    paymentId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Payment gateway transaction ID'
    },
    // Customer Details (JSON)
    customerDetails: {
      type: DataTypes.JSON,
      defaultValue: {},
      comment: 'Stores name, email, phone'
    },
    // YouTube Channel Details (JSON)
    channelDetails: {
      type: DataTypes.JSON,
      defaultValue: {},
      comment: 'Stores channelName, channelUrl, videoUrl, currentSubscribers, currentViews'
    },
    // Progress Tracking
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    completedQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    targetQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // Timeline
    startDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completionDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estimatedCompletionDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // Notes and Updates (JSON array)
    notes: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: 'Array of {message, createdBy, createdAt}'
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    // Reports (JSON array)
    reports: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: 'Array of {title, fileUrl, uploadedAt}'
    },
    // Deliverables (new field for file uploads)
    deliverables: {
      type: DataTypes.JSON,
      defaultValue: [],
      comment: 'Array of uploaded deliverable files'
    }
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
    hooks: {
      beforeCreate: async (order) => {
        if (!order.orderNumber) {
          order.orderNumber = await Order.generateOrderNumber();
        }
      }
    },
    indexes: [
      { fields: ['userId'] },
      { fields: ['serviceId'] },
      { fields: ['pricingId'] },
      { fields: ['editorId'] },
      { fields: ['status'] },
      { fields: ['paymentStatus'] },
      { fields: ['orderNumber'] } // Removed unique to avoid too many keys error
    ]
  }
);

export default Order;
