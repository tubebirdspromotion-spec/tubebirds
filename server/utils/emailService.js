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
        .order-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Hi ${user.name},</h2>
          <p>Thank you for your order! We've received your payment and will start processing your order shortly.</p>
          <div class="order-details">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Service:</strong> ${order.service?.name || 'N/A'}</p>
            <p><strong>Plan:</strong> ${order.pricing?.planName || 'N/A'}</p>
            <hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">
            <h4 style="margin-bottom: 10px;">Payment Breakdown</h4>
            ${order.baseAmount ? `
              <p><strong>Base Amount:</strong> ₹${parseFloat(order.baseAmount).toFixed(2)}</p>
              <p><strong>GST (${order.gstRate || 18}%):</strong> ₹${parseFloat(order.gstAmount).toFixed(2)}</p>
              <p style="font-size: 18px; color: #667eea;"><strong>Total Amount:</strong> ₹${parseFloat(order.amount).toFixed(2)}</p>
            ` : `<p><strong>Amount:</strong> ₹${parseFloat(order.amount).toFixed(2)}</p>`}
            <hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Expected Completion:</strong> ${new Date(order.estimatedCompletionDate).toLocaleDateString()}</p>
          </div>
          <p>You can track your order progress anytime from your dashboard.</p>
          <p style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/dashboard/orders/${order.id}" class="button">View Order</a>
          </p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} TubeBirds Promotion. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
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
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Payment Successful</h1>
        </div>
        <div class="content">
          <h2>Hi ${user.name},</h2>
          <p>Your payment has been received successfully!</p>
          <div class="receipt">
            <h3>Payment Receipt</h3>
            <p><strong>Transaction ID:</strong> ${payment.transactionId}</p>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">
            <h4 style="margin-bottom: 10px;">Payment Breakdown</h4>
            ${order.baseAmount ? `
              <p><strong>Base Amount:</strong> ₹${parseFloat(order.baseAmount).toFixed(2)}</p>
              <p><strong>GST (${order.gstRate || 18}%):</strong> ₹${parseFloat(order.gstAmount).toFixed(2)}</p>
              <p style="font-size: 18px; color: #10b981;"><strong>Total Paid:</strong> ₹${parseFloat(payment.amount).toFixed(2)}</p>
            ` : `<p><strong>Amount Paid:</strong> ₹${parseFloat(payment.amount).toFixed(2)}</p>`}
            <hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">
            <p><strong>Payment Method:</strong> ${payment.gateway.toUpperCase()}</p>
            <p><strong>Status:</strong> <span style="color: #10b981;">✓ ${payment.status.toUpperCase()}</span></p>
            <p><strong>Date:</strong> ${new Date(payment.createdAt).toLocaleString()}</p>
            <p style="margin-top: 15px; font-size: 12px; color: #666;"><em>GST is included as per Indian tax regulations</em></p>
          </div>
          <p>Your order is now being processed. You will receive updates via email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} TubeBirds Promotion. All rights reserved.</p>
          <p>This is an automated receipt. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: `Payment Receipt - ${order.orderNumber}`,
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
