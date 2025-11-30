/**
 * Model Associations & Relationships
 * This file defines all relationships between Sequelize models
 */

import User from './User.js';
import Order from './Order.js';
import Service from './Service.js';
import Pricing from './Pricing.js';
import Portfolio from './Portfolio.js';
import Contact from './Contact.js';
import Consultation from './Consultation.js';
import Review from './Review.js';
import Payment from './Payment.js';

// ============================================
// USER ASSOCIATIONS
// ============================================

// User has many Orders (as customer)
User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders'
});

// User has many Orders (as editor)
User.hasMany(Order, {
  foreignKey: 'editorId',
  as: 'assignedOrders'
});

// User has many Reviews
User.hasMany(Review, {
  foreignKey: 'userId',
  as: 'reviews'
});

// User has many Payments
User.hasMany(Payment, {
  foreignKey: 'userId',
  as: 'payments'
});

// ============================================
// ORDER ASSOCIATIONS
// ============================================

// Order belongs to User (customer)
Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'customer'
});

// Order belongs to User (editor)
Order.belongsTo(User, {
  foreignKey: 'editorId',
  as: 'editor'
});

// Order belongs to Service
Order.belongsTo(Service, {
  foreignKey: 'serviceId',
  as: 'service'
});

// Order belongs to Pricing
Order.belongsTo(Pricing, {
  foreignKey: 'pricingId',
  as: 'pricing'
});

// Order has one Review
Order.hasOne(Review, {
  foreignKey: 'orderId',
  as: 'review'
});

// Order has many Payments
Order.hasMany(Payment, {
  foreignKey: 'orderId',
  as: 'payments'
});

// ============================================
// SERVICE ASSOCIATIONS
// ============================================

// Service has many Pricings
Service.hasMany(Pricing, {
  foreignKey: 'serviceId',
  as: 'pricings'
});

// Service has many Orders
Service.hasMany(Order, {
  foreignKey: 'serviceId',
  as: 'orders'
});

// Service has many Reviews
Service.hasMany(Review, {
  foreignKey: 'serviceId',
  as: 'reviews'
});

// ============================================
// PRICING ASSOCIATIONS
// ============================================

// Pricing belongs to Service
Pricing.belongsTo(Service, {
  foreignKey: 'serviceId',
  as: 'service'
});

// Pricing has many Orders
Pricing.hasMany(Order, {
  foreignKey: 'pricingId',
  as: 'orders'
});

// ============================================
// REVIEW ASSOCIATIONS
// ============================================

// Review belongs to User
Review.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Review belongs to Order
Review.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order'
});

// Review belongs to Service
Review.belongsTo(Service, {
  foreignKey: 'serviceId',
  as: 'service'
});

// Review approved by User (admin)
Review.belongsTo(User, {
  foreignKey: 'approvedBy',
  as: 'approver'
});

// ============================================
// PAYMENT ASSOCIATIONS
// ============================================

// Payment belongs to Order
Payment.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order'
});

// Payment belongs to User
Payment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// ============================================
// EXPORT ALL MODELS
// ============================================

export {
  User,
  Order,
  Service,
  Pricing,
  Portfolio,
  Contact,
  Consultation,
  Review,
  Payment
};

// Export default for convenience
export default {
  User,
  Order,
  Service,
  Pricing,
  Portfolio,
  Contact,
  Consultation,
  Review,
  Payment
};
