import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Two-Factor Authentication Service for Admin Login
 * Uses backup codes instead of TOTP for simplicity
 */

class TwoFactorService {
  /**
   * Generate 5 random backup codes (8 digits each)
   * @returns {Array} Array of plain text backup codes
   */
  generateBackupCodes(count = 5) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      // Generate 8-digit code
      const code = crypto.randomInt(10000000, 99999999).toString();
      codes.push(code);
    }
    return codes;
  }

  /**
   * Hash backup codes for storage
   * @param {Array} codes - Array of plain text codes
   * @returns {Promise<Array>} Array of hashed codes
   */
  async hashBackupCodes(codes) {
    const hashedCodes = [];
    for (const code of codes) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(code, salt);
      hashedCodes.push({
        code: hashed,
        used: false,
        createdAt: new Date()
      });
    }
    return hashedCodes;
  }

  /**
   * Verify a backup code
   * @param {string} inputCode - Code entered by user
   * @param {Array} storedCodes - Array of stored backup code objects
   * @returns {Promise<Object>} { valid: boolean, codeIndex: number }
   */
  async verifyBackupCode(inputCode, storedCodes) {
    if (!storedCodes || !Array.isArray(storedCodes)) {
      return { valid: false, codeIndex: -1 };
    }

    for (let i = 0; i < storedCodes.length; i++) {
      const codeObj = storedCodes[i];
      
      // Skip if code already used
      if (codeObj.used) continue;

      // Compare input with hashed code
      const isMatch = await bcrypt.compare(inputCode, codeObj.code);
      
      if (isMatch) {
        return { valid: true, codeIndex: i };
      }
    }

    return { valid: false, codeIndex: -1 };
  }

  /**
   * Mark a backup code as used
   * @param {Array} storedCodes - Array of stored backup code objects
   * @param {number} codeIndex - Index of code to mark as used
   * @returns {Array} Updated codes array
   */
  markCodeAsUsed(storedCodes, codeIndex) {
    const updatedCodes = [...storedCodes];
    updatedCodes[codeIndex].used = true;
    updatedCodes[codeIndex].usedAt = new Date();
    return updatedCodes;
  }

  /**
   * Check how many unused codes remain
   * @param {Array} storedCodes - Array of stored backup code objects
   * @returns {number} Count of unused codes
   */
  getUnusedCodesCount(storedCodes) {
    if (!storedCodes || !Array.isArray(storedCodes)) {
      return 0;
    }
    return storedCodes.filter(c => !c.used).length;
  }

  /**
   * Generate temporary 2FA token for session (valid for 10 minutes)
   * @param {number} userId - User ID
   * @returns {string} Temporary token
   */
  generateTempToken(userId) {
    const payload = {
      userId,
      timestamp: Date.now(),
      purpose: '2fa-pending'
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  /**
   * Verify temporary 2FA token
   * @param {string} token - Temporary token
   * @returns {Object} { valid: boolean, userId: number }
   */
  verifyTempToken(token) {
    try {
      const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      
      // Check if token expired (10 minutes)
      const now = Date.now();
      const tokenAge = now - payload.timestamp;
      const TEN_MINUTES = 10 * 60 * 1000;
      
      if (tokenAge > TEN_MINUTES) {
        return { valid: false, userId: null };
      }

      if (payload.purpose !== '2fa-pending') {
        return { valid: false, userId: null };
      }

      return { valid: true, userId: payload.userId };
    } catch (error) {
      return { valid: false, userId: null };
    }
  }
}

export default new TwoFactorService();
