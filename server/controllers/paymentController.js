import Order from '../models/Order.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Pricing from '../models/Pricing.js';
import Payment from '../models/Payment.js';
import razorpayService from '../utils/razorpayService.js';
import { sendPaymentReceipt, sendOrderConfirmation } from '../utils/emailService.js';

/**
 * Payment Controller - Handles all payment operations
 * Following industry best practices for secure payment processing
 */

// @desc    Create Razorpay order for checkout
// @route   POST /api/payment/create-order
// @access  Private
export const createRazorpayOrder = async (req, res, next) => {
  try {
    if (!razorpayService.isConfigured()) {
      return res.status(503).json({
        status: 'error',
        message: 'Payment gateway is currently unavailable. Please contact support.'
      });
    }

    const { pricingId, videoUrl, channelName, channelUrl, planDetails } = req.body;

    // Validate required fields
    if ((!pricingId && !planDetails) || !videoUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'Pricing plan and YouTube video URL are required'
      });
    }

    // Validate YouTube URL
    if (!razorpayService.validateYouTubeUrl(videoUrl)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid YouTube video URL (e.g., https://youtube.com/watch?v=xxxxx)'
      });
    }

    let pricing;
    let serviceId = 1; // Default YouTube Views service
    
    // Try to get pricing from database first
    if (pricingId) {
      pricing = await Pricing.findByPk(pricingId, {
        include: [{
          model: Service,
          as: 'service'
        }]
      });
    }

    // If not found and planDetails provided, use planDetails
    if (!pricing && planDetails) {
      pricing = {
        price: parseFloat(planDetails.price),
        quantity: planDetails.quantity || planDetails.views || '0',
        planName: planDetails.name,
        serviceId: serviceId
      };
    }

    if (!pricing || !pricing.price) {
      return res.status(404).json({
        status: 'error',
        message: 'Pricing plan not found'
      });
    }

    // Calculate GST (18%)
    const gstCalculation = razorpayService.calculateGST(pricing.price, 18);

    // Extract quantity from pricing.quantity string
    const targetQuantity = parseInt(String(pricing.quantity).replace(/[^0-9]/g, '')) || 0;

    // Extract YouTube video ID
    const videoId = razorpayService.extractYouTubeVideoId(videoUrl);

    // Create order in database
    const order = await Order.create({
      userId: req.user.id,
      pricingId,
      serviceId: pricing.serviceId,
      amount: gstCalculation.totalAmount,
      baseAmount: gstCalculation.baseAmount,
      gstAmount: gstCalculation.gstAmount,
      gstRate: gstCalculation.gstRate,
      paymentMethod: 'razorpay',
      status: 'pending',
      paymentStatus: 'pending',
      customerDetails: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || ''
      },
      channelDetails: {
        channelName: channelName || '',
        channelUrl: channelUrl || '',
        videoUrl: videoUrl,
        videoId: videoId
      },
      targetQuantity,
      estimatedCompletionDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days
    });

    // Create Razorpay order
    const razorpayOrder = await razorpayService.createOrder({
      amount: gstCalculation.totalAmount,
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order.id.toString(),
        userId: req.user.id.toString(),
        serviceId: pricing.serviceId.toString(),
        pricingId: pricingId.toString()
      }
    });

    // Update order with Razorpay order ID
    await order.update({
      paymentId: razorpayOrder.id
    });

    // Create pending payment record
    await Payment.create({
      orderId: order.id,
      userId: req.user.id,
      razorpayOrderId: razorpayOrder.id,
      amount: gstCalculation.totalAmount,
      baseAmount: gstCalculation.baseAmount,
      gstAmount: gstCalculation.gstAmount,
      currency: 'INR',
      status: 'pending',
      paymentMethod: 'razorpay',
      paymentGateway: 'razorpay',
      metadata: {
        serviceName: pricing.service.name,
        planName: pricing.name,
        quantity: pricing.quantity
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Payment order created successfully',
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        razorpayOrderId: razorpayOrder.id,
        razorpayKeyId: razorpayService.getKeyId(),
        amount: gstCalculation.totalAmount,
        baseAmount: gstCalculation.baseAmount,
        gstAmount: gstCalculation.gstAmount,
        gstRate: gstCalculation.gstRate,
        currency: 'INR',
        customerDetails: {
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone || ''
        }
      }
    });
  } catch (error) {
    console.error('❌ Create Razorpay order error:', error);
    next(error);
  }
};

// @desc    Verify Razorpay payment signature
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

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required payment verification parameters'
      });
    }

    // Find the order
    const order = await Order.findByPk(orderId, {
      include: [
        { 
          model: User, 
          as: 'customer',
          attributes: ['id', 'name', 'email', 'phone']
        },
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

    // Verify user owns this order
    if (order.userId !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to verify this payment'
      });
    }

    // Verify payment signature
    const isValid = razorpayService.verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (!isValid) {
      // Payment verification failed
      await order.update({
        paymentStatus: 'failed',
        status: 'cancelled'
      });

      // Update payment record
      await Payment.update(
        {
          status: 'failed',
          failureReason: 'Payment signature verification failed',
          failureCode: 'INVALID_SIGNATURE'
        },
        {
          where: {
            orderId: order.id,
            razorpayOrderId: razorpay_order_id
          }
        }
      );

      return res.status(400).json({
        status: 'error',
        message: 'Payment verification failed. Invalid signature.'
      });
    }

    // Fetch payment details from Razorpay
    let paymentDetails = null;
    try {
      paymentDetails = await razorpayService.fetchPaymentDetails(razorpay_payment_id);
    } catch (error) {
      console.error('Failed to fetch payment details:', error);
    }

    // Generate invoice number
    const invoiceNumber = razorpayService.generateInvoiceNumber();

    // Update order status
    await order.update({
      paymentStatus: 'paid',
      paymentId: razorpay_payment_id,
      status: 'processing',
      startDate: new Date()
    });

    // Update payment record
    const payment = await Payment.findOne({
      where: {
        orderId: order.id,
        razorpayOrderId: razorpay_order_id
      }
    });

    if (payment) {
      await payment.update({
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'success',
        paymentMode: paymentDetails?.method || null,
        paymentResponse: paymentDetails || {},
        capturedAt: new Date(),
        invoiceNumber,
        metadata: {
          ...payment.metadata,
          videoUrl: order.channelDetails?.videoUrl,
          videoId: order.channelDetails?.videoId
        }
      });
    }

    // Send confirmation emails
    try {
      await sendPaymentReceipt(order, payment, order.customer);
      await sendOrderConfirmation(order, order.customer);
    } catch (emailError) {
      console.error('Failed to send confirmation emails:', emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({
      status: 'success',
      message: 'Payment verified successfully! Your order is now being processed.',
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentId: razorpay_payment_id,
        invoiceNumber,
        amount: order.amount,
        status: order.status,
        paymentStatus: order.paymentStatus
      }
    });
  } catch (error) {
    console.error('❌ Payment verification error:', error);
    next(error);
  }
};

// @desc    Handle Razorpay webhook events
// @route   POST /api/payment/webhook
// @access  Public (verified by signature)
export const handleWebhook = async (req, res, next) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookBody = JSON.stringify(req.body);

    // Verify webhook signature
    const isValid = razorpayService.verifyWebhookSignature(webhookBody, webhookSignature);

    if (!isValid) {
      console.warn('⚠️ Invalid webhook signature');
      return res.status(400).json({
        status: 'error',
        message: 'Invalid signature'
      });
    }

    const event = req.body.event;
    const payload = req.body.payload.payment.entity;

    console.log(`📥 Received webhook event: ${event}`);

    // Handle different webhook events
    switch (event) {
      case 'payment.authorized':
        await handlePaymentAuthorized(payload);
        break;

      case 'payment.captured':
        await handlePaymentCaptured(payload);
        break;

      case 'payment.failed':
        await handlePaymentFailed(payload);
        break;

      case 'refund.processed':
        await handleRefundProcessed(req.body.payload.refund.entity);
        break;

      default:
        console.log(`ℹ️ Unhandled webhook event: ${event}`);
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('❌ Webhook handling error:', error);
    res.status(500).json({ status: 'error' });
  }
};

// Helper: Handle payment.authorized webhook
async function handlePaymentAuthorized(payload) {
  try {
    const payment = await Payment.findOne({
      where: { razorpayOrderId: payload.order_id }
    });

    if (payment) {
      await payment.update({
        status: 'authorized',
        authorizedAt: new Date(),
        razorpayPaymentId: payload.id,
        paymentResponse: payload
      });
      console.log(`✅ Payment authorized: ${payload.id}`);
    }
  } catch (error) {
    console.error('Failed to handle payment.authorized:', error);
  }
}

// Helper: Handle payment.captured webhook
async function handlePaymentCaptured(payload) {
  try {
    const payment = await Payment.findOne({
      where: { razorpayPaymentId: payload.id }
    });

    if (payment) {
      await payment.update({
        status: 'captured',
        capturedAt: new Date(),
        paymentResponse: payload
      });
      console.log(`✅ Payment captured: ${payload.id}`);
    }
  } catch (error) {
    console.error('Failed to handle payment.captured:', error);
  }
}

// Helper: Handle payment.failed webhook
async function handlePaymentFailed(payload) {
  try {
    const payment = await Payment.findOne({
      where: { razorpayOrderId: payload.order_id }
    });

    if (payment) {
      await payment.update({
        status: 'failed',
        failureReason: payload.error_description || 'Payment failed',
        failureCode: payload.error_code,
        paymentResponse: payload
      });

      // Update order status
      await Order.update(
        { paymentStatus: 'failed', status: 'cancelled' },
        { where: { id: payment.orderId } }
      );

      console.log(`❌ Payment failed: ${payload.id}`);
    }
  } catch (error) {
    console.error('Failed to handle payment.failed:', error);
  }
}

// Helper: Handle refund.processed webhook
async function handleRefundProcessed(payload) {
  try {
    const payment = await Payment.findOne({
      where: { razorpayPaymentId: payload.payment_id }
    });

    if (payment) {
      await payment.update({
        status: 'refunded',
        refundAmount: payload.amount / 100,
        refundDate: new Date(),
        refundTransactionId: payload.id,
        refundStatus: 'processed',
        paymentResponse: {
          ...payment.paymentResponse,
          refund: payload
        }
      });

      // Update order status
      await Order.update(
        { paymentStatus: 'refunded', status: 'refunded' },
        { where: { id: payment.orderId } }
      );

      console.log(`✅ Refund processed: ${payload.id}`);
    }
  } catch (error) {
    console.error('Failed to handle refund.processed:', error);
  }
}

// @desc    Get payment details by payment ID
// @route   GET /api/payment/:paymentId
// @access  Private/Admin
export const getPaymentDetails = async (req, res, next) => {
  try {
    if (!razorpayService.isConfigured()) {
      return res.status(503).json({
        status: 'error',
        message: 'Payment gateway not configured'
      });
    }

    const paymentDetails = await razorpayService.fetchPaymentDetails(req.params.paymentId);

    res.status(200).json({
      status: 'success',
      data: { payment: paymentDetails }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments (for admin or user's own payments)
// @route   GET /api/payment/history
// @access  Private
export const getPaymentHistory = async (req, res, next) => {
  try {
    let where = {};

    // Non-admin users can only see their own payments
    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }

    // Filter by status if provided
    if (req.query.status) {
      where.status = req.query.status;
    }

    const payments = await Payment.findAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Order,
          as: 'order',
          include: [
            { model: Service, as: 'service' },
            { model: Pricing, as: 'pricing' }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: req.query.limit || 50
    });

    res.status(200).json({
      status: 'success',
      results: payments.length,
      data: { payments }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process refund for a payment
// @route   POST /api/payment/refund
// @access  Private/Admin
export const refundPayment = async (req, res, next) => {
  try {
    if (!razorpayService.isConfigured()) {
      return res.status(503).json({
        status: 'error',
        message: 'Payment gateway not configured'
      });
    }

    const { orderId, amount, reason } = req.body;

    // Find the order and payment
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    const payment = await Payment.findOne({
      where: {
        orderId: order.id,
        status: 'success'
      }
    });

    if (!payment || !payment.razorpayPaymentId) {
      return res.status(400).json({
        status: 'error',
        message: 'No successful payment found for this order'
      });
    }

    // Process refund through Razorpay
    const refund = await razorpayService.processRefund({
      paymentId: payment.razorpayPaymentId,
      amount: amount || order.amount,
      notes: {
        reason: reason || 'Refund requested by admin',
        processedBy: req.user.email
      },
      speed: 'normal'
    });

    // Update payment record
    await payment.update({
      status: 'refunded',
      refundAmount: refund.amount / 100,
      refundDate: new Date(),
      refundTransactionId: refund.id,
      refundStatus: 'pending',
      paymentResponse: {
        ...payment.paymentResponse,
        refund
      }
    });

    // Update order status
    await order.update({
      paymentStatus: 'refunded',
      status: 'refunded'
    });

    res.status(200).json({
      status: 'success',
      message: 'Refund initiated successfully',
      data: {
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });
  } catch (error) {
    console.error('❌ Refund error:', error);
    next(error);
  }
};
