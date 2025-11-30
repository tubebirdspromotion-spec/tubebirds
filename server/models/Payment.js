import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';

class Payment extends Model {}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
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
    payuTransactionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'PayU transaction/payment ID'
    },
    razorpayOrderId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Razorpay order ID (if used)'
    },
    razorpayPaymentId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Razorpay payment ID (if used)'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'INR'
    },
    status: {
      type: DataTypes.ENUM('pending', 'success', 'failed', 'refunded'),
      defaultValue: 'pending'
    },
    paymentMethod: {
      type: DataTypes.ENUM('payu', 'razorpay', 'stripe', 'manual', 'other'),
      allowNull: false
    },
    paymentGateway: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Gateway used (e.g., PayU, Razorpay, Stripe)'
    },
    paymentResponse: {
      type: DataTypes.JSON,
      defaultValue: {},
      comment: 'Full response from payment gateway'
    },
    failureReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    refundAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    refundDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    refundTransactionId: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments',
    timestamps: true,
    indexes: [
      { fields: ['orderId'] },
      { fields: ['userId'] },
      { fields: ['status'] },
      { fields: ['payuTransactionId'] },
      { fields: ['razorpayPaymentId'] },
      { fields: ['createdAt'] }
    ]
  }
);

export default Payment;
