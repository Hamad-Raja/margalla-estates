import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  overview: { type: String, required: true },
  price: { type: Number, required: true },
  priceLabel: String,
  purpose: { type: String, enum: ['sale', 'rent'], default: 'sale' },
  type: { type: String, enum: ['House', 'Apartment', 'Villa', 'Plot', 'Commercial'], default: 'House' },
  status: { type: String, enum: ['Available', 'Booked', 'Sold', 'Rented'], default: 'Available' },
  city: { type: String, default: 'Islamabad' },
  sector: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  garages: { type: Number, default: 0 },
  area: { type: Number, required: true },
  areaUnit: { type: String, default: 'Marla' },
  yearBuilt: Number,
  images: [{ type: String, required: true }],
  amenities: [String],
  highlights: [String],
  featured: { type: Boolean, default: false },
  premium: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  agent: {
    name: { type: String, default: 'Margalla Estates Advisor' },
    phone: { type: String, default: '+92 300 1234567' },
    email: { type: String, default: 'sales@margallaestates.pk' },
    image: { type: String, default: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop' }
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

schema.index({ title: 'text', sector: 'text', location: 'text', address: 'text', type: 'text' });
export default mongoose.model('Property', schema);
