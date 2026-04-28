import express from 'express';
import Property from '../models/Property.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Inquiry from '../models/Inquiry.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();
router.get('/stats', protect, adminOnly, async (_req, res) => {
  const [properties, users, appointments, inquiries, featured, recentAppointments, sectorStats, statusStats, inventory] = await Promise.all([
    Property.countDocuments(), User.countDocuments({ role: 'user' }), Appointment.countDocuments(), Inquiry.countDocuments(), Property.countDocuments({ featured: true }),
    Appointment.find().populate('property', 'title location').sort('-createdAt').limit(6),
    Property.aggregate([{ $group: { _id: '$sector', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Appointment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Property.aggregate([{ $group: { _id: null, total: { $sum: '$price' } } }])
  ]);
  res.json({ cards: { properties, users, appointments, inquiries, featured, inventoryValue: inventory[0]?.total || 0 }, recentAppointments, sectorStats, statusStats });
});
export default router;
