import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function protect(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null;
    if (!token) return res.status(401).json({ message: 'Token missing' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user || !req.user.isActive) return res.status(401).json({ message: 'User inactive or not found' });
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}
export const adminOnly = (req, res, next) => req.user?.role === 'admin' ? next() : res.status(403).json({ message: 'Admin access required' });
export async function optionalAuth(req, _res, next) {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null;
    if (token) req.user = await User.findById(jwt.verify(token, process.env.JWT_SECRET).id).select('-password');
  } catch {}
  next();
}
