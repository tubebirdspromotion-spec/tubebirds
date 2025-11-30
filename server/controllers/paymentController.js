import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Pricing from '../models/Pricing.js';
import Payment from '../models/Payment.js';
import { sendPaymentReceipt, sendOrderConfirmation } from '../utils/emailService.js';

// Initialize Razorpay (only if keys are provided)
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
export const createRazorpayOrder = async (req, res, next) => {
  try {
    if (!razorpay) {
      return res.status(500).json({
        status: 'error',
        message: 'Payment gateway not configured'
      });
    }
    
    const { orderId } = req.body;

    // Get order from database
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Check if user owns the order
    if (order.customerId !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized'
      });
    }

    const options = {
      amount: order.amount * 100, // amount in paise
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order.id.toString(),
        userId: req.user.id
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      status: 'success',
      data: {
        razorpayOrder,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update order
      const order = await Order.findByPk(orderId, {
        include: [
          { model: User, as: 'customer' },
          { model: Service, as: 'service' },
          { model: Pricing, as: 'pricing' }
        ]
      });
      
      if (!order) {
        return res.status(404).json({
          status: 'error',
          message: 'Order not found'
        });
      }

      await order.update({
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        status: 'processing',
        startDate: new Date()
      });

      // Create payment record
      const payment = await Payment.create({
        orderId: order.id,
        customerId: order.customerId,
        transactionId: razorpay_payment_id,
        gateway: 'razorpay',
        amount: order.amount,
        currency: 'INR',
        status: 'success',
        gatewayOrderId: razorpay_order_id,
        gatewayResponse: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        }
      });

      // Send payment receipt email
      try {
        await sendPaymentReceipt(order, payment, order.customer);
      } catch (emailError) {
        console.error('Failed to send payment receipt:', emailError);
      }

      // Send order confirmation email
      try {
        await sendOrderConfirmation(order, order.customer);
      } catch (emailError) {
        console.error('Failed to send order confirmation:', emailError);
      }

      res.status(200).json({
        status: 'success',
        message: 'Payment verified successfully',
        data: { order, payment }
      });
    } else {
      // Update order as failed
      const order = await Order.findByPk(orderId);
      if (order) {
        await order.update({ paymentStatus: 'failed' });
      }

      res.status(400).json({
        status: 'error',
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment details
// @route   GET /api/payment/:paymentId
// @access  Private/Admin
export const getPaymentDetails = async (req, res, next) => {
  try {
    if (!razorpay) {
      return res.status(500).json({
        status: 'error',
        message: 'Payment gateway not configured'
      });
    }
    
    const payment = await razorpay.payments.fetch(req.params.paymentId);

    res.status(200).json({
      status: 'success',
      data: { payment }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refund payment
// @route   POST /api/payment/refund
// @access  Private/Admin
export const refundPayment = async (req, res, next) => {
  try {
    if (!razorpay) {
      return res.status(500).json({
        status: 'error',
        message: 'Payment gateway not configured'
      });
    }
    
    const { paymentId, orderId, amount } = req.body;

    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100,
      speed: 'normal'
    });

    // Update order
    const order = await Order.findByPk(orderId);
    if (order) {
      await order.update({
        paymentStatus: 'refunded',
        status: 'refunded'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Refund processed successfully',
      data: { refund }
    });
  } catch (error) {
    next(error);
  }
};
