import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import validator from 'validator';

// @desc    Submit review (Client only)
// @route   POST /api/reviews
// @access  Private/Client
export const submitReview = async (req, res, next) => {
  try {
    const { orderId, rating, comment } = req.body;

    // Validate inputs
    if (!orderId || !rating) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide orderId and rating'
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Rating must be between 1 and 5'
      });
    }

    // Sanitize comment to prevent XSS
    const sanitizedComment = comment ? validator.escape(comment.trim()) : '';

    // Check if order exists and belongs to user
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    if (order.customerId !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to review this order'
      });
    }

    // Check if order is completed
    if (order.status !== 'completed') {
      return res.status(400).json({
        status: 'error',
        message: 'You can only review completed orders'
      });
    }

    // Check if review already exists for this order
    const existingReview = await Review.findOne({ where: { orderId } });

    if (existingReview) {
      return res.status(400).json({
        status: 'error',
        message: 'Review already submitted for this order'
      });
    }

    const review = await Review.create({
      orderId,
      customerId: req.user.id,
      serviceId: order.serviceId,
      rating,
      comment: sanitizedComment,
      isApproved: false
    });

    res.status(201).json({
      status: 'success',
      message: 'Thank you for your review! It will be published after approval.',
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews (with filters)
// @route   GET /api/reviews
// @access  Public (only approved) / Admin (all)
export const getReviews = async (req, res, next) => {
  try {
    const { serviceId, isApproved, rating } = req.query;
    const where = {};

    // Non-admin users only see approved reviews
    if (req.user?.role !== 'admin') {
      where.isApproved = true;
    } else if (isApproved !== undefined) {
      where.isApproved = isApproved === 'true';
    }

    if (serviceId) where.serviceId = serviceId;
    if (rating) where.rating = parseInt(rating);

    const reviews = await Review.findAll({
      where,
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'name']
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'name', 'category']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: { reviews }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public (if approved) / Admin
export const getReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'name', 'category']
        },
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'orderNumber', 'status']
        }
      ]
    });

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    // Non-admin users can only view approved reviews
    if (req.user?.role !== 'admin' && !review.isApproved) {
      return res.status(403).json({
        status: 'error',
        message: 'Review not available'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Reject review (Admin only)
// @route   PATCH /api/reviews/:id/approve
// @access  Private/Admin
export const approveReview = async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    await review.update({ 
      isApproved,
      approvedAt: isApproved ? new Date() : null 
    });

    res.status(200).json({
      status: 'success',
      message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
      data: { review }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review (Admin only)
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    await review.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
