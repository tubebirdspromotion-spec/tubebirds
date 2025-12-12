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
      order: [['displayOrder', 'ASC'], ['price', 'ASC']],
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
    // Security: Whitelist allowed fields
    const allowedFields = ['serviceId', 'planName', 'category', 'quantity', 'price', 'originalPrice', 'discount', 'deliveryTime', 'features', 'isPopular', 'order', 'isActive'];
    const pricingData = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        pricingData[field] = req.body[field];
      }
    });

    const plan = await Pricing.create(pricingData);

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

    // Security: Whitelist allowed fields
    const allowedFields = ['serviceId', 'planName', 'category', 'quantity', 'price', 'originalPrice', 'discount', 'deliveryTime', 'features', 'isPopular', 'order', 'isActive'];
    const updates = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await plan.update(updates);

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

// @desc    Update pricing plan prices (Admin only)
// @route   PATCH /api/pricing/:id/prices
// @access  Private/Admin
export const updatePricingPrices = async (req, res, next) => {
  try {
    const { originalPrice, discount, price } = req.body;

    // Validate at least one price field is provided
    if (originalPrice === undefined && discount === undefined && price === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide at least one price field (originalPrice, discount, or price)'
      });
    }

    // Find the plan
    const plan = await Pricing.findByPk(req.params.id);

    if (!plan) {
      return res.status(404).json({
        status: 'error',
        message: 'Pricing plan not found'
      });
    }

    // Build update object
    const updates = {};
    if (originalPrice !== undefined) {
      updates.originalPrice = originalPrice;
    }
    if (discount !== undefined) {
      // Validate discount is 0-100
      if (discount < 0 || discount > 100) {
        return res.status(400).json({
          status: 'error',
          message: 'Discount must be between 0 and 100'
        });
      }
      updates.discount = discount;
    }
    if (price !== undefined) {
      updates.price = price;
    }

    // Update the plan
    await plan.update(updates);

    // Log the price change for audit
    console.log(`[ADMIN PRICE UPDATE] Admin ID: ${req.user.id} | Plan: ${plan.name} (ID: ${plan.id}) | Updates:`, updates);

    res.status(200).json({
      status: 'success',
      message: 'Pricing updated successfully',
      data: { 
        plan: {
          id: plan.id,
          name: plan.name,
          originalPrice: plan.originalPrice,
          discount: plan.discount,
          price: plan.price
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
