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
    // Transaction IDs
    transactionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Generic transaction ID'
    },
    payuTransactionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'PayU transaction/payment ID'
    },
    razorpayOrderId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      // Removed unique to avoid too many keys error
      comment: 'Razorpay order ID'
    },
    razorpayPaymentId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      // Removed unique to avoid too many keys error
      comment: 'Razorpay payment ID'
    },
    razorpaySignature: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Razorpay payment signature for verification'
    },
    // Amount details
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
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'INR'
    },
    // Status tracking
    status: {
      type: DataTypes.ENUM('pending', 'authorized', 'captured', 'success', 'failed', 'refunded'),
      defaultValue: 'pending',
      comment: 'Payment status'
    },
    paymentMethod: {
      type: DataTypes.ENUM('razorpay', 'payu', 'stripe', 'manual', 'other'),
      defaultValue: 'razorpay'
    },
    paymentGateway: {
      type: DataTypes.STRING(50),
      defaultValue: 'razorpay',
      comment: 'Gateway used (e.g., Razorpay, PayU, Stripe)'
    },
    // Payment mode (card, upi, netbanking, etc.)
    paymentMode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Mode of payment (card, upi, netbanking, wallet, etc.)'
    },
    // Response and metadata
    paymentResponse: {
      type: DataTypes.JSON,
      defaultValue: {},
      comment: 'Full response from payment gateway'
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {},
      comment: 'Additional metadata like invoice details'
    },
    // Failure tracking
    failureReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    failureCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Error code from payment gateway'
    },
    // Refund details
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
    },
    refundStatus: {
      type: DataTypes.ENUM('pending', 'processed', 'failed'),
      allowNull: true
    },
    // Timestamps for tracking
    authorizedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When payment was authorized'
    },
    capturedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When payment was captured'
    },
    // Invoice details
    invoiceNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      // Removed unique to avoid too many keys error
    },
    invoiceUrl: {
      type: DataTypes.STRING(500),
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
