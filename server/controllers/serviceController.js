import Service from '../models/Service.js';

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res, next) => {
  try {
    const services = await Service.findAll({
      where: { isActive: true },
      order: [['order', 'ASC']]
    });

    res.status(200).json({
      status: 'success',
      results: services.length,
      data: { services }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service by slug
// @route   GET /api/services/:slug
// @access  Public
export const getService = async (req, res, next) => {
  try {
    const service = await Service.findOne({ 
      where: { 
        slug: req.params.slug, 
        isActive: true 
      } 
    });

    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { service }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create service (Admin only)
// @route   POST /api/services
// @access  Private/Admin
export const createService = async (req, res, next) => {
  try {
    // Security: Whitelist allowed fields
    const allowedFields = ['name', 'slug', 'category', 'description', 'icon', 'order', 'isActive', 'isFeatured'];
    const serviceData = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        serviceData[field] = req.body[field];
      }
    });

    const service = await Service.create(serviceData);

    res.status(201).json({
      status: 'success',
      data: { service }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service (Admin only)
// @route   PUT /api/services/:id
// @access  Private/Admin
export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      });
    }

    // Security: Whitelist allowed fields
    const allowedFields = ['name', 'slug', 'category', 'description', 'icon', 'order', 'isActive', 'isFeatured'];
    const updates = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await service.update(updates);

    res.status(200).json({
      status: 'success',
      data: { service }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service (Admin only)
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({
        status: 'error',
        message: 'Service not found'
      });
    }

    await service.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Service deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
