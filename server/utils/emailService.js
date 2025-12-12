import { Resend } from 'resend';

// Initialize Resend - handle missing API key gracefully
let resend = null;
try {
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_api_key_here') {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error) {
  console.error('❌ Failed to initialize Resend:', error.message);
}

// Email enabled flag
const isEmailEnabled = () => {
  if (!resend || !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_api_key_here') {
    console.warn('⚠️ Resend API key not configured. Emails will not be sent.');
    return false;
  }
  return true;
};

/**
 * Send email using Resend API
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 */
export const sendEmail = async (options) => {
  try {
    // Check if email is enabled
    if (!isEmailEnabled()) {
      console.log('📧 Email disabled - skipping send to:', options.to);
      return { success: false, message: 'Email service not configured' };
    }

    // Validate required fields
    if (!options.to || !options.subject || !options.html) {
      throw new Error('Missing required email fields: to, subject, or html');
    }

    console.log(`📧 Sending email via Resend to: ${options.to}`);
    console.log(`   Subject: ${options.subject}`);
    
    const { data, error } = await resend.emails.send({
      from: `${process.env.FROM_NAME || 'TubeBirds Promotion'} <${process.env.FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html
    });

    if (error) {
      console.error('❌ Resend API error:', error);
      throw new Error(`Resend error: ${error.message}`);
    }

    console.log('✅ Email sent successfully via Resend');
    console.log('   Email ID:', data.id);
    
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send welcome email to new user
 * DISABLED - Only sending emails for purchases and password reset
 */
export const sendWelcomeEmail = async (user) => {
  console.log('📧 Welcome email disabled - skipping for user:', user.email);
  return { success: false, message: 'Welcome email disabled' };
};

/**
 * Send email verification
 * DISABLED - Only sending emails for purchases and password reset
 */
export const sendVerificationEmail = async (user, verificationToken) => {
  console.log('📧 Verification email disabled - skipping for user:', user.email);
  return { success: false, message: 'Verification email disabled' };
};

/**
 * Send order confirmation email (ACTIVE)
 */
export const sendOrderConfirmation = async (order, user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .plan-box { background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #667eea; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .status-badge { background: #667eea; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; display: inline-block; }
        .feature-list { margin: 10px 0; padding-left: 20px; }
        .feature-list li { margin: 5px 0; color: #4b5563; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Order Confirmed!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Your order is now being processed</p>
        </div>
        <div class="content">
          <h2>Hi ${user.name},</h2>
          <p>Thank you for choosing TubeBirds! We've received your payment and your order is now in processing. Our team will start working on it right away.</p>
          
          <div class="order-details">
            <div style="text-align: center; margin-bottom: 20px;">
              <span class="status-badge">● ${order.status?.toUpperCase() || 'PROCESSING'}</span>
            </div>
            
            <h3 style="color: #667eea; margin-bottom: 15px;">📋 Order Information</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
            <p><strong>Order Status:</strong> <span style="color: #667eea; font-weight: bold;">${order.status?.toUpperCase() || 'PROCESSING'}</span></p>
            
            <hr style="margin: 20px 0; border: none; border-top: 2px solid #667eea;">
            
            <h3 style="color: #667eea; margin-bottom: 15px;">📦 Plan & Service Details</h3>
            <div class="plan-box">
              <p style="margin: 5px 0; font-size: 16px;"><strong>🎯 Service:</strong> ${order.service?.title || 'N/A'}</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>📌 Plan:</strong> ${order.pricing?.name || 'N/A'}</p>
              ${order.pricing?.serviceType ? `<p style="margin: 5px 0;"><strong>Type:</strong> ${order.pricing.serviceType}</p>` : ''}
              ${order.pricing?.tier ? `<p style="margin: 5px 0;"><strong>Tier:</strong> <span style="text-transform: capitalize;">${order.pricing.tier}</span></p>` : ''}
              ${order.pricing?.quantity ? `<p style="margin: 5px 0;"><strong>Quantity:</strong> ${order.pricing.quantity}</p>` : ''}
              ${order.pricing?.duration ? `<p style="margin: 5px 0;"><strong>Duration:</strong> ${order.pricing.duration}</p>` : ''}
              ${order.pricing?.deliveryTime ? `<p style="margin: 5px 0;"><strong>Delivery Time:</strong> ${order.pricing.deliveryTime}</p>` : ''}
              
              ${order.pricing?.features && Array.isArray(order.pricing.features) && order.pricing.features.length > 0 ? `
                <div style="margin-top: 10px;">
                  <strong>✨ Plan Features:</strong>
                  <ul class="feature-list">
                    ${order.pricing.features.map(feature => `<li>✓ ${feature}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
            
            ${order.channelDetails?.channelName || order.channelDetails?.videoUrl ? `
              <h3 style="color: #667eea; margin: 20px 0 15px 0;">🎬 Your Channel/Video Details</h3>
              <div style="background: #f9fafb; padding: 12px; border-radius: 5px;">
                ${order.channelDetails?.channelName ? `<p style="margin: 5px 0;"><strong>Channel Name:</strong> ${order.channelDetails.channelName}</p>` : ''}
                ${order.channelDetails?.channelUrl ? `<p style="margin: 5px 0; word-break: break-all;"><strong>Channel URL:</strong> <a href="${order.channelDetails.channelUrl}" style="color: #667eea;">${order.channelDetails.channelUrl}</a></p>` : ''}
                ${order.channelDetails?.videoUrl ? `<p style="margin: 5px 0; word-break: break-all;"><strong>Video URL:</strong> <a href="${order.channelDetails.videoUrl}" style="color: #667eea;">${order.channelDetails.videoUrl}</a></p>` : ''}
              </div>
            ` : ''}
            
            <hr style="margin: 20px 0; border: none; border-top: 2px solid #667eea;">
            
            <h3 style="color: #667eea; margin-bottom: 15px;">💰 Payment Summary</h3>
            ${order.baseAmount ? `
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0;">Base Amount:</td>
                  <td style="text-align: right; padding: 8px 0;">₹${parseFloat(order.baseAmount).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">GST (${order.gstRate || 18}%):</td>
                  <td style="text-align: right; padding: 8px 0;">₹${parseFloat(order.gstAmount).toFixed(2)}</td>
                </tr>
                <tr style="border-top: 2px solid #667eea;">
                  <td style="padding: 12px 0; font-size: 18px; font-weight: bold; color: #667eea;">Total Amount:</td>
                  <td style="text-align: right; padding: 12px 0; font-size: 18px; font-weight: bold; color: #667eea;">₹${parseFloat(order.amount).toFixed(2)}</td>
                </tr>
              </table>
            ` : `
              <p style="font-size: 18px; color: #667eea; font-weight: bold;">Total Amount: ₹${parseFloat(order.amount).toFixed(2)}</p>
            `}
            
            <hr style="margin: 20px 0; border: none; border-top: 1px dashed #d1d5db;">
            
            <h3 style="color: #667eea; margin-bottom: 15px;">⏱️ Delivery Timeline</h3>
            <p><strong>Start Date:</strong> ${order.startDate ? new Date(order.startDate).toLocaleDateString('en-IN') : 'Today'}</p>
            <p><strong>Expected Completion:</strong> ${order.estimatedCompletionDate ? new Date(order.estimatedCompletionDate).toLocaleDateString('en-IN') : '3-5 business days'}</p>
            
            <div style="background: #fef3c7; padding: 12px; border-radius: 5px; margin-top: 15px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>⏳ Processing:</strong> Our team will review your order and start working on it within 24 hours.
              </p>
            </div>
          </div>
          
          <div style="background: #ede9fe; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #8b5cf6;">
            <p style="margin: 0 0 10px 0; color: #5b21b6; font-weight: bold;">📱 Track Your Order</p>
            <p style="margin: 0; color: #6b21a8; font-size: 14px;">
              • View real-time status updates<br>
              • Get notified at each milestone<br>
              • Direct communication with our team<br>
              • Download receipts and invoices
            </p>
          </div>
          
          <p style="text-align: center;">
            <a href="${process.env.CLIENT_URL?.split(',')[0]}/dashboard/orders/${order.id}" class="button">📊 View Order Status</a>
          </p>
          
          <p style="text-align: center; color: #6b7280; font-size: 14px; margin: 20px 0;">
            Questions? Contact us at <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #667eea; text-decoration: none;">${process.env.ADMIN_EMAIL}</a>
          </p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} TubeBirds Promotion. All rights reserved.</p>
          <p>You're receiving this email because you placed an order with us.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: `🎉 Order Confirmed - ${order.orderNumber} | TubeBirds`,
    html
  });
};

/**
 * Send consultation confirmation to customer
 * DISABLED - Only sending emails for purchases and password reset
 */
export const sendConsultationConfirmation = async (consultation) => {
  console.log('📧 Consultation confirmation disabled - skipping for:', consultation.email);
  return { success: false, message: 'Consultation email disabled' };
};

/**
 * Send consultation notification to admin
 * DISABLED - Only sending emails for purchases and password reset
 */
export const sendConsultationNotification = async (consultation) => {
  console.log('📧 Admin consultation notification disabled - skipping');
  return { success: false, message: 'Consultation notification disabled' };
};

/**
 * Send contact form notification to admin
 * DISABLED - Only sending emails for purchases and password reset
 */
export const sendContactNotification = async (contact) => {
  console.log('📧 Contact notification disabled - skipping');
  return { success: false, message: 'Contact notification disabled' };
};

/**
 * Send payment receipt (ACTIVE)
 */
export const sendPaymentReceipt = async (order, payment, user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .receipt { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border: 2px solid #10b981; }
        .plan-details { background: #f0fdf4; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #10b981; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .success-badge { background: #10b981; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px; display: inline-block; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Payment Successful</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">Thank you for choosing TubeBirds!</p>
        </div>
        <div class="content">
          <h2>Hi ${user.name},</h2>
          <p>Your payment has been received successfully! Here's your complete payment receipt with all details.</p>
          
          <div class="receipt">
            <div style="text-align: center; margin-bottom: 20px;">
              <span class="success-badge">✓ PAYMENT CONFIRMED</span>
            </div>
            
            <h3 style="color: #10b981; margin-bottom: 15px;">📋 Payment Details</h3>
            <p><strong>Transaction ID:</strong> ${payment.transactionId}</p>
            <p><strong>Razorpay Payment ID:</strong> ${payment.razorpayPaymentId || 'N/A'}</p>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Invoice Number:</strong> ${payment.invoiceNumber || order.orderNumber}</p>
            <p><strong>Payment Date:</strong> ${new Date(payment.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
            <p><strong>Payment Method:</strong> ${payment.paymentMode ? payment.paymentMode.toUpperCase() : (payment.paymentGateway ? payment.paymentGateway.toUpperCase() : 'RAZORPAY')}</p>
            <p><strong>Payment Gateway:</strong> ${payment.paymentGateway ? payment.paymentGateway.toUpperCase() : 'RAZORPAY'}</p>
            <p><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">✓ ${payment.status.toUpperCase()}</span></p>
            
            <hr style="margin: 20px 0; border: none; border-top: 2px solid #10b981;">
            
            <h3 style="color: #10b981; margin-bottom: 15px;">📦 Plan Details</h3>
            <div class="plan-details">
              <p style="margin: 5px 0;"><strong>Service:</strong> ${order.service?.title || 'N/A'}</p>
              <p style="margin: 5px 0;"><strong>Plan Name:</strong> ${order.pricing?.name || 'N/A'}</p>
              <p style="margin: 5px 0;"><strong>Plan Type:</strong> ${order.pricing?.serviceType || 'N/A'}</p>
              ${order.pricing?.quantity ? `<p style="margin: 5px 0;"><strong>Quantity:</strong> ${order.pricing.quantity}</p>` : ''}
              ${order.pricing?.tier ? `<p style="margin: 5px 0;"><strong>Tier:</strong> ${order.pricing.tier}</p>` : ''}
              ${order.pricing?.duration ? `<p style="margin: 5px 0;"><strong>Duration:</strong> ${order.pricing.duration}</p>` : ''}
              ${order.pricing?.features ? `<p style="margin: 5px 0;"><strong>Features:</strong> ${Array.isArray(order.pricing.features) ? order.pricing.features.join(', ') : order.pricing.features}</p>` : ''}
            </div>
            
            ${order.channelDetails?.channelName || order.channelDetails?.videoUrl ? `
              <h3 style="color: #10b981; margin: 20px 0 15px 0;">🎬 Channel/Video Details</h3>
              ${order.channelDetails?.channelName ? `<p><strong>Channel Name:</strong> ${order.channelDetails.channelName}</p>` : ''}
              ${order.channelDetails?.channelUrl ? `<p><strong>Channel URL:</strong> ${order.channelDetails.channelUrl}</p>` : ''}
              ${order.channelDetails?.videoUrl ? `<p><strong>Video URL:</strong> ${order.channelDetails.videoUrl}</p>` : ''}
            ` : ''}
            
            <hr style="margin: 20px 0; border: none; border-top: 2px solid #10b981;">
            
            <h3 style="color: #10b981; margin-bottom: 15px;">💰 Payment Breakdown</h3>
            ${order.baseAmount ? `
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0;"><strong>Base Amount:</strong></td>
                  <td style="text-align: right; padding: 8px 0;">₹${parseFloat(order.baseAmount).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>GST (${order.gstRate || 18}%):</strong></td>
                  <td style="text-align: right; padding: 8px 0;">₹${parseFloat(order.gstAmount).toFixed(2)}</td>
                </tr>
                <tr style="border-top: 2px solid #10b981;">
                  <td style="padding: 12px 0; font-size: 18px; font-weight: bold; color: #10b981;">Total Paid:</td>
                  <td style="text-align: right; padding: 12px 0; font-size: 18px; font-weight: bold; color: #10b981;">₹${parseFloat(payment.amount).toFixed(2)}</td>
                </tr>
              </table>
            ` : `
              <p style="font-size: 18px; color: #10b981; font-weight: bold;">Amount Paid: ₹${parseFloat(payment.amount).toFixed(2)}</p>
            `}
            
            <p style="margin-top: 15px; font-size: 12px; color: #666; font-style: italic;">
              * GST is included as per Indian tax regulations<br>
              * This receipt is valid as proof of payment
            </p>
          </div>
          
          <div style="background: #dbeafe; padding: 15px; border-radius: 5px; border-left: 4px solid #3b82f6; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af;"><strong>📌 What's Next?</strong></p>
            <p style="margin: 5px 0 0 0; color: #1e3a8a;">
              • Your order is now being processed by our team<br>
              • You will receive updates via email<br>
              • Track your order anytime from your dashboard<br>
              • Expected completion: ${order.estimatedCompletionDate ? new Date(order.estimatedCompletionDate).toLocaleDateString('en-IN') : '3-5 business days'}
            </p>
          </div>
          
          <p style="text-align: center; margin: 25px 0;">
            <a href="${process.env.CLIENT_URL?.split(',')[0]}/dashboard/orders/${order.id}" 
               style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              View Order Details
            </a>
          </p>
          
          <p style="color: #666; font-size: 14px; text-align: center;">
            Need help? Contact us at <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #10b981;">${process.env.ADMIN_EMAIL}</a>
          </p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} TubeBirds Promotion. All rights reserved.</p>
          <p>This is an automated receipt. Please save this email for your records.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: `✅ Payment Receipt - ${order.orderNumber} | TubeBirds`,
    html
  });
};

/**
 * Send password reset email (ACTIVE)
 */
export const sendPasswordResetEmail = async (user, resetToken) => {
  // Handle multiple CLIENT_URLs (comma-separated) - use production URL or first one
  const clientUrls = process.env.CLIENT_URL.split(',').map(url => url.trim());
  const clientUrl = clientUrls.find(url => url.includes('vercel.app') || url.includes('tubebirdspromotion.com')) || clientUrls[0];
  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hi ${user.name},</h2>
          <p>We received a request to reset your password for your TubeBirds Promotion account.</p>
          <p>Click the button below to reset your password:</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </p>
          <p>Or copy this link to your browser:</p>
          <p style="word-break: break-all; color: #dc2626;">${resetUrl}</p>
          <div class="warning">
            <p><strong>⚠️ Important:</strong></p>
            <ul>
              <li>This link will expire in 30 minutes</li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Your password won't change until you create a new one</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} TubeBirds Promotion. All rights reserved.</p>
          <p>If you need help, contact us at ${process.env.ADMIN_EMAIL}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: '🔐 Reset Your Password - TubeBirds Promotion',
    html
  });
};

export default {
  sendEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
  sendOrderConfirmation,
  sendConsultationConfirmation,
  sendConsultationNotification,
  sendContactNotification,
  sendPaymentReceipt,
  sendPasswordResetEmail
};
