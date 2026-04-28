import User from '../models/User.js';

export async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@margallaestates.pk';
  const exists = await User.findOne({ email });
  if (!exists) {
    await User.create({ name: 'Margalla Admin', email, password: process.env.ADMIN_PASSWORD || 'Admin@12345', role: 'admin', phone: '+92 300 1234567' });
    console.log(`Default admin created: ${email}`);
  }
}
