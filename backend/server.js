import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import connectDB from './src/config/db.js';
import { ensureAdmin } from './src/utils/ensureAdmin.js';

import authRoutes from './src/routes/auth.routes.js';
import propertyRoutes from './src/routes/property.routes.js';
import appointmentRoutes from './src/routes/appointment.routes.js';
import inquiryRoutes from './src/routes/inquiry.routes.js';
import adminRoutes from './src/routes/admin.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

const origins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  ...(process.env.LOCAL_URLS || '').split(',')
]
  .map((url) => url?.trim())
  .filter(Boolean);

app.use(helmet());

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || origins.includes(origin)) {
        return cb(null, true);
      }

      return cb(new Error('CORS blocked'));
    },
    credentials: true
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300
  })
);

app.get('/', (_req, res) => {
  res.json({
    name: 'Margalla Estates API',
    ok: true
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.originalUrl}`
  });
});

app.use((err, _req, res, _next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || 'Server error'
  });
});

connectDB()
  .then(async () => {
    await ensureAdmin();

    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });