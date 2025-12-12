import User from '../models/User.js';
import { sendTokenResponse } from '../utils/tokenUtils.js';
import { sendPasswordResetEmail } from '../utils/emailService.js';
import twoFactorService from '../utils/twoFactorService.js';
import crypto from 'crypto';
import { sequelize } from '../config/db.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address'
      });
    }

    // Check if user exists (Sequelize)
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({
        status: 'error',
        message: 'Registration failed. Please try again with different information.'
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user (password will be auto-hashed by beforeCreate hook)
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'client',
      verificationToken
    });

    // EMAILS DISABLED FOR REGISTRATION
    // Only sending emails for: Order confirmation and Password reset
    // Uncomment below if you want to enable welcome/verification emails
    /*
    Promise.all([
      sendVerificationEmail(user, verificationToken).catch(err => {
        console.error('❌ Failed to send verification email:', err.message);
      }),
      sendWelcomeEmail(user).catch(err => {
        console.error('❌ Failed to send welcome email:', err.message);
      })
    ]).then(() => {
      console.log('✅ All registration emails sent successfully');
    }).catch(err => {
      console.error('⚠️ Some emails failed to send:', err.message);
    });
    */

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Check for user with password (use withPassword scope)
    const user = await User.scope('withPassword').findOne({ 
      where: { email } 
    });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Account is deactivated. Please contact admin.'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Check if user is admin and 2FA is enabled
    if (user.role === 'admin' && user.twoFactorEnabled) {
      // Generate temporary token for 2FA verification
      const tempToken = twoFactorService.generateTempToken(user.id);
      
      // Return 2FA required response
      return res.status(200).json({
        status: 'success',
        require2FA: true,
        tempToken,
        message: 'Please enter your backup code to complete login',
        unusedCodes: twoFactorService.getUnusedCodesCount(user.twoFactorBackupCodes)
      });
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    // Get user without password
    const userWithoutPassword = await User.findByPk(user.id);

    sendTokenResponse(userWithoutPassword, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      avatar: req.body.avatar
    };

    // Remove undefined values
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    await user.update(fieldsToUpdate);

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.scope('withPassword').findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(req.body.currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Update password (will be auto-hashed by beforeUpdate hook)
    await user.update({ password: req.body.newPassword });

    // Get user without password
    const userWithoutPassword = await User.findByPk(user.id);

    sendTokenResponse(userWithoutPassword, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ 
      where: { verificationToken: token } 
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired verification token'
      });
    }

    // Update user
    await user.update({
      isVerified: true,
      verificationToken: null
    });

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password - Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide your email address'
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Return success even if user not found (security best practice)
      return res.status(200).json({
        status: 'success',
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Save reset token to user
    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpire: resetTokenExpiry
    });

    // Send password reset email
    try {
      await sendPasswordResetEmail(user, resetToken);
      console.log('✅ Password reset email sent to:', user.email);
    } catch (emailError) {
      console.error('❌ Failed to send password reset email:', emailError.message);
      // Rollback token if email fails
      await user.update({
        resetPasswordToken: null,
        resetPasswordExpire: null
      });
      return res.status(500).json({
        status: 'error',
        message: 'Email could not be sent. Please try again later.'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Password reset link has been sent to your email'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a new password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 6 characters'
      });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpire: {
          [sequelize.Sequelize.Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or expired reset token'
      });
    }

    // Update password and clear reset token
    await user.update({
      password: password, // Will be hashed by beforeUpdate hook
      resetPasswordToken: null,
      resetPasswordExpire: null
    });

    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify 2FA backup code (Admin only)
// @route   POST /api/auth/verify-2fa
// @access  Public (requires tempToken)
export const verify2FA = async (req, res, next) => {
  try {
    const { tempToken, backupCode } = req.body;

    // Validate inputs
    if (!tempToken || !backupCode) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide temp token and backup code'
      });
    }

    // Verify temp token
    const tokenVerification = twoFactorService.verifyTempToken(tempToken);
    if (!tokenVerification.valid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired session. Please login again.'
      });
    }

    // Get user with backup codes
    const user = await User.scope('withPassword').findByPk(tokenVerification.userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid session'
      });
    }

    // Verify backup code
    const codeVerification = await twoFactorService.verifyBackupCode(
      backupCode,
      user.twoFactorBackupCodes
    );

    if (!codeVerification.valid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid backup code'
      });
    }

    // Mark code as used
    const updatedCodes = twoFactorService.markCodeAsUsed(
      user.twoFactorBackupCodes,
      codeVerification.codeIndex
    );

    await user.update({
      twoFactorBackupCodes: updatedCodes,
      lastLogin: new Date()
    });

    // Get unused codes count
    const unusedCount = twoFactorService.getUnusedCodesCount(updatedCodes);

    // Get user without password
    const userWithoutPassword = await User.findByPk(user.id);

    // Send token response
    sendTokenResponse(userWithoutPassword, 200, res, {
      unusedBackupCodes: unusedCount,
      warning: unusedCount <= 2 ? 'You have few backup codes remaining. Please regenerate them.' : null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enable 2FA for admin (generates backup codes)
// @route   POST /api/auth/enable-2fa
// @access  Private/Admin
export const enable2FA = async (req, res, next) => {
  try {
    // Only admins can enable 2FA
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Only admin users can enable 2FA'
      });
    }

    // Check if already enabled
    if (req.user.twoFactorEnabled) {
      return res.status(400).json({
        status: 'error',
        message: '2FA is already enabled. Use regenerate endpoint to get new codes.'
      });
    }

    // Generate 5 backup codes
    const plainCodes = twoFactorService.generateBackupCodes(5);
    
    // Hash codes for storage
    const hashedCodes = await twoFactorService.hashBackupCodes(plainCodes);

    // Update user
    await User.update(
      {
        twoFactorEnabled: true,
        twoFactorBackupCodes: hashedCodes
      },
      { where: { id: req.user.id } }
    );

    // Return plain codes (ONLY TIME THEY'RE SHOWN)
    res.status(200).json({
      status: 'success',
      message: '2FA enabled successfully! Save these backup codes securely.',
      backupCodes: plainCodes,
      warning: 'These codes will only be shown once. Store them securely!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Disable 2FA for admin
// @route   POST /api/auth/disable-2fa
// @access  Private/Admin
export const disable2FA = async (req, res, next) => {
  try {
    const { password } = req.body;

    // Verify password for security
    if (!password) {
      return res.status(400).json({
        status: 'error',
        message: 'Password is required to disable 2FA'
      });
    }

    const user = await User.scope('withPassword').findByPk(req.user.id);
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect password'
      });
    }

    // Disable 2FA
    await User.update(
      {
        twoFactorEnabled: false,
        twoFactorBackupCodes: null
      },
      { where: { id: req.user.id } }
    );

    res.status(200).json({
      status: 'success',
      message: '2FA disabled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Regenerate backup codes (Admin only)
// @route   POST /api/auth/regenerate-backup-codes
// @access  Private/Admin
export const regenerateBackupCodes = async (req, res, next) => {
  try {
    const { password } = req.body;

    // Verify password for security
    if (!password) {
      return res.status(400).json({
        status: 'error',
        message: 'Password is required to regenerate codes'
      });
    }

    const user = await User.scope('withPassword').findByPk(req.user.id);
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect password'
      });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({
        status: 'error',
        message: '2FA is not enabled'
      });
    }

    // Generate new backup codes
    const plainCodes = twoFactorService.generateBackupCodes(5);
    const hashedCodes = await twoFactorService.hashBackupCodes(plainCodes);

    // Update user
    await User.update(
      {
        twoFactorBackupCodes: hashedCodes
      },
      { where: { id: req.user.id } }
    );

    res.status(200).json({
      status: 'success',
      message: 'Backup codes regenerated successfully! Save these codes securely.',
      backupCodes: plainCodes,
      warning: 'These codes will only be shown once. Store them securely! Old codes are now invalid.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get 2FA status
// @route   GET /api/auth/2fa-status
// @access  Private
export const get2FAStatus = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    const unusedCount = user.twoFactorEnabled 
      ? twoFactorService.getUnusedCodesCount(user.twoFactorBackupCodes)
      : 0;

    res.status(200).json({
      status: 'success',
      data: {
        enabled: user.twoFactorEnabled || false,
        unusedBackupCodes: unusedCount,
        needsRegeneration: unusedCount <= 2
      }
    });
  } catch (error) {
    next(error);
  }
};
