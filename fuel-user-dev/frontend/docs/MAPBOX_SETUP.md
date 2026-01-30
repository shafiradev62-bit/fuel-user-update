# 🗺️ Mapbox Setup Guide

## 📍 **Mapbox Configuration**

### **1. Create Mapbox Account**
1. Daftar di [Mapbox](https://www.mapbox.com/)
2. Login ke dashboard
3. Go to **Account** > **Access Tokens**
4. Copy **Default Public Token** atau create new token

### **2. Setup Environment Variable**
Edit `frontend/.env.local`:
```env
VITE_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_access_token_here
```

### **3. Mapbox Features Used**

#### **Map Component**: `frontend/components/MapboxMap.tsx`
- ✅ **Interactive Map** dengan Mapbox GL JS
- ✅ **User Location Marker** (green pin dengan label "Me")
- ✅ **Fuel Station Markers** (red pins dengan label "Fuel station")
- ✅ **Navigation Controls** (zoom in/out, compass)
- ✅ **Click Events** pada station markers
- ✅ **Auto Center** ke user location
- ✅ **Responsive Design** untuk mobile dan desktop

#### **Map Integration**
```tsx
<MapboxMap
  stations={stations}
  userLocation={userLocation}
  onStationSelect={(station) => navigate(`/station/${station.id}`)}
/>
```

### **4. Location Services**

#### **GPS Integration**:
```tsx
navigator.geolocation.getCurrentPosition(
  (position) => {
    setUserLocation({ 
      lat: position.coords.latitude, 
      lon: position.coords.longitude 
    });
  },
  () => {
    // Fallback to Jakarta coordinates
    setUserLocation({ lat: -6.200000, lon: 106.816666 });
  }
);
```

### **5. Mapbox Pricing**
- **50,000 map loads** per month (free tier)
- **Unlimited** static map requests
- **No credit card** required untuk free tier

Mapbox integration sudah siap! 🗺️