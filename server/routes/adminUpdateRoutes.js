/**
 * Revenue Pricing Update Route
 * 
 * Add this route to your server.js or create a new admin routes file
 * 
 * This endpoint allows updating revenue plan prices via HTTP POST request
 * 
 * Endpoint: POST /api/admin/update-revenue-prices
 * 
 * Headers Required:
 * - Authorization: Bearer {admin-token}
 * - Content-Type: application/json
 * 
 * Example Postman Request:
 * POST http://your-server.com/api/admin/update-revenue-prices
 * 
 * Headers:
 * {
 *   "Authorization": "Bearer YOUR_ADMIN_TOKEN",
 *   "Content-Type": "application/json"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Revenue prices updated successfully",
 *   "updatedPlans": [
 *     {
 *       "planName": "Revenue Starter",
 *       "oldPrice": 2500,
 *       "newPrice": 1600,
 *       "oldDiscount": 50,
 *       "newDiscount": 0
 *     },
 *     ...
 *   ]
 * }
 */

import express from 'express';
import { Pricing } from '../models/index.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Endpoint to update revenue plan prices
router.post('/update-revenue-prices', protect, authorize('admin'), async (req, res) => {
  try {
    console.log('🚀 Admin: Revenue Price Update Request Received');

    const revenuePriceUpdates = [
      {
        planName: 'Revenue Starter',
        newPrice: 1600,
        discount: 0
      },
      {
        planName: 'Revenue Booster',
        newPrice: 3200,
        discount: 0
      },
      {
        planName: 'Revenue Pro',
        newPrice: 6400,
        discount: 0
      },
      {
        planName: 'Revenue Elite',
        newPrice: 12000,
        discount: 0
      },
      {
        planName: 'Revenue Master',
        newPrice: 23000,
        discount: 0
      }
    ];

    const updatedPlans = [];

    for (const update of revenuePriceUpdates) {
      const plan = await Pricing.findOne({
        where: {
          planName: update.planName,
          category: 'revenue'
        }
      });

      if (!plan) {
        console.log(`⚠️  Plan "${update.planName}" not found`);
        continue;
      }

      const oldPrice = plan.price;
      const oldDiscount = plan.discount;

      await plan.update({
        price: update.newPrice,
        originalPrice: update.newPrice,
        discount: update.discount
      });

      updatedPlans.push({
        planName: update.planName,
        oldPrice: parseFloat(oldPrice),
        newPrice: update.newPrice,
        oldDiscount: oldDiscount,
        newDiscount: update.discount,
        updatedAt: new Date()
      });

      console.log(`✅ Updated: ${update.planName} (₹${oldPrice} → ₹${update.newPrice})`);
    }

    res.status(200).json({
      success: true,
      message: 'Revenue prices updated successfully',
      updatedCount: updatedPlans.length,
      updatedPlans: updatedPlans
    });
  } catch (error) {
    console.error('❌ Error updating revenue prices:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating revenue prices',
      error: error.message
    });
  }
});

export default router;
