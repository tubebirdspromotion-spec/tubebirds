import Order from '../models/Order.js';
import Pricing from '../models/Pricing.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Payment from '../models/Payment.js';
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
      
      // Parse channelDetails if it's a string
      if (typeof orderData.channelDetails === 'string') {
        try {
          orderData.channelDetails = JSON.parse(orderData.channelDetails);
        } catch (e) {
          console.error('❌ Failed to parse channelDetails:', e);
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

// @desc    Generate invoice for an order
// @route   GET /api/orders/:id/invoice
// @access  Private
export const generateInvoice = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'name', 'email', 'phone']
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
        message: 'Not authorized to access this invoice'
      });
    }

    // Get payment details
    const payment = await Payment.findOne({
      where: { orderId: order.id, status: 'success' }
    });

    if (!payment) {
      return res.status(404).json({
        status: 'error',
        message: 'No successful payment found for this order'
      });
    }

    // Parse planDetails if pricing is missing
    let planDetails = order.planDetails;
    if (typeof planDetails === 'string') {
      try {
        planDetails = JSON.parse(planDetails);
      } catch (e) {
        planDetails = null;
      }
    }

    // Get pricing info
    const pricingInfo = order.pricing || planDetails;
    const serviceName = order.service?.title || order.service?.name || planDetails?.category || 'Service';

    // Convert amounts to numbers
    const baseAmount = parseFloat(order.baseAmount || payment.baseAmount || 0);
    const gstAmount = parseFloat(order.gstAmount || payment.gstAmount || 0);
    const totalAmount = parseFloat(order.totalAmount || payment.amount || 0);
    const gstRate = order.gstRate || 18;

    // Company details
    const companyDetails = {
      name: 'Tubebirds promotion',
      address: 'Badauli Adai, Bhanwarkol',
      city: 'Dist- Ghazipur, Uttar Pradesh 233231',
      email: 'contact@tubebirdspromotion.com',
      phone: '+91 8081447837',
      gstin: process.env.COMPANY_GST_NUMBER || '',
      website: 'www.tubebirdspromotion.com',
      logo: 'https://tubebirdspromotion.com/logo.png'
    };

    // Generate HTML invoice
    const invoiceHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - ${order.orderNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; padding: 20px; background: #f5f5f5; }
    .invoice { max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
    .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px; border-bottom: 3px solid #10b981; padding-bottom: 20px; }
    .company-info { flex: 1; }
    .company-info img.logo { max-width: 150px; height: auto; margin-bottom: 10px; }
    .company-info h1 { color: #10b981; font-size: 28px; margin-bottom: 10px; }
    .company-info p { color: #666; font-size: 12px; line-height: 1.6; }
    .invoice-title { text-align: right; }
    .invoice-title h2 { color: #333; font-size: 32px; margin-bottom: 10px; }
    .invoice-title p { color: #666; font-size: 14px; }
    .details-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .details-box { width: 48%; }
    .details-box h3 { color: #10b981; font-size: 14px; margin-bottom: 10px; text-transform: uppercase; border-bottom: 2px solid #e5e5e5; padding-bottom: 5px; }
    .details-box p { color: #333; font-size: 13px; margin-bottom: 5px; line-height: 1.6; }
    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    .items-table thead { background: #10b981; color: white; }
    .items-table th { padding: 12px; text-align: left; font-size: 13px; font-weight: 600; }
    .items-table td { padding: 12px; border-bottom: 1px solid #e5e5e5; font-size: 13px; color: #333; }
    .items-table tbody tr:last-child td { border-bottom: 2px solid #10b981; }
    .totals { margin-left: auto; width: 300px; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e5e5; }
    .totals-row span:first-child { color: #666; font-size: 13px; }
    .totals-row span:last-child { color: #333; font-size: 13px; font-weight: 600; }
    .totals-row.total { border-top: 2px solid #10b981; border-bottom: 3px double #10b981; margin-top: 10px; padding: 15px 0; }
    .totals-row.total span { font-size: 16px; font-weight: bold; color: #10b981; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e5e5; text-align: center; }
    .footer p { color: #666; font-size: 12px; margin-bottom: 5px; }
    .payment-status { display: inline-block; padding: 8px 16px; background: #d1fae5; color: #059669; border-radius: 20px; font-weight: 600; font-size: 12px; margin: 20px 0; }
    @media print {
      body { background: white; padding: 0; }
      .invoice { box-shadow: none; padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="company-info">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <img src="${companyDetails.logo}" alt="${companyDetails.name}" class="logo" style="max-width: 60px; height: auto; margin-right: 12px;" onerror="this.style.display='none';" />
          <h1 style="color: #10b981; font-size: 24px; margin: 0;">${companyDetails.name}</h1>
        </div>
        <p><strong>Address:</strong> ${companyDetails.address}</p>
        <p>${companyDetails.city}</p>
        <p><strong>Email:</strong> ${companyDetails.email}</p>
        <p><strong>Phone:</strong> ${companyDetails.phone}</p>
        ${companyDetails.gstin ? `<p><strong>GSTIN:</strong> ${companyDetails.gstin}</p>` : ''}
        <p><strong>Website:</strong> ${companyDetails.website}</p>
      </div>
      <div class="invoice-title">
        <h2>INVOICE</h2>
        <p><strong>Invoice #:</strong> ${payment.invoiceNumber || order.orderNumber}</p>
        <p><strong>Date:</strong> ${new Date(payment.createdAt).toLocaleDateString('en-IN')}</p>
        <div class="payment-status">✓ PAID</div>
      </div>
    </div>

    <div class="details-section">
      <div class="details-box">
        <h3>Bill To</h3>
        <p><strong>${order.customer?.name || 'N/A'}</strong></p>
        <p>${order.customer?.email || ''}</p>
        <p>${order.customer?.phone || ''}</p>
      </div>
      <div class="details-box">
        <h3>Payment Details</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Payment ID:</strong> ${payment.razorpayPaymentId || 'N/A'}</p>
        <p><strong>Transaction ID:</strong> ${payment.razorpayPaymentId || payment.transactionId || 'N/A'}</p>
        <p><strong>Payment Date:</strong> ${new Date(payment.capturedAt || payment.createdAt).toLocaleDateString('en-IN')}</p>
        <p><strong>Payment Method:</strong> ${payment.paymentMode || payment.paymentGateway || 'Razorpay'}</p>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Plan/Package</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${serviceName}</td>
          <td>${pricingInfo?.name || pricingInfo?.planName || 'Standard Plan'}</td>
          <td style="text-align: right;">₹${baseAmount.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Subtotal</span>
        <span>₹${baseAmount.toFixed(2)}</span>
      </div>
      <div class="totals-row">
        <span>GST (${gstRate}%)</span>
        <span>₹${gstAmount.toFixed(2)}</span>
      </div>
      <div class="totals-row total">
        <span>Total Amount</span>
        <span>₹${totalAmount.toFixed(2)}</span>
      </div>
    </div>

    <div class="footer">
      <p><strong>Thank you for your business!</strong></p>
      <p>This is a computer-generated invoice and does not require a signature.</p>
      <p>For any queries, please contact us at ${companyDetails.email}</p>
      <p style="margin-top: 20px; color: #999; font-size: 11px;">Invoice generated on ${new Date().toLocaleDateString('en-IN')}</p>
    </div>
  </div>
  
  <script>
    // Auto-trigger print dialog when opened directly
    if (window.location.search.includes('print=true')) {
      window.print();
    }
  </script>
</body>
</html>
    `;

    // Set response headers for HTML invoice (user can print to PDF)
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `inline; filename="Invoice-${order.orderNumber}.html"`);
    res.send(invoiceHtml);

  } catch (error) {
    console.error('❌ Generate invoice error:', error);
    next(error);
  }
};
