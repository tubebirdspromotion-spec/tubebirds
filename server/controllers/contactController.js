import Contact from '../models/Contact.js';
import { sendContactNotification } from '../utils/emailService.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);

    // Send email notification to admin
    try {
      await sendContactNotification(contact);
    } catch (emailError) {
      console.error('Failed to send contact notification:', emailError);
      // Continue even if email fails
    }

    res.status(201).json({
      status: 'success',
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contacts (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
export const getContacts = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    
    if (status) {
      where.status = status;
    }

    const contacts = await Contact.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      results: contacts.length,
      data: { contacts }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single contact (Admin only)
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact not found'
      });
    }

    // Mark as read
    if (!contact.isRead) {
      await contact.update({ isRead: true });
    }

    res.status(200).json({
      status: 'success',
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact status (Admin only)
// @route   PUT /api/contact/:id
// @access  Private/Admin
export const updateContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact not found'
      });
    }

    await contact.update({ status: req.body.status });

    res.status(200).json({
      status: 'success',
      data: { contact }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact (Admin only)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact not found'
      });
    }

    await contact.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
