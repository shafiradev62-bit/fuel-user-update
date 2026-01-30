# 🔧 Database & Services Setup Guide

## 📊 **Database Connection (PostgreSQL)**

### **1. Install PostgreSQL**
```bash
# macOS (Homebrew)
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Windows
# Download dari https://www.postgresql.org/download/windows/
```

### **2. Create Database**
```bash
# Login ke PostgreSQL
psql postgres

# Create database dan user
CREATE DATABASE fuelfriendly;
CREATE USER fuelfriendly_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE fuelfriendly TO fuelfriendly_user;
\q
```

### **3. Setup Environment Variables**
```bash
cd backend
cp .env.local.template .env.local
```

Edit `.env.local`:
```env
DATABASE_URL=postgresql://fuelfriendly_user:your_password@localhost:5432/fuelfriendly
```

### **4. Run Database Migrations**
```bash
cd backend
npm run db:generate  # Generate migration files
npm run db:migrate   # Apply migrations
npm run seed         # Seed initial data
```

---

## 📧 **Email OTP (SendGrid)**

### **1. Setup SendGrid Account**
1. Daftar di [SendGrid](https://sendgrid.com/)
2. Verify email address
3. Create API Key di Settings > API Keys
4. Copy API Key

### **2. Configure Environment**
Edit `backend/.env.local`:
```env
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### **3. Test Email Service**
```bash
cd backend
node scripts/test-sendgrid-email.js
```

---

## 📱 **WhatsApp OTP (Baileys)**

### **1. WhatsApp Service Features**
- ✅ **Auto Language Detection** (Indonesian/English berdasarkan country code)
- ✅ **QR Code Authentication** (scan sekali, session tersimpan)
- ✅ **Auto Reconnect** dengan retry mechanism
- ✅ **Multi-instance Protection** dengan lock file
- ✅ **Session Persistence** di `server/wa-session/`

### **2. Setup WhatsApp**
```bash
cd backend
npm run whatsapp:setup
```

**Langkah-langkah:**
1. Jalankan command di atas
2. QR Code akan muncul di terminal
3. Buka WhatsApp di ponsel
4. Tap menu (3 titik) > **Perangkat Tertaut**
5. Tap **"Tautkan Perangkat"**
6. Scan QR code di terminal
7. Tunggu pesan "WhatsApp connected successfully!"

### **3. WhatsApp Commands**
```bash
# Setup/Connect WhatsApp
npm run whatsapp:setup

# Clear session (jika perlu reset)
npm run whatsapp:clear

# Check status
npm run whatsapp:daemon

# Reset connection
npm run whatsapp:reset
```

### **4. Language Detection**
WhatsApp OTP otomatis detect bahasa berdasarkan country code:

| Country Code | Country | Language | Example |
|--------------|---------|----------|---------|
| 62 | Indonesia | Indonesian | 6289502694005 |
| 60 | Malaysia | Indonesian | 60123456789 |
| 1 | USA/Canada | English | 15551234567 |
| 44 | UK | English | 447911123456 |
| 65 | Singapore | English | 6591234567 |

**Indonesian Message:**
```
🔐 *FuelFriendly OTP*

Kode verifikasi Anda: *123456*

Kode berlaku selama 5 menit.
Jangan bagikan kode ini kepada siapapun.
```

**English Message:**
```
🔐 *FuelFriendly OTP*

Your verification code: *123456*

Code expires in 5 minutes.
Do not share this code with anyone.
```

---

## 🚀 **Start Services**

### **1. Start Backend Server**
```bash
cd backend
npm run dev
```

Server akan berjalan di: **http://localhost:4000**

### **2. Check Services Status**
```bash
# Health check
curl http://localhost:4000/api/health

# WhatsApp status
curl http://localhost:4000/api/auth/otp/whatsapp/status
```

### **3. Test OTP Services**
```bash
# Test Email OTP
curl -X POST http://localhost:4000/api/auth/otp/email/send \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Test WhatsApp OTP
curl -X POST http://localhost:4000/api/auth/otp/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"6289502694005"}'
```

---

## 🔍 **Troubleshooting**

### **Database Issues**
```bash
# Check PostgreSQL status
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux

# Test connection
psql postgresql://fuelfriendly_user:password@localhost:5432/fuelfriendly
```

### **WhatsApp Issues**
```bash
# Clear session dan reconnect
npm run whatsapp:clear
npm run whatsapp:setup

# Check session files
ls -la server/wa-session/
```

### **Email Issues**
```bash
# Test SendGrid API key
node scripts/test-sendgrid-email.js

# Check logs
tail -f logs/app.log  # jika ada logging
```

---

## 📋 **Production Checklist**

- [ ] PostgreSQL database setup dan running
- [ ] SendGrid API key valid dan email verified
- [ ] WhatsApp session connected dan stable
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Initial data seeded
- [ ] Services health check passing
- [ ] OTP testing successful

Semua services siap untuk production! 🎉