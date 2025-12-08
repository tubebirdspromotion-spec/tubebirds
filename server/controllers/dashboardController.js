import { Op, fn, col, literal } from 'sequelize';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Contact from '../models/Contact.js';
import Pricing from '../models/Pricing.js';
import Service from '../models/Service.js';

// @desc    Get admin dashboard
// @route   GET /api/dashboard/admin
// @access  Private/Admin
export const getAdminDashboard = async (req, res, next) => {
  try {
    // Total revenue and orders
    const revenueData = await Order.findOne({
      where: { paymentStatus: 'paid' },
      attributes: [
        [fn('SUM', col('amount')), 'totalRevenue'],
        [fn('COUNT', col('id')), 'totalOrders']
      ],
      raw: true
    });

    // Pending orders count
    const pendingOrders = await Order.count({
      where: { status: 'pending' }
    });

    // Completed orders count
    const completedOrders = await Order.count({
      where: { status: 'completed' }
    });

    // Total users (clients only)
    const totalUsers = await User.count({ 
      where: { role: 'client' } 
    });

    // Active services count
    const activeServices = await Service.count({
      where: { isActive: true }
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalRevenue: Math.round(revenueData?.totalRevenue || 0),
        totalOrders: revenueData?.totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        completedOrders: completedOrders || 0,
        totalUsers: totalUsers || 0,
        activeServices: activeServices || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    const { period = 'all' } = req.query;

    let dateFilter = {};
    const now = new Date();

    if (period === 'monthly') {
      dateFilter = {
        createdAt: {
          [Op.gte]: new Date(now.getFullYear(), now.getMonth(), 1),
          [Op.lte]: new Date(now.getFullYear(), now.getMonth() + 1, 0)
        }
      };
    } else if (period === 'yearly') {
      dateFilter = {
        createdAt: {
          [Op.gte]: new Date(now.getFullYear(), 0, 1),
          [Op.lte]: new Date(now.getFullYear(), 11, 31)
        }
      };
    }

    // Total revenue
    const revenueData = await Order.findOne({
      where: { paymentStatus: 'paid', ...dateFilter },
      attributes: [
        [fn('SUM', col('amount')), 'totalRevenue'],
        [fn('COUNT', col('id')), 'totalOrders']
      ],
      raw: true
    });

    // Orders by status
    const ordersByStatus = await Order.findAll({
      where: dateFilter,
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Total users
    const totalUsers = await User.count({ 
      where: { role: 'client', ...dateFilter } 
    });

    // Unread contacts
    const unreadContacts = await Contact.count({ 
      where: { isRead: false } 
    });

    // Recent orders
    const recentOrders = await Order.findAll({
      where: dateFilter,
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['name', 'email']
        },
        {
          model: Pricing,
          as: 'pricing',
          attributes: ['planName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Monthly revenue chart data
    const monthlyRevenue = await Order.findAll({
      where: {
        paymentStatus: 'paid',
        createdAt: {
          [Op.gte]: new Date(now.getFullYear(), 0, 1)
        }
      },
      attributes: [
        [fn('MONTH', col('createdAt')), 'month'],
        [fn('SUM', col('amount')), 'revenue'],
        [fn('COUNT', col('id')), 'orders']
      ],
      group: [fn('MONTH', col('createdAt'))],
      order: [[fn('MONTH', col('createdAt')), 'ASC']],
      raw: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        revenue: {
          total: revenueData?.totalRevenue || 0,
          orders: revenueData?.totalOrders || 0
        },
        ordersByStatus,
        totalUsers,
        unreadContacts,
        recentOrders,
        monthlyRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get client dashboard
// @route   GET /api/dashboard/client
// @access  Private
export const getClientDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Total orders
    const totalOrders = await Order.count({ 
      where: { userId: userId } 
    });

    // Pending orders
    const pendingOrders = await Order.count({
      where: { userId: userId, status: 'pending' }
    });

    // Completed orders
    const completedOrders = await Order.count({
      where: { userId: userId, status: 'completed' }
    });

    // Total spent
    const totalSpentData = await Order.findOne({
      where: { userId: userId, paymentStatus: 'paid' },
      attributes: [
        [fn('SUM', col('amount')), 'total']
      ],
      raw: true
    });

    // Recent orders with full details
    const recentOrders = await Order.findAll({
      where: { userId: userId },
      include: [
        {
          model: Pricing,
          as: 'pricing',
          attributes: ['id', 'planName', 'quantity', 'price', 'category', 'description'],
          required: false
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'title', 'slug', 'icon'],
          required: false
        },
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5,
      raw: false
    });

    // Category to service title mapping
    const categoryTitleMap = {
      'views': 'YouTube Views',
      'subscribers': 'YouTube Subscribers',
      'monetization': 'YouTube Monetization',
      'revenue': 'YouTube Revenue'
    };

    // Format recent orders for frontend with planDetails fallback
    const formattedOrders = recentOrders.map(order => {
      const orderData = order.toJSON();
      
      // Parse planDetails if it's a string
      let planDetails = orderData.planDetails;
      if (typeof planDetails === 'string') {
        try {
          planDetails = JSON.parse(planDetails);
        } catch (e) {
          planDetails = null;
        }
      }
      
      // Use planDetails as fallback if pricing/service are null
      const serviceName = orderData.service?.title || 
                         (planDetails?.category ? categoryTitleMap[planDetails.category] : null) ||
                         'Service';
      const planName = orderData.pricing?.planName || 
                      planDetails?.name || 
                      'N/A';
      
      return {
        id: orderData.id,
        orderNumber: orderData.orderNumber,
        serviceName,
        planName,
        status: orderData.status,
        paymentStatus: orderData.paymentStatus,
        amount: orderData.amount,
        baseAmount: orderData.baseAmount,
        gstAmount: orderData.gstAmount,
        progress: orderData.progress,
        targetQuantity: orderData.targetQuantity,
        completedQuantity: orderData.completedQuantity,
        createdAt: orderData.createdAt,
        startDate: orderData.startDate,
        completionDate: orderData.completionDate,
        estimatedCompletionDate: orderData.estimatedCompletionDate
      };
    });

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalOrders: totalOrders || 0,
          pendingOrders: pendingOrders || 0,
          completedOrders: completedOrders || 0,
          totalSpent: Math.round(totalSpentData?.total || 0)
        },
        recentOrders: formattedOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get client dashboard stats
// @route   GET /api/dashboard/client/stats
// @access  Private
export const getClientStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Total orders
    const totalOrders = await Order.count({ 
      where: { userId: userId } 
    });

    // Orders by status
    const ordersByStatus = await Order.findAll({
      where: { userId: userId },
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Total spent
    const totalSpentData = await Order.findOne({
      where: { userId: userId, paymentStatus: 'paid' },
      attributes: [
        [fn('SUM', col('amount')), 'total']
      ],
      raw: true
    });

    // Recent orders with details
    const recentOrders = await Order.findAll({
      where: { userId: userId },
      include: [
        {
          model: Pricing,
          as: 'pricing',
          attributes: ['id', 'planName', 'category', 'quantity']
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'title', 'slug']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Active orders (in-progress)
    const activeOrders = await Order.findAll({
      where: {
        userId: userId,
        status: { [Op.in]: ['processing', 'in-progress'] }
      },
      include: [
        {
          model: Pricing,
          as: 'pricing',
          attributes: ['id', 'planName']
        },
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'title']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalOrders,
        ordersByStatus,
        totalSpent: totalSpentData?.total || 0,
        recentOrders,
        activeOrders
      }
    });
  } catch (error) {
    next(error);
  }
};
