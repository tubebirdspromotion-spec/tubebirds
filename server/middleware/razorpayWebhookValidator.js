import { isIP } from 'net';

/**
 * Razorpay Webhook IP Whitelist
 * Source: https://razorpay.com/docs/webhooks/validate-ip-addresses/
 * 
 * Razorpay sends webhooks from these IP ranges:
 * - 3.6.127.0/25 (AWS Mumbai)
 * - 3.7.171.128/25 (AWS Mumbai)
 */

const RAZORPAY_IP_RANGES = [
  // AWS Mumbai Region - Range 1
  { start: '3.6.127.0', end: '3.6.127.127' },
  // AWS Mumbai Region - Range 2
  { start: '3.7.171.128', end: '3.7.171.255' }
];

/**
 * Convert IP address to integer for comparison
 */
const ipToInt = (ip) => {
  return ip.split('.').reduce((int, octet) => (int << 8) + parseInt(octet, 10), 0) >>> 0;
};

/**
 * Check if IP is within a range
 */
const isIpInRange = (ip, range) => {
  const ipInt = ipToInt(ip);
  const startInt = ipToInt(range.start);
  const endInt = ipToInt(range.end);
  return ipInt >= startInt && ipInt <= endInt;
};

/**
 * Validate if IP is from Razorpay
 */
const isRazorpayIP = (ip) => {
  // Handle IPv6 and forwarded IPs
  const cleanIp = ip.includes(':') ? ip.split(':').pop() : ip.split(',')[0].trim();
  
  // Validate it's a proper IPv4
  if (isIP(cleanIp) !== 4) {
    return false;
  }
  
  return RAZORPAY_IP_RANGES.some(range => isIpInRange(cleanIp, range));
};

/**
 * Middleware to validate Razorpay webhook IP
 */
export const validateRazorpayWebhookIP = (req, res, next) => {
  // Skip IP validation in development mode (for testing)
  if (process.env.NODE_ENV === 'development' && process.env.SKIP_WEBHOOK_IP_CHECK === 'true') {
    return next();
  }

  // Get client IP (handle proxies)
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || 
                   req.headers['x-real-ip'] || 
                   req.socket.remoteAddress || 
                   req.ip;

  if (!clientIp) {
    console.warn('⚠️ Webhook request with no IP address');
    return res.status(403).json({
      status: 'error',
      message: 'Access denied'
    });
  }

  // Validate IP is from Razorpay
  if (!isRazorpayIP(clientIp)) {
    console.warn(`🚨 Unauthorized webhook attempt from IP: ${clientIp}`);
    return res.status(403).json({
      status: 'error',
      message: 'Access denied'
    });
  }

  // IP is valid, continue
  next();
};

export default validateRazorpayWebhookIP;
