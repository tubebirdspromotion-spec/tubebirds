import Consultation from '../models/Consultation.js';
import validator from 'validator';
// import { sendConsultationNotification, sendConsultationConfirmation } from '../utils/emailService.js';

// @desc    Submit consultation request
// @route   POST /api/consultations
// @access  Public
export const submitConsultation = async (req, res, next) => {
  try {
    // Validate and sanitize inputs
    const allowedFields = ['name', 'email', 'phone', 'service', 'preferredDate', 'preferredTime', 'message'];
    const consultationData = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        const value = req.body[field];
        // Sanitize string inputs to prevent XSS
        if (typeof value === 'string') {
          consultationData[field] = validator.escape(value.trim());
        } else {
          consultationData[field] = value;
        }
      }
    });

    // Validate required fields
    if (!consultationData.name || !consultationData.email || !consultationData.phone) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide name, email, and phone'
      });
    }

    const consultation = await Consultation.create(consultationData);

    // EMAILS DISABLED FOR CONSULTATIONS
    // Only sending emails for: Order confirmation and Password reset
    // Uncomment below if you want to enable consultation emails
    /*
    Promise.all([
      sendConsultationNotification(consultation).catch(err => {
        console.error('❌ Failed to send consultation notification to admin:', err.message);
      }),
      sendConsultationConfirmation(consultation).catch(err => {
        console.error('❌ Failed to send consultation confirmation to customer:', err.message);
      })
    ]).then(() => {
      console.log('✅ All consultation emails sent successfully');
    }).catch(err => {
      console.error('⚠️ Some consultation emails failed to send:', err.message);
    });
    */

    res.status(201).json({
      status: 'success',
      message: 'Thank you for your consultation request! We will contact you soon.',
      data: { consultation }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all consultation requests (Admin only)
// @route   GET /api/consultations
// @access  Private/Admin
export const getConsultations = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    
    if (status) {
      where.status = status;
    }

    const consultations = await Consultation.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      results: consultations.length,
      data: { consultations }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single consultation (Admin only)
// @route   GET /api/consultations/:id
// @access  Private/Admin
export const getConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        status: 'error',
        message: 'Consultation not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { consultation }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update consultation status (Admin only)
// @route   PATCH /api/consultations/:id
// @access  Private/Admin
export const updateConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        status: 'error',
        message: 'Consultation not found'
      });
    }

    const { status, notes } = req.body;
    const updates = {};
    
    if (status) updates.status = status;
    if (notes) updates.notes = notes;

    await consultation.update(updates);

    res.status(200).json({
      status: 'success',
      data: { consultation }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete consultation (Admin only)
// @route   DELETE /api/consultations/:id
// @access  Private/Admin
export const deleteConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        status: 'error',
        message: 'Consultation not found'
      });
    }

    await consultation.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Consultation deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
