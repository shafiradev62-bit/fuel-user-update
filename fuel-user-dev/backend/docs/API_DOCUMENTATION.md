# FuelFriendly OTP API Documentation

## Base URL
```
http://localhost:4000
```

## Authentication
No authentication required for OTP endpoints.

## Content Type
All requests must include:
```
Content-Type: application/json
```

---

## Email OTP Endpoints

### 1. Send Email OTP

Send a 6-digit OTP code to the specified email address.

**Endpoint:** `POST /api/otp/email/send`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Verification code sent successfully"
}
```

**Language Detection Examples:**

*Indonesian email (gmail.com):*
```bash
# Request
{"email": "user@gmail.com"}

# Email sent with:
# Subject: "Kode Verifikasi FuelFriendly"
# Content: "Kode verifikasi Anda adalah: 123456"
```

*English email (company.com):*
```bash
# Request
{"email": "user@company.com"}

# Email sent with:
# Subject: "FuelFriendly Verification Code" 
# Content: "Your verification code is: 123456"
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Email is required"
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid email format"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Email service is not configured. Please contact support."
}
```

### 2. Verify Email OTP

Verify the OTP code sent to the email address.

**Endpoint:** `POST /api/otp/email/verify`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Email and OTP are required"
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid email format"
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "error": "OTP must be 6 digits"
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Invalid OTP code"
}
```

---

## WhatsApp OTP Endpoints

### 1. Send WhatsApp OTP

Send a 6-digit OTP code via WhatsApp to the specified phone number.

**Endpoint:** `POST /api/otp/whatsapp/send`

**Request Body:**
```json
{
  "phoneNumber": "6289502694005"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP sent via WhatsApp",
  "expiresIn": 300
}
```

**Language Detection Examples:**

*Indonesian number (62xxx):*
```bash
# Request
{"phoneNumber": "6289502694005"}

# WhatsApp message sent:
🔐 *FuelFriendly OTP*

Kode verifikasi Anda: *123456*

Kode berlaku selama 5 menit.
Jangan bagikan kode ini kepada siapapun.
```

*US number (1xxx):*
```bash
# Request  
{"phoneNumber": "15551234567"}

# WhatsApp message sent:
🔐 *FuelFriendly OTP*

Your verification code: *123456*

Code expires in 5 minutes.
Do not share this code with anyone.
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Phone number is required"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "WhatsApp not connected"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Failed to send WhatsApp OTP"
}
```

### 2. Verify WhatsApp OTP

Verify the OTP code sent via WhatsApp.

**Endpoint:** `POST /api/otp/whatsapp/verify`

**Request Body:**
```json
{
  "phoneNumber": "6289502694005",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Phone number and OTP are required"
}
```

**200 OK (Verification Failed):**
```json
{
  "success": false,
  "error": "OTP not found"
}
```

**200 OK (Verification Failed):**
```json
{
  "success": false,
  "error": "OTP expired"
}
```

**200 OK (Verification Failed):**
```json
{
  "success": false,
  "error": "Invalid OTP"
}
```

**200 OK (Verification Failed):**
```json
{
  "success": false,
  "error": "OTP already used"
}
```

---

## Utility Endpoints

### Server Health Check

Check if the server is running.

**Endpoint:** `GET /api/ping`

**Response (200):**
```json
{
  "status": "ok"
}
```

---

## Language Detection

The API automatically detects the appropriate language for OTP messages based on:

### WhatsApp OTP Language Detection
Based on phone number country code:

| Country Code | Country | Language | Example Number |
|--------------|---------|----------|----------------|
| 62 | Indonesia | Indonesian | 6289502694005 |
| 60 | Malaysia | Indonesian | 60123456789 |
| 1 | USA/Canada | English | 15551234567 |
| 44 | UK | English | 447911123456 |
| 65 | Singapore | English | 6591234567 |
| 61 | Australia | English | 61412345678 |
| 91 | India | English | 919876543210 |
| Others | - | English (default) | - |

### Email OTP Language Detection
Based on email domain and content:

| Domain Pattern | Language | Example |
|----------------|----------|----------|
| gmail.com, yahoo.co.id, *.id | Indonesian | user@gmail.com |
| Contains: indonesia, jakarta, surabaya | Indonesian | john.jakarta@company.com |
| All others | English | user@company.com |

### Message Examples

**Indonesian WhatsApp OTP:**
```
 *FuelFriendly OTP*

Kode verifikasi Anda: *123456*

Kode berlaku selama 5 menit.
Jangan bagikan kode ini kepada siapapun.
```

**English WhatsApp OTP:**
```
 *FuelFriendly OTP*

Your verification code: *123456*

Code expires in 5 minutes.
Do not share this code with anyone.
```

**Indonesian Email Subject:** `Kode Verifikasi FuelFriendly`
**English Email Subject:** `FuelFriendly Verification Code`

---

## Data Formats

### Email Format
- Must be a valid email address
- Example: `user@example.com`
- Language auto-detected from domain

### Phone Number Format
- International phone numbers with country code
- Format: `6289502694005` (without + sign)
- Language auto-detected from country code
- Examples:
  - Indonesia: `6289502694005`
  - USA: `15551234567`
  - UK: `447911123456`

### OTP Format
- 6-digit numeric string
- Example: `123456`
- Valid range: `100000` to `999999`

---

## Error Handling

All error responses follow this structure:
```json
{
  "success": false,
  "error": "Error message description"
}
```

All success responses follow this structure:
```json
{
  "success": true,
  "message": "Success message description"
}
```

---

## Rate Limiting

- OTP codes expire after 5 minutes (300 seconds)
- Each OTP can only be used once
- No rate limiting currently implemented

---

## Example Usage

### cURL Examples

**Send Email OTP (Indonesian):**
```bash
curl -X POST http://localhost:4000/api/otp/email/send \
  -H "Content-Type: application/json" \
  -d '{"email":"user@gmail.com"}'
```

**Send Email OTP (English):**
```bash
curl -X POST http://localhost:4000/api/otp/email/send \
  -H "Content-Type: application/json" \
  -d '{"email":"user@company.com"}'
```

**Verify Email OTP:**
```bash
curl -X POST http://localhost:4000/api/otp/email/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","otp":"123456"}'
```

**Send WhatsApp OTP (Indonesian - 62xxx):**
```bash
curl -X POST http://localhost:4000/api/otp/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"6289502694005"}'
```

**Send WhatsApp OTP (English - 1xxx):**
```bash
curl -X POST http://localhost:4000/api/otp/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"15551234567"}'
```

**Verify WhatsApp OTP:**
```bash
curl -X POST http://localhost:4000/api/otp/whatsapp/verify \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"6289502694005","otp":"123456"}'
```

**Delete Account:**
```bash
curl -X DELETE http://localhost:4000/api/auth/delete-account \
  -H "Content-Type: application/json" \
  -d '{"customerId":"customer_123","reason":"No longer need the service"}'
```

---

## Account Management Endpoints

### Delete Account

Permanently delete a user account and all associated data.

**Endpoint:** `DELETE /api/auth/delete-account`

**Request Body:**
```json
{
  "customerId": "customer_123",
  "reason": "No longer need the service"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Account deleted successfully",
  "responseCode": "RC_200",
  "timestamp": "2024-12-25T15:40:12.541Z"
}
```

**Error Responses:**

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Customer ID required",
  "responseCode": "RC_400",
  "timestamp": "2024-12-25T15:40:12.541Z"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "User not found",
  "responseCode": "RC_A003",
  "timestamp": "2024-12-25T15:40:12.541Z"
}
```

**Data Deletion Process:**
When an account is deleted, the following data is permanently removed:
1. FCM tokens (push notification tokens)
2. User notifications
3. Order history
4. Vehicle information
5. Customer profile data

**Note:** This action is irreversible. All user data will be permanently deleted from the system.

### JavaScript Examples

**Send Email OTP:**
```javascript
const response = await fetch('http://localhost:4000/api/otp/email/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com'
  })
});

const result = await response.json();
console.log(result);
```

**Verify Email OTP:**
```javascript
const response = await fetch('http://localhost:4000/api/otp/email/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    otp: '123456'
  })
});

const result = await response.json();
console.log(result);
```

---

Berikut adalah semua perubahan yang saya lakukan:

File yang Diubah:
1. /Users/admin/Documents/FREELANCE/fuel-user/.env.local
Status: DIBUAT BARU

# Menambahkan RESEND_API_KEY

2. /Users/admin/Documents/FREELANCE/fuel-user/server/routes/otp.routes.js
Status: dirubah

// SEBELUM:
import { sendEmailOTP } from "../services/sendgrid.service.js";

// SESUDAH:
import { sendEmailOTP } from "../services/email.service.js";


Alasan: Mengganti dari SendGrid ke Resend service

3. /Users/admin/Documents/FREELANCE/fuel-user/server/index.js
Status: penambahan endpoint baru

Penambahan WhatsApp OTP endpoints:

// DITAMBAH SEBELUM "Register OTP routes":
app.post('/api/otp/whatsapp/send', async (req, res) => {
  // ... endpoint untuk kirim WhatsApp OTP
});

app.post('/api/otp/whatsapp/verify', async (req, res) => {
  // ... endpoint untuk verify WhatsApp OTP  
});

Ringkasan Perubahan:
File	Jenis Perubahan	Deskripsi
.env.local	BARU	Setup Resend API key
server/routes/otp.routes.js	UBAH	Ganti import SendGrid → Resend
server/index.js	TAMBAH	2 endpoint WhatsApp OTP baru

Hasil Perubahan:
Email OTP berfungsi (via Resend API)

WhatsApp OTP berfungsi (via Baileys)

API endpoints lengkap untuk testing

🔧 File yang TIDAK Diubah:
server/services/email.service.js - Sudah ada implementasi Resend

server/whatsapp-service.js - Sudah ada implementasi WhatsApp

server/otp-service.js - Sudah ada logic OTP

