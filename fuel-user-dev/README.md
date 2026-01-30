# FuelFriendly App - Monorepo

Fuel-friendly app untuk ordering snacks dan drinks di gas stations.

## 📁 Struktur Project

```
fuel-user/
├── frontend/          # React + TypeScript + Vite
│   ├── components/    # UI Components
│   ├── screens/       # App Screens
│   ├── services/      # API Services
│   ├── assets/        # Images & Animations
│   └── package.json   # Frontend dependencies
├── backend/           # Node.js + Express + PostgreSQL
│   ├── server/        # Express server
│   ├── shared/        # Database schema
│   └── package.json   # Backend dependencies
└── package.json       # Root package.json
```

## 🚀 Quick Start

### 1. Install semua dependencies:
```bash
npm run setup
```

### 2. Setup environment variables:
```bash
cd backend
cp .env.local.template .env.local
# Edit .env.local dengan API keys Anda
```

### 3. Jalankan development mode:
```bash
# Dari root directory
npm run dev
```

Ini akan menjalankan:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### 4. Mobile Access (Development):
Untuk mengakses aplikasi dari handphone di jaringan yang sama:

1. Pastikan handphone dan komputer terhubung ke Wi-Fi yang sama
2. Gunakan IP address komputer Anda: `http://192.168.0.160:5173`
3. Atau jalankan script: `start-mobile-dev.bat` dari root directory

**Alternatif:** Jalankan script batch untuk start otomatis:
```bash
# Dari root directory
start-mobile-dev.bat
```

Setelah server running, akses dari handphone:
- Mobile App: http://192.168.0.160:5173
- API Health Check: http://192.168.0.160:4000/api/health

## 📱 Development Commands

### Root Commands (dari root directory):
```bash
npm run setup           # Install semua dependencies
npm run dev            # Jalankan frontend + backend
npm run dev:frontend   # Jalankan frontend saja
npm run dev:backend    # Jalankan backend saja
npm run build:frontend # Build frontend untuk production
```

### Frontend Commands (dari folder frontend/):
```bash
cd frontend
npm run dev     # Development server
npm run build   # Build untuk production
npm run preview # Preview production build
```

### Backend Commands (dari folder backend/):
```bash
cd backend
npm run dev            # Development server
npm run start          # Production server
npm run seed           # Seed database
npm run whatsapp:setup # Setup WhatsApp service
```

## 🔧 Configuration

### Frontend Environment Variables:
File: `frontend/.env.local`
```
VITE_API_BASE_URL=http://localhost:3003
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend Environment Variables:
File: `backend/.env.local`
```
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@fuelfriendly.com
STRIPE_SECRET_KEY=your_stripe_key
DATABASE_URL=your_postgresql_url
```

## 📦 Technology Stack

### Frontend:
- React 18 + TypeScript
- Vite (Build tool)
- Tailwind CSS + Radix UI
- React Router DOM
- Tanstack Query
- Framer Motion + Lottie
- Mapbox GL JS
- Capacitor (Mobile)

### Backend:
- Node.js + Express
- PostgreSQL + Drizzle ORM
- SendGrid/Resend (Email)
- Baileys (WhatsApp)
- Stripe (Payment)
- JWT Authentication

## 🏗️ Deployment

### Frontend (Vercel/Netlify):
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku):
```bash
cd backend
# Deploy dengan environment variables
```

## 📚 API Documentation

Backend API documentation tersedia di: `backend/API_DOCUMENTATION.md`

Base URL: `http://localhost:3003/api`

### Main Endpoints:
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/otp/email/send` - Send email OTP
- `POST /api/otp/whatsapp/send` - Send WhatsApp OTP
- `GET /api/stations` - Get fuel stations
- `POST /api/orders` - Create order

## 🔍 Development Tips

1. **Hot Reload**: Kedua frontend dan backend mendukung hot reload
2. **API Testing**: Gunakan Postman atau curl untuk test API endpoints
3. **Database**: Gunakan `npm run db:studio` untuk GUI database
4. **Mobile Testing**: Gunakan `npx cap run android` untuk test di Android

## 🐛 Troubleshooting

### Port sudah digunakan:
```bash
# Kill process di port 5173 (frontend)
lsof -ti:5173 | xargs kill -9

# Kill process di port 3003 (backend)  
lsof -ti:3003 | xargs kill -9
```

### Dependencies error:
```bash
# Clean install
rm -rf node_modules frontend/node_modules backend/node_modules
npm run setup
```

### Database connection error:
1. Pastikan PostgreSQL running
2. Check DATABASE_URL di backend/.env.local
3. Run migrations: `cd backend && npm run db:migrate`