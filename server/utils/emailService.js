import nodemailer from 'nodemailer';

// Lazy initialization - create transporter only when needed
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    // Debug: Log SMTP configuration (remove in production)
    console.log('📧 Initializing SMTP Configuration:');
    console.log('  Host:', process.env.SMTP_HOST);
    console.log('  Port:', process.env.SMTP_PORT);
    console.log('  User:', process.env.SMTP_USER);
    console.log('  Pass:', process.env.SMTP_PASSWORD ? '***' + process.env.SMTP_PASSWORD.slice(-4) : 'NOT SET');
    
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: true, // SSL/TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    
    // Verify connection configuration
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email service configuration error:', error);
      } else {
        console.log('✅ Email service is ready to send messages');
      }
    });
  }
  return transporter;
};

/**
 * Send email using Hostinger SMTP
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @param {string} options.text - Email plain text (optional)
 */
export const sendEmail = async (options) => {
  try {
    const transporter = getTransporter();
    const mailOptions = {
      from: `${process.env.FROM_NAME || 'TubeBirds Promotion'} <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || ''
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send welcome email to new user
 */
export const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to TubeBirds Promotion!</h1>
        </div>
        <div class="content">
          <h2>Hi ${user.name},</h2>
          <p>Thank you for registering with TubeBirds Promotion! We're excited to help you grow your YouTube channel.</p>
          <p>Your account has been successfully created. You can now:</p>
          <ul>
            <li>Browse our services and pricing plans</li>
            <li>Place orders for channel growth services</li>
            <li>Track your order progress in real-time</li>
            <li>Access your personalized dashboard</li>
          </ul>
          <p style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/login" class="button">Login to Your Account</a>
          </p>
          <p>If you have any questions, feel free to contact us anytime!</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} TubeBirds Promotion. All rights reserved.</p>
          <p>tubebirdspromotion.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Welcome to TubeBirds Promotion!',
    html
  });
};

/**
 * Send email verification
 */
export const sendVerificationEmail = async (user, verificationToken) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Email</h1>
        </div>
        <div class="content">
          <h2>Hi ${user.name},</h2>
          <p>Thank you for registering! Please verify your email address to activate your account.</p>
          <p style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </p>
          <p>Or copy this link to your browser:</p>
          <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
          <p><strong>This link will expire in 24 hours.</strong></p>
          <p>If you didn't create this account, please ignore this email.</p>
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
    subject: 'Verify Your Email - TubeBirds Promotion',
    html
  });
};

/**
 * Send order confirmation email
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
            <p><strong>Amount:</strong> ₹${order.amount}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Expected Completion:</strong> ${new Date(order.estimatedCompletionDate).toLocaleDateString()}</p>
          </div>
          <p>You can track your order progress anytime from your dashboard.</p>
          <p style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/client/orders/${order.id}" class="button">View Order</a>
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
 * Send consultation notification to admin
 */
export const sendConsultationNotification = async (consultation) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@tubebirdspromotion.com';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 New Consultation Request</h1>
        </div>
        <div class="content">
          <p>A new consultation request has been submitted:</p>
          <div class="details">
            <p><strong>Name:</strong> ${consultation.name}</p>
            <p><strong>Email:</strong> ${consultation.email}</p>
            <p><strong>Phone:</strong> ${consultation.phone}</p>
            <p><strong>Service Interest:</strong> ${consultation.serviceInterest}</p>
            <p><strong>Message:</strong></p>
            <p>${consultation.message}</p>
            <p><strong>Submitted:</strong> ${new Date(consultation.createdAt).toLocaleString()}</p>
          </div>
          <p>Please respond to this request as soon as possible.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: adminEmail,
    subject: '🔔 New Consultation Request',
    html
  });
};

/**
 * Send contact form notification to admin
 */
export const sendContactNotification = async (contact) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@tubebirdspromotion.com';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 New Contact Message</h1>
        </div>
        <div class="content">
          <p>You have received a new contact form submission:</p>
          <div class="details">
            <p><strong>Name:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Phone:</strong> ${contact.phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${contact.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${contact.message}</p>
            <p><strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: adminEmail,
    subject: `📧 New Contact: ${contact.subject}`,
    html
  });
};

/**
 * Send payment receipt
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
            <p><strong>Amount Paid:</strong> ₹${payment.amount}</p>
            <p><strong>Payment Method:</strong> ${payment.gateway}</p>
            <p><strong>Status:</strong> ${payment.status}</p>
            <p><strong>Date:</strong> ${new Date(payment.createdAt).toLocaleString()}</p>
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

export default {
  sendEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
  sendOrderConfirmation,
  sendConsultationNotification,
  sendContactNotification,
  sendPaymentReceipt
};
