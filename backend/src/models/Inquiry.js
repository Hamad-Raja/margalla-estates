import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  phone: String,
  subject: { type: String, default: 'General Inquiry' },
  message: { type: String, required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  read: { type: Boolean, default: false }
}, { timestamps: true });
export default mongoose.model('Inquiry', schema);
