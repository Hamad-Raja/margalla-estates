# Margalla Estates — MERN Real Estate Website

A complete Islamabad-focused real estate website built with:

- React + Vite + Tailwind CSS public frontend
- React + Vite + Tailwind CSS admin dashboard
- Express.js REST API
- MongoDB + Mongoose
- JWT authentication
- Admin property CRUD
- Appointments and inquiries
- User login/register dashboard
- PKR pricing
- Islamabad property seed data

## Quick Start

```bash
npm run install:all
cd backend
cp .env.example .env
cd ..
npm run seed
npm run dev:backend
npm run dev:frontend
npm run dev:admin
```

Open:

```txt
Frontend: http://localhost:5173
Admin:    http://localhost:5174
Backend:  http://localhost:4000
```

Seeded admin:

```txt
Email: admin@margallaestates.pk
Password: Admin@12345
```

## Notes

- Replace demo image URLs with your own Islamabad property photos before production.
- Use MongoDB Atlas for deployment.
- Deploy backend on Render/Railway/VPS and frontend/admin on Vercel/Netlify.
