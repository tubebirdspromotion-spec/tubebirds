import Razorpay from 'razorpay';
import crypto from 'crypto';

/**
 * Razorpay Service - Handles all Razorpay payment operations
 * Following industry best practices for payment gateway integration
 */

class RazorpayService {
  constructor() {
    this.razorpay = null;
    this.initialized = false;
    this.initializeRazorpay();
  }

  /**
   * Initialize Razorpay instance with credentials
   */
  initializeRazorpay() {
    try {
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.warn('⚠️ Razorpay credentials not configured');
        return;
      }

      this.razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });

      this.initialized = true;
      console.log('✅ Razorpay initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Razorpay:', error.message);
    }
  }

  /**
   * Check if Razorpay is properly configured
   */
  isConfigured() {
    return this.initialized && this.razorpay !== null;
  }

  /**
   * Create a Razorpay order
   * @param {Object} orderData - Order creation data
   * @returns {Promise<Object>} Razorpay order
   */
  async createOrder(orderData) {
    if (!this.isConfigured()) {
      throw new Error('Razorpay is not configured. Please check your credentials.');
    }

    try {
      const {
        amount,
        currency = 'INR',
        receipt,
        notes = {}
      } = orderData;

      // Validate amount
      if (!amount || amount <= 0) {
        throw new Error('Invalid amount. Amount must be greater than 0.');
      }

      // Convert amount to smallest currency unit (paise for INR)
      const amountInPaise = Math.round(amount * 100);

      const options = {
        amount: amountInPaise,
        currency,
        receipt,
        notes,
        payment_capture: 1 // Auto-capture payment
      };

      const razorpayOrder = await this.razorpay.orders.create(options);
      
      console.log(`✅ Razorpay order created: ${razorpayOrder.id}`);
      
      return razorpayOrder;
    } catch (error) {
      console.error('❌ Failed to create Razorpay order:', error.message);
      throw new Error(`Failed to create payment order: ${error.message}`);
    }
  }

  /**
   * Verify Razorpay payment signature
   * @param {Object} paymentData - Payment verification data
   * @returns {Boolean} Verification result
   */
  verifyPaymentSignature(paymentData) {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      } = paymentData;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new Error('Missing required payment verification parameters');
      }

      // Generate expected signature
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      const isValid = expectedSignature === razorpay_signature;

      if (isValid) {
        console.log(`✅ Payment signature verified: ${razorpay_payment_id}`);
      } else {
        console.warn(`⚠️ Invalid payment signature: ${razorpay_payment_id}`);
      }

      return isValid;
    } catch (error) {
      console.error('❌ Signature verification failed:', error.message);
      return false;
    }
  }

  /**
   * Verify webhook signature
   * @param {String} webhookBody - Raw webhook body
   * @param {String} webhookSignature - Signature from Razorpay
   * @returns {Boolean} Verification result
   */
  verifyWebhookSignature(webhookBody, webhookSignature) {
    try {
      if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
        console.warn('⚠️ Webhook secret not configured');
        return false;
      }

      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(webhookBody)
        .digest('hex');

      return expectedSignature === webhookSignature;
    } catch (error) {
      console.error('❌ Webhook signature verification failed:', error.message);
      return false;
    }
  }

  /**
   * Fetch payment details from Razorpay
   * @param {String} paymentId - Razorpay payment ID
   * @returns {Promise<Object>} Payment details
   */
  async fetchPaymentDetails(paymentId) {
    if (!this.isConfigured()) {
      throw new Error('Razorpay is not configured');
    }

    try {
      const payment = await this.razorpay.payments.fetch(paymentId);
      console.log(`✅ Fetched payment details: ${paymentId}`);
      return payment;
    } catch (error) {
      console.error('❌ Failed to fetch payment details:', error.message);
      throw new Error(`Failed to fetch payment: ${error.message}`);
    }
  }

  /**
   * Fetch order details from Razorpay
   * @param {String} orderId - Razorpay order ID
   * @returns {Promise<Object>} Order details
   */
  async fetchOrderDetails(orderId) {
    if (!this.isConfigured()) {
      throw new Error('Razorpay is not configured');
    }

    try {
      const order = await this.razorpay.orders.fetch(orderId);
      console.log(`✅ Fetched order details: ${orderId}`);
      return order;
    } catch (error) {
      console.error('❌ Failed to fetch order details:', error.message);
      throw new Error(`Failed to fetch order: ${error.message}`);
    }
  }

  /**
   * Process refund for a payment
   * @param {Object} refundData - Refund data
   * @returns {Promise<Object>} Refund details
   */
  async processRefund(refundData) {
    if (!this.isConfigured()) {
      throw new Error('Razorpay is not configured');
    }

    try {
      const {
        paymentId,
        amount,
        notes = {},
        speed = 'normal' // normal or optimum
      } = refundData;

      if (!paymentId) {
        throw new Error('Payment ID is required for refund');
      }

      const refundOptions = {
        notes,
        speed
      };

      // If amount is specified, process partial refund
      if (amount && amount > 0) {
        refundOptions.amount = Math.round(amount * 100); // Convert to paise
      }

      const refund = await this.razorpay.payments.refund(paymentId, refundOptions);
      
      console.log(`✅ Refund processed: ${refund.id} for payment ${paymentId}`);
      
      return refund;
    } catch (error) {
      console.error('❌ Failed to process refund:', error.message);
      throw new Error(`Refund failed: ${error.message}`);
    }
  }

  /**
   * Fetch refund details
   * @param {String} paymentId - Razorpay payment ID
   * @param {String} refundId - Razorpay refund ID
   * @returns {Promise<Object>} Refund details
   */
  async fetchRefundDetails(paymentId, refundId) {
    if (!this.isConfigured()) {
      throw new Error('Razorpay is not configured');
    }

    try {
      const refund = await this.razorpay.payments.fetchRefund(paymentId, refundId);
      console.log(`✅ Fetched refund details: ${refundId}`);
      return refund;
    } catch (error) {
      console.error('❌ Failed to fetch refund details:', error.message);
      throw new Error(`Failed to fetch refund: ${error.message}`);
    }
  }

  /**
   * Calculate GST breakdown
   * @param {Number} baseAmount - Amount before GST
   * @param {Number} gstRate - GST rate percentage (default 18%)
   * @returns {Object} GST breakdown
   */
  calculateGST(baseAmount, gstRate = 18) {
    const gstAmount = (baseAmount * gstRate) / 100;
    const totalAmount = baseAmount + gstAmount;

    return {
      baseAmount: parseFloat(baseAmount.toFixed(2)),
      gstRate: parseFloat(gstRate.toFixed(2)),
      gstAmount: parseFloat(gstAmount.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2))
    };
  }

  /**
   * Generate invoice number
   * @returns {String} Invoice number
   */
  generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `INV-${year}${month}${day}-${random}`;
  }

  /**
   * Get Razorpay key ID for client-side integration
   * @returns {String} Razorpay key ID
   */
  getKeyId() {
    return process.env.RAZORPAY_KEY_ID || '';
  }

  /**
   * Validate YouTube video URL
   * @param {String} url - YouTube URL
   * @returns {Boolean} Validation result
   */
  validateYouTubeUrl(url) {
    if (!url || typeof url !== 'string') {
      return false;
    }

    // YouTube URL patterns
    const patterns = [
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/v\/[\w-]+/,
      /^(https?:\/\/)?youtu\.be\/[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/
    ];

    return patterns.some(pattern => pattern.test(url));
  }

  /**
   * Extract YouTube video ID from URL
   * @param {String} url - YouTube URL
   * @returns {String|null} Video ID
   */
  extractYouTubeVideoId(url) {
    if (!url || typeof url !== 'string') {
      return null;
    }

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([^&?/\s]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }
}

// Export singleton instance
export default new RazorpayService();
