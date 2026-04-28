import express from 'express';
import Property from '../models/Property.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { makeSlug } from '../utils/slug.js';

const router = express.Router();

const filterFrom = (q) => {
  const f = {};
  if (q.search) f.$text = { $search: q.search };
  ['type', 'purpose', 'sector', 'status'].forEach(k => { if (q[k] && q[k] !== 'All') f[k] = q[k]; });
  if (q.bedrooms && q.bedrooms !== 'All') f.bedrooms = { $gte: Number(q.bedrooms) };
  if (q.featured === 'true') f.featured = true;
  if (q.minPrice || q.maxPrice) f.price = { ...(q.minPrice ? { $gte: Number(q.minPrice) } : {}), ...(q.maxPrice ? { $lte: Number(q.maxPrice) } : {}) };
  return f;
};
const sortFrom = (s) => ({ priceLow: 'price', priceHigh: '-price', areaHigh: '-area', popular: '-views' }[s] || '-createdAt');

router.get('/', async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1), limit = Math.min(Number(req.query.limit) || 12, 100);
  const filter = filterFrom(req.query);
  const [items, total] = await Promise.all([
    Property.find(filter).sort(sortFrom(req.query.sort)).skip((page - 1) * limit).limit(limit),
    Property.countDocuments(filter)
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) || 1 });
});
router.get('/featured', async (_req, res) => res.json(await Property.find({ featured: true, status: 'Available' }).sort('-createdAt').limit(8)));
router.get('/:idOrSlug', async (req, res) => {
  const idOrSlug = req.params.idOrSlug;
  const or = [{ slug: idOrSlug }];
  if (/^[0-9a-fA-F]{24}$/.test(idOrSlug)) or.push({ _id: idOrSlug });
  const property = await Property.findOne({ $or: or });
  if (!property) return res.status(404).json({ message: 'Property not found' });
  property.views += 1; await property.save(); res.json(property);
});
router.post('/', protect, adminOnly, async (req, res) => res.status(201).json(await Property.create({ ...req.body, slug: makeSlug(req.body.title), createdBy: req.user._id })));
router.put('/:id', protect, adminOnly, async (req, res) => {
  const payload = { ...req.body }; if (payload.title && !payload.slug) payload.slug = makeSlug(payload.title);
  const item = await Property.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: 'Property not found' }); res.json(item);
});
router.delete('/:id', protect, adminOnly, async (req, res) => { await Property.findByIdAndDelete(req.params.id); res.json({ message: 'Property deleted' }); });
export default router;
