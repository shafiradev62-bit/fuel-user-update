# Mobile Network Access Guide

## 📱 How to Access the App from Mobile Device

### Prerequisites
1. **Same Network**: Make sure your mobile device and computer are connected to the same Wi-Fi network
2. **Development Servers Running**: Both frontend and backend servers must be running

### Step-by-Step Instructions

#### 1. Start Development Servers
From the root directory, run:
```bash
# Option A: Use the batch script (Windows)
start-mobile-dev.bat

# Option B: Manual start
npm run dev
```

#### 2. Find Your Computer's IP Address
The system is already configured to use your IP: `192.168.0.160`

If you need to find it manually:
- **Windows**: Open Command Prompt and run `ipconfig`
- **Mac/Linux**: Open Terminal and run `ifconfig` or `ip addr`

#### 3. Access from Mobile Device
Open your mobile browser and go to:
```
http://192.168.0.160:5173
```

### 🔧 Configuration Details

#### Frontend Configuration
- **File**: `frontend/.env.local`
- **Setting**: `VITE_API_BASE_URL=http://192.168.0.160:4000`

#### Backend Configuration
- **CORS**: Configured to accept requests from:
  - `http://localhost:5173`
  - `http://192.168.0.160:5173`
  - `capacitor://localhost` (iOS)
  - `http://localhost` (Android)

#### Capacitor Configuration
- **File**: `frontend/capacitor.config.ts`
- **Settings**: 
  - `cleartext: true` (allows HTTP connections)
  - `androidScheme: 'https'` (for production)

### ✅ Verification Steps

1. **Check Backend Health**:
   - Visit: `http://192.168.0.160:4000/api/health`
   - Should return: `{"success":true,"data":{"status":"ok",...}}`

2. **Check Frontend Access**:
   - Visit: `http://192.168.0.160:5173`
   - Should load the FuelFriendly app

3. **Test API Connection**:
   - Open the app on mobile
   - Try to login or register
   - Check if API calls are successful

### 🛠️ Troubleshooting

#### Common Issues:

1. **Cannot Access from Mobile**:
   - ✅ Ensure both devices are on same Wi-Fi
   - ✅ Check Windows Firewall settings
   - ✅ Verify IP address is correct

2. **API Connection Failed**:
   - ✅ Check if backend server is running
   - ✅ Verify `VITE_API_BASE_URL` in `.env.local`
   - ✅ Check browser console for CORS errors

3. **Slow Loading**:
   - ✅ Ensure good Wi-Fi connection
   - ✅ Close other bandwidth-intensive applications

#### Windows Firewall Exception:
If you get connection refused errors:
1. Open Windows Defender Firewall
2. Click "Allow an app or feature through Windows Defender Firewall"
3. Click "Change settings" and "Allow another app"
4. Browse to your Node.js installation and add it

### 📋 Quick Reference

| Service | Local URL | Network URL | Purpose |
|---------|-----------|-------------|---------|
| Frontend | http://localhost:5173 | http://192.168.0.160:5173 | Mobile App |
| Backend | http://localhost:4000 | http://192.168.0.160:4000 | API Server |
| Health Check | http://localhost:4000/api/health | http://192.168.0.160:4000/api/health | API Status |

### 🚀 Next Steps

Once you've confirmed mobile access works:
1. **For Production**: Update `VITE_API_BASE_URL` to your production API URL
2. **For Native Apps**: Use `npx cap run android` or `npx cap run ios`
3. **For Testing**: Consider using tools like ngrok for external access

---
**Note**: This configuration is for development purposes only. For production deployment, use proper HTTPS and domain names.