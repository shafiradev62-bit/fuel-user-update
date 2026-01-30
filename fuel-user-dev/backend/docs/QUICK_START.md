# 🚀 Quick Start Guide - FuelFriendly

## ✅ Fixes Applied
- ✅ Fixed JSX syntax error in HomeScreen.tsx
- ✅ Updated API service to use new backend (port 3003)
- ✅ Updated environment variables
- ✅ Added Tailwind CSS support
- ✅ Added modern UI components

## 🏃‍♂️ How to Run

### 1. Install Dependencies
```bash
cd /Users/admin/Documents/FREELANCE/fuel-user
npm install
```

### 2. Start Backend (Terminal 1) - Port 4000
```bash
npm run server
```

Expected output:
```
FuelFriendly API running on port 4000 with PostgreSQL
```

### 3. Start Frontend (Terminal 2)
```bash
npm run dev
```

Expected output:
```
VITE v5.4.21  ready in 522 ms
➜  Local:   http://localhost:3000/
```

### 4. Test Backend Health
```bash
curl http://localhost:4000/api/ping
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "postgresql",
  "mockData": false
}
```

### 5. Seed Database (Optional)
```bash
curl -X POST http://localhost:4000/api/seed
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000
- **Health Check**: http://localhost:4000/api/ping

## 🔧 If You Get Errors

### Database Connection Error
```bash
# Make sure PostgreSQL is running
brew services start postgresql
# or
sudo service postgresql start

# Create database if it doesn't exist
createdb fuelfriendly
```

### Port Already in Use
```bash
# Kill process on port 3003
lsof -ti:3003 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Missing Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Test the App

1. **Open Browser**: http://localhost:3000
2. **Register New User**: Click "Sign Up"
3. **Test Login**: Use registered credentials
4. **Browse Stations**: Should load real fuel stations
5. **Create Order**: Test order flow

## ✅ Success Indicators

- ✅ Frontend loads without errors
- ✅ Backend responds to health check
- ✅ No mock data warnings
- ✅ Real fuel stations load
- ✅ Registration/login works
- ✅ Modern UI components display

## 🎉 You're Ready!

Your FuelFriendly app is now running with:
- Production-ready backend (no mock data)
- Modern UI with Tailwind CSS
- Real API integration
- PostgreSQL database
- Multi-channel OTP support
- Stripe payment ready

**Happy coding! 🚀**