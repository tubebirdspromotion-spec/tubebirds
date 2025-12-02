import User from '../models/User.js';
import { sendTokenResponse } from '../utils/tokenUtils.js';
import { sendPasswordResetEmail } from '../utils/emailService.js';
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
        message: 'User already exists with this email'
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
        message: 'Invalid credentials'
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
        message: 'Invalid credentials'
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
