import Order from '../models/Order.js';
import Pricing from '../models/Pricing.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import { sendOrderConfirmation } from '../utils/emailService.js';

// @desc    Get all orders (Admin gets all, User gets their own)
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req, res, next) => {
  try {
    let where = {};
    
    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }

    const orders = await Order.findAll({
      where,
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'editor',
          attributes: ['id', 'name', 'email'],
          required: false
        },
        {
          model: Pricing,
          as: 'pricing',
          required: false
        },
        {
          model: Service,
          as: 'service',
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Transform orders to include planDetails as fallback
    const ordersWithFallback = orders.map(order => {
      const orderData = order.toJSON();
      
      // Parse planDetails if it's a string
      let planDetails = orderData.planDetails;
      if (typeof planDetails === 'string') {
        try {
          planDetails = JSON.parse(planDetails);
        } catch (e) {
          planDetails = null;
        }
      }
      
      // Check if pricing exists and has data
      const hasPricing = orderData.pricing && Object.keys(orderData.pricing).length > 0;
      // If pricing is null/empty but planDetails exists, create virtual pricing
      if (!hasPricing && planDetails) {
        orderData.pricing = {
          planName: planDetails.name,
          category: planDetails.category,
          price: planDetails.price,
          quantity: planDetails.quantity
        };
      }
      
      // Check if service exists and has data
      const hasService = orderData.service && Object.keys(orderData.service).length > 0;
      // If service is null/empty but planDetails exists, create virtual service
      if (!hasService && planDetails) {
        const categoryTitleMap = {
          'views': 'YouTube Views',
          'subscribers': 'YouTube Subscribers',
          'monetization': 'YouTube Monetization',
          'revenue': 'YouTube Revenue'
        };
        orderData.service = {
          title: categoryTitleMap[planDetails.category] || 'YouTube Service'
        };
      }
      
      return orderData;
    });

    res.status(200).json({
      status: 'success',
      results: ordersWithFallback.length,
      data: { orders: ordersWithFallback }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: User,
          as: 'editor',
          attributes: ['id', 'name', 'email'],
          required: false
        },
        {
          model: Pricing,
          as: 'pricing'
        },
        {
          model: Service,
          as: 'service'
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this order'
      });
    }

    // Debug logging
    console.log('📦 Order ID:', order.id);
    console.log('🎯 Service:', order.service ? { id: order.service.id, title: order.service.title } : 'NULL');
    console.log('💳 Pricing:', order.pricing ? { id: order.pricing.id, planName: order.pricing.planName } : 'NULL');
    console.log('📺 Channel Details:', order.channelDetails);
    console.log('🔢 ServiceId:', order.serviceId);
    console.log('🔢 PricingId:', order.pricingId);
    console.log('📋 Plan Details:', order.planDetails);

    // If pricing/service associations are null but planDetails exists, create virtual objects
    const orderResponse = order.toJSON();
    console.log('🔍 Before transformation - pricing:', orderResponse.pricing);
    console.log('🔍 Before transformation - planDetails:', orderResponse.planDetails);
    console.log('🔍 planDetails type:', typeof orderResponse.planDetails);
    console.log('🔍 channelDetails type:', typeof orderResponse.channelDetails);
    console.log('🔍 channelDetails value:', orderResponse.channelDetails);
    
    // Parse planDetails if it's a string
    let planDetails = orderResponse.planDetails;
    if (typeof planDetails === 'string') {
      try {
        planDetails = JSON.parse(planDetails);
        console.log('📋 Parsed planDetails:', planDetails);
      } catch (e) {
        console.error('❌ Failed to parse planDetails:', e);
        planDetails = null;
      }
    }
    
    // Parse channelDetails if it's a string
    if (typeof orderResponse.channelDetails === 'string') {
      try {
        orderResponse.channelDetails = JSON.parse(orderResponse.channelDetails);
        console.log('📺 Parsed channelDetails:', orderResponse.channelDetails);
      } catch (e) {
        console.error('❌ Failed to parse channelDetails:', e);
      }
    }
    
    // Check if pricing is null or empty object
    const hasPricing = orderResponse.pricing && Object.keys(orderResponse.pricing).length > 0;
    if (!hasPricing && planDetails) {
      console.log('✨ Creating virtual pricing from planDetails');
      orderResponse.pricing = {
        planName: planDetails.name,
        category: planDetails.category,
        price: planDetails.price,
        quantity: planDetails.quantity
      };
      console.log('✅ Virtual pricing created:', orderResponse.pricing);
    }
    
    // Check if service is null or empty object
    const hasService = orderResponse.service && Object.keys(orderResponse.service).length > 0;
    if (!hasService && planDetails) {
      console.log('✨ Creating virtual service from planDetails');
      // Map category to service title
      const categoryTitleMap = {
        'views': 'YouTube Views',
        'subscribers': 'YouTube Subscribers',
        'monetization': 'YouTube Monetization',
        'revenue': 'YouTube Revenue'
      };
      orderResponse.service = {
        title: categoryTitleMap[planDetails.category] || 'YouTube Service'
      };
    }

    res.status(200).json({
      status: 'success',
      data: { order: orderResponse }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { pricingId, channelDetails } = req.body;

    // Validate YouTube video URL is provided
    if (!channelDetails || !channelDetails.videoUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'YouTube video URL is required before placing order'
      });
    }

    // Basic YouTube URL validation
    const youtubeUrlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeUrlPattern.test(channelDetails.videoUrl)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid YouTube video URL'
      });
    }

    // Get pricing details
    const pricing = await Pricing.findByPk(pricingId, {
      include: [{
        model: Service,
        as: 'service'
      }]
    });

    if (!pricing) {
      return res.status(404).json({
        status: 'error',
        message: 'Pricing plan not found'
      });
    }

    // Extract quantity from pricing.quantity string (e.g., "1000 Views" -> 1000)
    const targetQuantity = parseInt(pricing.quantity.replace(/[^0-9]/g, ''));

    // Calculate GST (18%)
    const baseAmount = pricing.price;
    const gstRate = 0.18; // 18% GST
    const gstAmount = baseAmount * gstRate;
    const totalAmount = baseAmount + gstAmount;

    const order = await Order.create({
      userId: req.user.id,
      pricingId,
      serviceId: pricing.serviceId,
      amount: totalAmount, // Total amount including GST
      baseAmount: baseAmount, // Original price before GST
      gstAmount: gstAmount, // GST amount (18%)
      gstRate: 18, // GST percentage
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'razorpay',
      customerDetails: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone
      },
      channelDetails,
      targetQuantity,
      estimatedCompletionDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days
    });

    // Reload with associations for email
    await order.reload({
      include: [
        { model: Service, as: 'service' },
        { model: Pricing, as: 'pricing' }
      ]
    });

    // Send order confirmation email (only for paid orders, otherwise send after payment)
    if (order.paymentStatus === 'paid') {
      try {
        await sendOrderConfirmation(order, req.user);
      } catch (emailError) {
        console.error('Failed to send order confirmation:', emailError);
        // Continue even if email fails
      }
    }

    res.status(201).json({
      status: 'success',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order (Admin only)
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    // Don't allow changing certain fields directly
    const { amount, baseAmount, gstAmount, paymentStatus, orderNumber, ...updateData } = req.body;

    await order.update(updateData);

    // Reload with associations
    await order.reload({
      include: [
        { model: User, as: 'customer' },
        { model: User, as: 'editor', required: false },
        { model: Pricing, as: 'pricing' },
        { model: Service, as: 'service' }
      ]
    });

    res.status(200).json({
      status: 'success',
      message: 'Order updated successfully',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    // Validate status
    const validStatuses = ['pending', 'processing', 'in-progress', 'completed', 'cancelled', 'refunded'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findByPk(req.params.id, {
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

    const updates = { status };

    // Add timestamps based on status
    if (status === 'in-progress' && !order.startDate) {
      updates.startDate = new Date();
    }

    if (status === 'completed' && !order.completionDate) {
      updates.completionDate = new Date();
      updates.progress = 100;
      updates.completedQuantity = order.targetQuantity;
    }

    if (adminNotes) {
      updates.adminNotes = adminNotes;
    }

    await order.update(updates);

    // Reload to get updated data
    await order.reload();

    res.status(200).json({
      status: 'success',
      message: `Order status updated to ${status}`,
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order progress (Admin only)
// @route   PUT /api/orders/:id/progress
// @access  Private/Admin
export const updateOrderProgress = async (req, res, next) => {
  try {
    const { progress, completedQuantity, status } = req.body;

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    const updates = {};
    if (progress !== undefined) updates.progress = progress;
    if (completedQuantity !== undefined) updates.completedQuantity = completedQuantity;
    if (status) updates.status = status;

    // Auto-complete if progress is 100%
    if (progress === 100 && !order.completionDate) {
      updates.completionDate = new Date();
      updates.status = 'completed';
    }

    await order.update(updates);

    res.status(200).json({
      status: 'success',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add note to order
// @route   POST /api/orders/:id/notes
// @access  Private
export const addOrderNote = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    const notes = order.notes || [];
    notes.push({
      message: req.body.message,
      createdBy: req.user.id
    });

    await order.update({ notes });

    res.status(200).json({
      status: 'success',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order (Admin only)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    await order.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Order deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
