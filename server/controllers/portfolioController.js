import Portfolio from '../models/Portfolio.js';

// @desc    Get all portfolio items
// @route   GET /api/portfolio
// @access  Public
export const getPortfolioItems = async (req, res, next) => {
  try {
    const { type } = req.query;
    const where = { isActive: true };
    
    if (type) {
      where.type = type;
    }

    const items = await Portfolio.findAll({
      where,
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      results: items.length,
      data: { items }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single portfolio item
// @route   GET /api/portfolio/:id
// @access  Public
export const getPortfolioItem = async (req, res, next) => {
  try {
    const item = await Portfolio.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Portfolio item not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { item }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create portfolio item (Admin only)
// @route   POST /api/portfolio
// @access  Private/Admin
export const createPortfolioItem = async (req, res, next) => {
  try {
    const item = await Portfolio.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { item }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update portfolio item (Admin only)
// @route   PUT /api/portfolio/:id
// @access  Private/Admin
export const updatePortfolioItem = async (req, res, next) => {
  try {
    const item = await Portfolio.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Portfolio item not found'
      });
    }

    await item.update(req.body);

    res.status(200).json({
      status: 'success',
      data: { item }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete portfolio item (Admin only)
// @route   DELETE /api/portfolio/:id
// @access  Private/Admin
export const deletePortfolioItem = async (req, res, next) => {
  try {
    const item = await Portfolio.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Portfolio item not found'
      });
    }

    await item.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Portfolio item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
