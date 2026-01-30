# 🔄 FuelFriendly App Flow - Updated Structure

## 📁 **Current Project Structure**

```
fuel-user/
├── 📱 frontend/          # React + TypeScript + Vite (Port 5173)
│   ├── components/       # UI Components
│   ├── screens/         # App Screens  
│   ├── services/        # API Services
│   ├── assets/          # Images & Animations
│   └── package.json     # Frontend dependencies
│
├── 🔧 backend/          # Node.js + Express + PostgreSQL (Port 4000)
│   ├── server/          # Express server
│   ├── utils/           # Response handlers & validation
│   ├── scripts/         # Setup & test scripts
│   ├── docs/            # API documentation
│   └── package.json     # Backend dependencies
│
└── package.json         # Root monorepo commands
```

## 🚀 **Development Flow**

### **1. Setup & Installation**
```bash
# Install all dependencies
npm run setup

# Setup environment variables
cd frontend && cp .env.local.template .env.local
cd ../backend && cp .env.local.template .env.local
```

### **2. Database Setup**
```bash
cd backend

# Setup PostgreSQL database
# Edit .env.local with DATABASE_URL

# Generate & run migrations
npm run db:generate
npm run db:migrate
npm run seed
```

### **3. Services Setup**

#### **Email OTP (SendGrid)**
```bash
# Edit backend/.env.local
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@fuelfriendly.com
```

#### **WhatsApp OTP (Baileys)**
```bash
cd backend
npm run whatsapp:setup
# Scan QR code dengan WhatsApp
```

#### **Maps (Mapbox)**
```bash
# Edit frontend/.env.local  
VITE_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token
```

### **4. Start Development**
```bash
# Start both frontend & backend
npm run dev

# Or start individually
npm run dev:frontend  # Port 5173
npm run dev:backend   # Port 4000
```

## 🔄 **Application Flow**

### **1. User Authentication Flow**
```
SplashScreen → LoginScreen → LoginFormScreen
                ↓
            OTP Verification (Email/WhatsApp)
                ↓
            HomeScreen (Main App)
```

### **2. Registration Flow**
```
LoginScreen → RegistrationScreen → Step 1 (User Info)
                ↓
            Step 2 (Vehicle Info) → OTP Verification
                ↓
            Registration Complete → HomeScreen
```

### **3. Main App Flow**
```
HomeScreen (Map + Stations List)
    ↓
StationDetailsScreen (Select Station)
    ↓
CheckoutScreen (Order Details)
    ↓
PaymentScreen (Stripe Payment)
    ↓
OrderSummaryScreen → TrackOrderScreen
```

### **4. Navigation Flow**
```
Bottom Navigation:
├── Home (HomeScreen)
├── Orders (MyOrdersScreen)  
├── Track (TrackOrderScreen)
└── Settings (SettingsScreen)
```

## 🔌 **API Integration Flow**

### **1. Authentication APIs**
```
POST /api/auth/login
POST /api/auth/register/step1
POST /api/auth/register/complete
POST /api/auth/google
```

### **2. OTP APIs**
```
POST /api/auth/otp/email/send
POST /api/auth/otp/email/verify
POST /api/auth/otp/whatsapp/send  
POST /api/auth/otp/whatsapp/verify
```

### **3. Core APIs**
```
GET  /api/stations?lat=&lng=
GET  /api/stations/:id
POST /api/orders
GET  /api/orders?customerId=
POST /api/payments/create-intent
```

## 📱 **Mobile App Flow (Capacitor)**

### **1. Build Mobile App**
```bash
cd frontend
npm run build
npx cap sync
npx cap run android
```

### **2. Mobile Features**
- Native GPS location
- Push notifications
- Offline support
- Native UI components

## 🔧 **Backend Services Flow**

### **1. Server Startup**
```
1. Load environment variables
2. Initialize database connection
3. Check database tables
4. Setup email service (SendGrid)
5. Initialize WhatsApp service (Baileys)
6. Start Express server (Port 4000)
```

### **2. Request Flow**
```
Request → Validation (Zod) → Controller → Database (Drizzle) → Response
```

### **3. Response Format**
```json
{
  "success": true,
  "message": "Success",
  "responseCode": "RC_200",
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🗺️ **Map Integration Flow**

### **1. Location Flow**
```
1. Request GPS permission
2. Get user coordinates
3. Fetch nearby stations from API
4. Display on Mapbox map
5. Show user location + station markers
```

### **2. Station Selection**
```
Map Marker Click → Navigate to StationDetailsScreen
```

## 📦 **Deployment Flow**

### **1. Frontend (Vercel/Netlify)**
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### **2. Backend (Railway/Heroku)**
```bash
cd backend
# Deploy with environment variables
```

### **3. Mobile (Play Store/App Store)**
```bash
cd frontend
npm run build
npx cap sync
# Build APK/IPA for stores
```

## ✅ **Key Changes from Original**

### **✅ Improved Structure**
- Separated frontend/backend folders
- Clean dependencies per folder
- Organized scripts & documentation

### **✅ Standardized API**
- Consistent response format
- Response code mapping
- Request validation with Zod
- Better error handling

### **✅ Enhanced Services**
- Auto database checking
- WhatsApp service with Baileys
- SendGrid email integration
- Mapbox maps integration

### **✅ Production Ready**
- Environment variable templates
- Proper error handling
- Database migrations
- Service health checks

Flow aplikasi tetap sama, tapi dengan struktur yang lebih rapi dan production-ready! 🎉