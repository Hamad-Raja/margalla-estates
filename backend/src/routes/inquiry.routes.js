import express from 'express';
import Inquiry from '../models/Inquiry.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();
router.post('/', async (req, res) => {
  const { name, email, phone, subject, message, property } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: 'Name, email and message required' });
  res.status(201).json(await Inquiry.create({ name, email, phone, subject, message, property: property || undefined }));
});
router.get('/', protect, adminOnly, async (_req, res) => res.json(await Inquiry.find().populate('property', 'title slug').sort('-createdAt')));
router.patch('/:id/read', protect, adminOnly, async (req, res) => res.json(await Inquiry.findByIdAndUpdate(req.params.id, { read: req.body.read ?? true }, { new: true })));
router.delete('/:id', protect, adminOnly, async (req, res) => { await Inquiry.findByIdAndDelete(req.params.id); res.json({ message: 'Inquiry deleted' }); });
export default router;
