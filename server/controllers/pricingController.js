import Pricing from '../models/Pricing.js';
import Service from '../models/Service.js';

// @desc    Get all pricing plans
// @route   GET /api/pricing
// @access  Public
export const getPricingPlans = async (req, res, next) => {
  try {
    const { category } = req.query;
    const where = { isActive: true };
    
    if (category) {
      where.category = category;
    }

    const plans = await Pricing.findAll({
      where,
      order: [['order', 'ASC'], ['price', 'ASC']],
      include: [{
        model: Service,
        as: 'service',
        attributes: ['id', 'title', 'slug']
      }]
    });

    res.status(200).json({
      status: 'success',
      results: plans.length,
      data: { plans }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pricing plan
// @route   GET /api/pricing/:id
// @access  Public
export const getPricingPlan = async (req, res, next) => {
  try {
    const plan = await Pricing.findByPk(req.params.id, {
      include: [{
        model: Service,
        as: 'service'
      }]
    });

    if (!plan) {
      return res.status(404).json({
        status: 'error',
        message: 'Pricing plan not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { plan }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create pricing plan (Admin only)
// @route   POST /api/pricing
// @access  Private/Admin
export const createPricingPlan = async (req, res, next) => {
  try {
    const plan = await Pricing.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { plan }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pricing plan (Admin only)
// @route   PUT /api/pricing/:id
// @access  Private/Admin
export const updatePricingPlan = async (req, res, next) => {
  try {
    const plan = await Pricing.findByPk(req.params.id);

    if (!plan) {
      return res.status(404).json({
        status: 'error',
        message: 'Pricing plan not found'
      });
    }

    await plan.update(req.body);

    res.status(200).json({
      status: 'success',
      data: { plan }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pricing plan (Admin only)
// @route   DELETE /api/pricing/:id
// @access  Private/Admin
export const deletePricingPlan = async (req, res, next) => {
  try {
    const plan = await Pricing.findByPk(req.params.id);

    if (!plan) {
      return res.status(404).json({
        status: 'error',
        message: 'Pricing plan not found'
      });
    }

    await plan.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Pricing plan deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
