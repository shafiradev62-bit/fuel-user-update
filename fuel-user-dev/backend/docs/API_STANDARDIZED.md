# FuelFriendly Standardized API Documentation

## Base URL
```
http://localhost:4000/api
```

## Response Format
All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "message": "Success",
  "responseCode": "RC_200",
  "data": {
    // Response data here
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid credentials",
  "responseCode": "RC_A001",
  "error": "Email/password salah",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Response Codes

| Code | Message | Description |
|------|---------|-------------|
| RC_200 | Success | Operation successful |
| RC_201 | Created successfully | Resource created |
| RC_400 | Bad request | Invalid request |
| RC_401 | Unauthorized | Authentication required |
| RC_404 | Not found | Resource not found |
| RC_422 | Validation error | Request validation failed |
| RC_500 | Internal server error | Server error |
| RC_A001 | Invalid credentials | Login failed |
| RC_A002 | Email already exists | Registration failed |
| RC_A003 | User not found | User lookup failed |
| RC_A004 | Token expired | JWT token expired |
| RC_O001 | OTP sent successfully | OTP delivered |
| RC_O002 | Invalid OTP | Wrong OTP code |
| RC_O003 | OTP expired | OTP timeout |
| RC_O004 | OTP not found | OTP not found |
| RC_W001 | WhatsApp not connected | WhatsApp service down |
| RC_W002 | WhatsApp send failed | WhatsApp delivery failed |
| RC_E001 | Email send failed | Email delivery failed |
| RC_E002 | Email service error | Email service unavailable |
| RC_OR001 | Order created successfully | Order created |
| RC_OR002 | Order not found | Order lookup failed |
| RC_OR003 | Order cancelled | Order cancelled |
| RC_S001 | Stations found | Stations retrieved |
| RC_S002 | Station not found | Station lookup failed |
| RC_P001 | Payment successful | Payment processed |
| RC_P002 | Payment failed | Payment processing failed |

---

## Authentication Endpoints

### Login
**POST** `/auth/login`

**Request:**
```json
{
  "emailOrPhone": "admin@fuelfriend.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "responseCode": "RC_200",
  "data": {
    "customer": {
      "id": "1",
      "fullName": "Admin User",
      "email": "admin@fuelfriend.com",
      "isEmailVerified": true
    },
    "vehicles": [],
    "token": "jwt_token_here"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Google Authentication
**POST** `/auth/google`

**Request:**
```json
{
  "uid": "google_uid",
  "email": "user@gmail.com",
  "displayName": "John Doe"
}
```

### Registration Step 1
**POST** `/auth/register/step1`

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "081234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Step 1 completed",
  "responseCode": "RC_200",
  "data": {
    "tempId": "temp_1642234567890"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Complete Registration
**POST** `/auth/register/complete`

**Request:**
```json
{
  "step1": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "081234567890",
    "password": "password123"
  },
  "step2": {
    "brand": "Toyota",
    "color": "Red",
    "licenseNumber": "B1234XYZ",
    "fuelType": "Petrol"
  }
}
```

---

## OTP Endpoints

### Send Email OTP
**POST** `/auth/otp/email/send`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "responseCode": "RC_O001",
  "data": null,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Verify Email OTP
**POST** `/auth/otp/email/verify`

**Request:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

### Send WhatsApp OTP
**POST** `/auth/otp/whatsapp/send`

**Request:**
```json
{
  "phoneNumber": "081234567890"
}
```

### Verify WhatsApp OTP
**POST** `/auth/otp/whatsapp/verify`

**Request:**
```json
{
  "phoneNumber": "081234567890",
  "otp": "123456"
}
```

### WhatsApp Status
**GET** `/auth/otp/whatsapp/status`

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "responseCode": "RC_200",
  "data": {
    "connected": true,
    "status": "connected"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Password Reset Endpoints

### Forgot Password
**POST** `/auth/forgot-password`

**Request:**
```json
{
  "emailOrPhone": "user@example.com"
}
```

### Reset Password
**POST** `/auth/reset-password`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "newpassword123"
}
```

---

## Core API Endpoints

### Health Check
**GET** `/health`

**Response:**
```json
{
  "success": true,
  "message": "Success",
  "responseCode": "RC_200",
  "data": {
    "status": "ok",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "database": "postgresql",
    "whatsapp": true
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Fuel Stations
**GET** `/stations?lat=-6.200000&lng=106.816666`

**Response:**
```json
{
  "success": true,
  "message": "Stations found",
  "responseCode": "RC_S001",
  "data": [
    {
      "id": "station_1",
      "name": "Shell Station Jakarta",
      "address": "Jl. Sudirman No. 1",
      "latitude": "-6.200000",
      "longitude": "106.816666",
      "distance": "0.5 km",
      "regularPrice": "10000",
      "premiumPrice": "12000",
      "dieselPrice": "11000",
      "rating": "4.5",
      "totalReviews": 150
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**GET** `/stations/:id`

### Orders
**POST** `/orders`

**Request:**
```json
{
  "customerId": "cust123",
  "deliveryAddress": "Jl. Sudirman No. 1",
  "deliveryPhone": "081234567890",
  "fuelType": "Premium",
  "fuelQuantity": "10.00",
  "totalAmount": "150000",
  "deliveryFee": "15000"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "responseCode": "RC_OR001",
  "data": {
    "orderId": "order_123",
    "trackingNumber": "TRK-1642234567890",
    "status": "confirmed"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**GET** `/orders?customerId=cust123`

### Payments
**POST** `/payments/create-intent`

**Request:**
```json
{
  "amount": 150000,
  "currency": "idr",
  "orderId": "order_123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment successful",
  "responseCode": "RC_P001",
  "data": {
    "client_secret": "pi_xxx_secret_xxx",
    "payment_intent_id": "pi_xxx"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **422**: Validation Error
- **500**: Internal Server Error
- **503**: Service Unavailable

### Validation Errors
When request validation fails, the API returns:

```json
{
  "success": false,
  "message": "Email is required",
  "responseCode": "RC_422",
  "error": "Validation failed",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Usage Examples

### cURL Examples

**Login:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone":"admin@fuelfriend.com","password":"password123"}'
```

**Send Email OTP:**
```bash
curl -X POST http://localhost:4000/api/auth/otp/email/send \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

**Get Stations:**
```bash
curl -X GET "http://localhost:4000/api/stations?lat=-6.200000&lng=106.816666"
```

### JavaScript Examples

**Login:**
```javascript
const response = await fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    emailOrPhone: 'admin@fuelfriend.com',
    password: 'password123'
  })
});

const result = await response.json();
console.log(result);
```

---

## Server Commands

To use the standardized API server:

```bash
# Start standardized server
cd backend
node server/index-standardized.js

# Or update package.json script to use standardized server
npm run dev
```