import express from 'express';
import User from '../models/User.js';
import { signToken } from '../utils/token.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();
const payload = (u) => ({ _id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role, isActive: u.isActive, createdAt: u.createdAt });

router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
  if (await User.findOne({ email: String(email).toLowerCase() })) return res.status(409).json({ message: 'Email already registered' });
  const user = await User.create({ name, email, phone, password });
  res.status(201).json({ user: payload(user), token: signToken(user) });
});
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: String(req.body.email).toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(req.body.password))) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ user: payload(user), token: signToken(user) });
});
router.post('/admin-login', async (req, res) => {
  const user = await User.findOne({ email: String(req.body.email).toLowerCase(), role: 'admin' }).select('+password');
  if (!user || !(await user.matchPassword(req.body.password))) return res.status(401).json({ message: 'Invalid admin credentials' });
  res.json({ user: payload(user), token: signToken(user) });
});
router.get('/me', protect, (req, res) => res.json({ user: payload(req.user) }));
router.get('/users', protect, adminOnly, async (_req, res) => res.json((await User.find().sort('-createdAt')).map(payload)));
router.patch('/users/:id/status', protect, adminOnly, async (req, res) => res.json(payload(await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true }))));
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  if (String(req.params.id) === String(req.user._id)) return res.status(400).json({ message: 'Cannot delete your own account' });
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});
export default router;
