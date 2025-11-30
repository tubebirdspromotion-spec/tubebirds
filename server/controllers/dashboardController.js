import { Op, fn, col, literal } from 'sequelize';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Contact from '../models/Contact.js';
import Pricing from '../models/Pricing.js';

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

// @desc    Get client dashboard stats
// @route   GET /api/dashboard/client/stats
// @access  Private
export const getClientStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Total orders
    const totalOrders = await Order.count({ 
      where: { customerId: userId } 
    });

    // Orders by status
    const ordersByStatus = await Order.findAll({
      where: { customerId: userId },
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Total spent
    const totalSpentData = await Order.findOne({
      where: { customerId: userId, paymentStatus: 'paid' },
      attributes: [
        [fn('SUM', col('amount')), 'total']
      ],
      raw: true
    });

    // Recent orders
    const recentOrders = await Order.findAll({
      where: { customerId: userId },
      include: [
        {
          model: Pricing,
          as: 'pricing',
          attributes: ['planName', 'category']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Active orders (in-progress)
    const activeOrders = await Order.findAll({
      where: {
        customerId: userId,
        status: { [Op.in]: ['processing', 'in-progress'] }
      },
      include: [
        {
          model: Pricing,
          as: 'pricing',
          attributes: ['planName']
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
