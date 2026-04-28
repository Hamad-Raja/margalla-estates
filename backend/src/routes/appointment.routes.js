import express from 'express';
import Appointment from '../models/Appointment.js';
import Property from '../models/Property.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', optionalAuth, async (req, res) => {
  const { property, name, email, phone, preferredDate, preferredTime, message } = req.body;
  if (!property || !name || !email || !phone || !preferredDate || !preferredTime) return res.status(400).json({ message: 'Required fields missing' });
  if (!(await Property.findById(property))) return res.status(404).json({ message: 'Property not found' });
  const a = await Appointment.create({ property, user: req.user?._id, name, email, phone, preferredDate, preferredTime, message });
  res.status(201).json(await a.populate('property', 'title location price images'));
});
router.get('/mine', optionalAuth, async (req, res) => {
  const filter = req.user ? { user: req.user._id } : { email: String(req.query.email || '').toLowerCase() };
  if (!req.user && !filter.email) return res.status(400).json({ message: 'Email required' });
  res.json(await Appointment.find(filter).populate('property', 'title slug location price images').sort('-createdAt'));
});
router.get('/', protect, adminOnly, async (_req, res) => res.json(await Appointment.find().populate('property', 'title slug location price images').populate('user', 'name email').sort('-createdAt')));
router.patch('/:id/status', protect, adminOnly, async (req, res) => res.json(await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status, meetingLink: req.body.meetingLink || '' }, { new: true }).populate('property', 'title slug')));
router.delete('/:id', protect, adminOnly, async (req, res) => { await Appointment.findByIdAndDelete(req.params.id); res.json({ message: 'Appointment deleted' }); });
export default router;
