import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db.js';
import { customers, vehicles, orders, orderItems, fuelStations, products, fuelFriends, fcmTokens, notifications, reviews } from './shared/schema.js';
import { eq, sql } from 'drizzle-orm';
import axios from 'axios';
import Stripe from 'stripe';
import whatsappService from './whatsapp-service.js';
import { initializeDatabase } from './database-checker.js';
import notificationService from './services/notification.service.js';

import jwt from 'jsonwebtoken';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT token
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.error(RESPONSE_CODES.UNAUTHORIZED, 'Token required');
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.error(RESPONSE_CODES.UNAUTHORIZED, 'Invalid token');
  }
};
import { RESPONSE_CODES } from '../utils/responseHandler.js';
import { responseMiddleware, errorHandler } from '../utils/middleware.js';
import { 
  validateRequest, 
  loginSchema, 
  registerStep1Schema, 
  registerCompleteSchema,
  googleAuthSchema,
  emailOTPSendSchema,
  emailOTPVerifySchema,
  whatsappOTPSendSchema,
  whatsappOTPVerifySchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  createOrderSchema,
  createPaymentIntentSchema,
  deleteAccountSchema
} from '../utils/validation.js';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:4000', // Local development
    'http://192.168.0.160:5173', // Mobile access to Vite
    'http://192.168.0.160:4000', // Mobile access to API
    'capacitor://localhost', // iOS Capacitor
    'http://localhost' // Android Capacitor
  ],
  credentials: true
}));
app.use(express.json());
app.use(responseMiddleware);

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

// SendGrid service setup
import sgMail from '@sendgrid/mail';

const sendEmailOTP = async (email, otp) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY not configured');
    }
    
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@fuelfriendly.com',
      subject: 'FuelFriendly Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4CAF50;">FuelFriendly</h2>
          <p>Your verification code is:</p>
          <div style="font-size: 24px; font-weight: bold; color: #333; margin: 20px 0;">${otp}</div>
          <p style="color: #666;">This code expires in 5 minutes.</p>
        </div>
      `
    };
    
    await sgMail.send(msg);
    console.log('✅ Email sent via SendGrid');
    return true;
  } catch (error) {
    console.error('SendGrid send error:', error);
    throw error;
  }
};

// In-memory OTP store
const otpStore = new Map();

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.post('/api/auth/login', validateRequest(loginSchema), async (req, res) => {
  try {
    const { emailOrPhone, password } = req.validatedData;
    
    const user = await db.select().from(customers).where(eq(customers.email, emailOrPhone)).limit(1);
    if (!user.length || user[0].password !== password) {
      return res.error(RESPONSE_CODES.INVALID_CREDENTIALS);
    }
    
    const userVehicles = await db.select().from(vehicles).where(eq(vehicles.customerId, user[0].id));
    
    return res.success(RESPONSE_CODES.SUCCESS, {
      customer: {
        id: user[0].id,
        fullName: user[0].fullName,
        email: user[0].email,
        isEmailVerified: user[0].isEmailVerified
      },
      vehicles: userVehicles,
      token: generateToken(user[0].id, user[0].email)
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.post('/api/auth/register/step1', validateRequest(registerStep1Schema), async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.validatedData;
    
    const existingUser = await db.select().from(customers).where(eq(customers.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.error(RESPONSE_CODES.EMAIL_ALREADY_EXISTS);
    }
    
    // Store step1 data temporarily (in production, use Redis or database)
    const tempId = `temp_${Date.now()}`;
    otpStore.set(tempId, { fullName, email, phoneNumber, password, step: 1 });
    
    return res.success(RESPONSE_CODES.SUCCESS, { tempId }, 'Step 1 completed');
  } catch (error) {
    console.error('Registration step1 error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.post('/api/auth/register/complete', validateRequest(registerCompleteSchema), async (req, res) => {
  try {
    const { step1, step2 } = req.validatedData;
    
    // Check if user exists
    const existingUser = await db.select().from(customers).where(eq(customers.email, step1.email)).limit(1);
    if (existingUser.length > 0) {
      return res.error(RESPONSE_CODES.EMAIL_ALREADY_EXISTS);
    }
    
    // Create user
    const [newUser] = await db.insert(customers).values({
      fullName: step1.fullName,
      email: step1.email,
      phoneNumber: step1.phoneNumber,
      password: step1.password,
      profilePhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(step1.fullName)}&background=random`
    }).returning();
    
    // Create vehicle
    await db.insert(vehicles).values({
      customerId: newUser.id,
      brand: step2.brand,
      color: step2.color,
      licenseNumber: step2.licenseNumber,
      fuelType: step2.fuelType,
      isPrimary: true
    });
    
    return res.success(RESPONSE_CODES.CREATED, {
      customer: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName
      },
      token: generateToken(newUser.id, newUser.email)
    });
  } catch (error) {
    console.error('Registration complete error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.post('/api/auth/google', validateRequest(googleAuthSchema), async (req, res) => {
  try {
    const { uid, email, displayName } = req.validatedData;
    
    // Check if user exists
    let user = await db.select().from(customers).where(eq(customers.email, email)).limit(1);
    
    if (!user.length) {
      // Create new user
      const [newUser] = await db.insert(customers).values({
        fullName: displayName,
        email: email,
        phoneNumber: '',
        password: `google_${uid}`,
        isEmailVerified: true,
        profilePhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`
      }).returning();
      user = [newUser];
    }
    
    return res.success(RESPONSE_CODES.SUCCESS, {
      customer: {
        id: user[0].id,
        fullName: user[0].fullName,
        email: user[0].email,
        isEmailVerified: user[0].isEmailVerified
      },
      token: generateToken(user[0].id, user[0].email)
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

// ==========================================
// AUTH ME ENDPOINT
// ==========================================

app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT token
    
    // Get user data from database
    const user = await db.select().from(customers)
      .where(eq(customers.id, userId))
      .limit(1);
    
    if (!user.length) {
      return res.error(RESPONSE_CODES.USER_NOT_FOUND);
    }
    
    // Get user vehicles
    const userVehicles = await db.select().from(vehicles)
      .where(eq(vehicles.customerId, userId));
    
    return res.success(RESPONSE_CODES.SUCCESS, {
      customer: {
        id: user[0].id,
        fullName: user[0].fullName,
        email: user[0].email,
        phoneNumber: user[0].phoneNumber,
        address: user[0].address,
        city: user[0].city,
        gender: user[0].gender,
        isEmailVerified: user[0].isEmailVerified,
        avatarUrl: user[0].profilePhoto
      },
      vehicles: userVehicles
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

// ==========================================
// OTP ROUTES
// ==========================================

app.post('/api/auth/otp/email/send', validateRequest(emailOTPSendSchema), async (req, res) => {
  try {
    const { email } = req.validatedData;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    otpStore.set(email, {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
      type: 'email'
    });
    
    console.log(`📧 Sending OTP ${otp} to ${email} via EmailJS...`);
    
    // Send OTP via EmailJS
    try {
      await sendEmailOTP(email, otp);
    } catch (emailError) {
      console.error('Email send error:', emailError);
      // Don't fail - return success anyway for development
      console.log(`📧 Fallback: OTP ${otp} for ${email}`);
    }
    
    return res.success(RESPONSE_CODES.OTP_SENT);
  } catch (error) {
    console.error('Email OTP error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.post('/api/auth/otp/email/verify', validateRequest(emailOTPVerifySchema), async (req, res) => {
  try {
    const { email, otp } = req.validatedData;
    
    const storedData = otpStore.get(email);
    if (!storedData) {
      return res.error(RESPONSE_CODES.OTP_NOT_FOUND);
    }
    
    if (Date.now() > storedData.expires) {
      otpStore.delete(email);
      return res.error(RESPONSE_CODES.OTP_EXPIRED);
    }
    
    if (storedData.otp !== otp) {
      return res.error(RESPONSE_CODES.INVALID_OTP);
    }
    
    // ✅ Update email verification status in database
    try {
      await db.update(customers)
        .set({ isEmailVerified: true })
        .where(eq(customers.email, email));
      console.log(`✅ Email verified for: ${email}`);
    } catch (dbError) {
      console.log('⚠️ Could not update email verification status:', dbError.message);
    }
    
    otpStore.delete(email);
    return res.success(RESPONSE_CODES.SUCCESS, null, 'OTP verified successfully');
  } catch (error) {
    console.error('OTP verify error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.post('/api/auth/otp/whatsapp/send', validateRequest(whatsappOTPSendSchema), async (req, res) => {
  try {
    const { phoneNumber } = req.validatedData;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    otpStore.set(phoneNumber, {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
      type: 'whatsapp'
    });
    
    if (!whatsappService.isConnected) {
      console.log(`📱 WhatsApp OTP (fallback): ${otp} for ${phoneNumber}`);
      return res.success(RESPONSE_CODES.OTP_SENT, null, 'OTP generated (WhatsApp service connecting)');
    }
    
    try {
      await whatsappService.sendOTP(phoneNumber, otp);
      return res.success(RESPONSE_CODES.OTP_SENT);
    } catch (whatsappError) {
      console.error('WhatsApp send error:', whatsappError);
      return res.error(RESPONSE_CODES.WHATSAPP_SEND_FAILED);
    }
  } catch (error) {
    console.error('WhatsApp OTP error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.post('/api/auth/otp/whatsapp/verify', validateRequest(whatsappOTPVerifySchema), async (req, res) => {
  try {
    const { phoneNumber, otp } = req.validatedData;
    
    const storedData = otpStore.get(phoneNumber);
    if (!storedData) {
      return res.error(RESPONSE_CODES.OTP_NOT_FOUND);
    }
    
    if (Date.now() > storedData.expires) {
      otpStore.delete(phoneNumber);
      return res.error(RESPONSE_CODES.OTP_EXPIRED);
    }
    
    if (storedData.otp !== otp) {
      return res.error(RESPONSE_CODES.INVALID_OTP);
    }
    
    // ✅ Update phone verification status in database (if user exists)
    try {
      const result = await db.update(customers)
        .set({ 
          phoneNumber: phoneNumber,
          // Could add isPhoneVerified field if needed
        })
        .where(eq(customers.phoneNumber, phoneNumber))
        .returning();
      
      if (result.length > 0) {
        console.log(`✅ Phone verified for: ${phoneNumber}`);
      }
    } catch (dbError) {
      console.log('⚠️ Could not update phone verification status:', dbError.message);
    }
    
    otpStore.delete(phoneNumber);
    return res.success(RESPONSE_CODES.SUCCESS, null, 'OTP verified successfully');
  } catch (error) {
    console.error('WhatsApp OTP verify error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.get('/api/auth/otp/whatsapp/status', (req, res) => {
  return res.success(RESPONSE_CODES.SUCCESS, {
    connected: whatsappService.isConnected,
    status: whatsappService.isConnected ? 'connected' : 'disconnected'
  });
});

// ==========================================
// PASSWORD RESET ROUTES
// ==========================================

app.post('/api/auth/forgot-password', validateRequest(forgotPasswordSchema), async (req, res) => {
  try {
    const { emailOrPhone } = req.validatedData;
    
    const user = await db.select().from(customers).where(eq(customers.email, emailOrPhone)).limit(1);
    if (!user.length) {
      return res.error(RESPONSE_CODES.USER_NOT_FOUND);
    }
    
    // Generate and send reset code (similar to OTP)
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(emailOrPhone, {
      otp: resetCode,
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      type: 'password_reset'
    });
    
    return res.success(RESPONSE_CODES.OTP_SENT, null, 'Password reset code sent');
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.put('/api/profile/update', async (req, res) => {
  try {
    const { customerId, fullName, email, phoneNumber, city, gender, vehicle } = req.body;
    
    if (!customerId) {
      return res.error(RESPONSE_CODES.BAD_REQUEST, 'Customer ID required');
    }
    
    // Update customer profile
    const [updatedCustomer] = await db.update(customers)
      .set({ 
        fullName: fullName || undefined,
        email: email || undefined, 
        phoneNumber: phoneNumber || undefined,
        city: city || undefined,
        gender: gender || undefined
      })
      .where(eq(customers.id, customerId))
      .returning();
    
    // Update vehicle if provided
    if (vehicle && Object.keys(vehicle).length > 0) {
      await db.update(vehicles)
        .set({
          brand: vehicle.brand || undefined,
          color: vehicle.color || undefined,
          licenseNumber: vehicle.licenseNumber || undefined
        })
        .where(eq(vehicles.customerId, customerId));
    }
    
    // Get updated vehicles
    const userVehicles = await db.select().from(vehicles).where(eq(vehicles.customerId, customerId));
    
    return res.success(RESPONSE_CODES.SUCCESS, {
      customer: {
        id: updatedCustomer.id,
        fullName: updatedCustomer.fullName,
        email: updatedCustomer.email,
        phoneNumber: updatedCustomer.phoneNumber,
        city: updatedCustomer.city,
        gender: updatedCustomer.gender,
        avatarUrl: updatedCustomer.profilePhoto
      },
      vehicles: userVehicles
    }, 'Profile updated successfully');
  } catch (error) {
    console.error('Update profile error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.post('/api/auth/change-password', async (req, res) => {
  try {
    const { customerId, currentPassword, newPassword } = req.body;
    
    if (!customerId || !currentPassword || !newPassword) {
      return res.error(RESPONSE_CODES.BAD_REQUEST, 'Customer ID, current password, and new password required');
    }
    
    // Verify current password
    const user = await db.select().from(customers).where(eq(customers.id, customerId)).limit(1);
    if (!user.length) {
      return res.error(RESPONSE_CODES.USER_NOT_FOUND);
    }
    
    if (user[0].password !== currentPassword) {
      return res.error(RESPONSE_CODES.INVALID_CREDENTIALS, 'Current password is incorrect');
    }
    
    // Update password
    await db.update(customers)
      .set({ password: newPassword })
      .where(eq(customers.id, customerId));
    
    return res.success(RESPONSE_CODES.SUCCESS, null, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.delete('/api/auth/delete-account', validateRequest(deleteAccountSchema), async (req, res) => {
  try {
    const { customerId, reason } = req.validatedData;
    
    // Check if user exists
    const user = await db.select().from(customers).where(eq(customers.id, customerId)).limit(1);
    if (!user.length) {
      return res.error(RESPONSE_CODES.USER_NOT_FOUND);
    }
    
    // Delete related data in order (foreign key constraints)
    // 1. Delete FCM tokens
    await db.delete(fcmTokens).where(eq(fcmTokens.customerId, customerId));
    
    // 2. Delete notifications
    await db.delete(notifications).where(eq(notifications.customerId, customerId));
    
    // 3. Delete orders
    await db.delete(orders).where(eq(orders.customerId, customerId));
    
    // 4. Delete vehicles
    await db.delete(vehicles).where(eq(vehicles.customerId, customerId));
    
    // 5. Finally delete customer
    await db.delete(customers).where(eq(customers.id, customerId));
    
    // Log deletion reason for analytics (optional)
    if (reason) {
      console.log(`Account deleted - Customer ID: ${customerId}, Reason: ${reason}`);
    }
    
    return res.success(RESPONSE_CODES.ACCOUNT_DELETED);
  } catch (error) {
    console.error('Delete account error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.post('/api/auth/reset-password', validateRequest(resetPasswordSchema), async (req, res) => {
  try {
    const { email, password } = req.validatedData;
    
    const user = await db.select().from(customers).where(eq(customers.email, email)).limit(1);
    if (!user.length) {
      return res.error(RESPONSE_CODES.USER_NOT_FOUND);
    }
    
    await db.update(customers)
      .set({ password })
      .where(eq(customers.email, email));
    
    return res.success(RESPONSE_CODES.SUCCESS, null, 'Password reset successfully');
  } catch (error) {
    console.error('Reset password error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

// ==========================================
// FUEL STATIONS ROUTES
// ==========================================

app.get('/api/stations', async (req, res) => {
  try {
    const { lat, lng, radius = 10000 } = req.query;
    
    if (!lat || !lng) {
      return res.error(RESPONSE_CODES.BAD_REQUEST, 'Latitude and longitude required');
    }
    
    const dbStations = await db.select().from(fuelStations).limit(10);
    
    if (dbStations.length > 0) {
      const stationsWithDistance = dbStations.map(station => ({
        ...station,
        distance: calculateDistance(
          parseFloat(lat), 
          parseFloat(lng), 
          parseFloat(station.latitude), 
          parseFloat(station.longitude)
        ).toFixed(1) + ' km'
      }));
      
      return res.success(RESPONSE_CODES.STATIONS_FOUND, stationsWithDistance);
    }
    
    // Fallback to external API
    try {
      const query = `[out:json];node[amenity=fuel](around:${radius},${lat},${lng});out;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      
      const response = await axios.get(url);
      const stations = response.data.elements.map(station => ({
        id: `osm-${station.id}`,
        name: station.tags?.name || 'Fuel Station',
        address: station.tags?.street || 'Nearby',
        latitude: station.lat,
        longitude: station.lon,
        distance: calculateDistance(
          parseFloat(lat), 
          parseFloat(lng), 
          station.lat, 
          station.lon
        ).toFixed(1) + ' km',
        regularPrice: '1.45',
        premiumPrice: '1.65',
        dieselPrice: '1.55',
        rating: '4.5',
        totalReviews: Math.floor(Math.random() * 100) + 20
      }));
      
      return res.success(RESPONSE_CODES.STATIONS_FOUND, stations.slice(0, 10));
    } catch (apiError) {
      console.error('External API error:', apiError);
      return res.error(RESPONSE_CODES.INTERNAL_ERROR, 'Failed to fetch stations');
    }
  } catch (error) {
    console.error('Stations error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.get('/api/stations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const station = await db.select().from(fuelStations).where(eq(fuelStations.id, id)).limit(1);
    
    if (station.length > 0) {
      const stationProducts = await db.select().from(products).where(eq(products.stationId, id));
      
      // ✅ Get fuel friends dynamically assigned to this specific station
      const stationFuelFriends = await db.select({
        id: fuelFriends.id,
        fullName: fuelFriends.fullName,
        phoneNumber: fuelFriends.phoneNumber,
        email: fuelFriends.email,
        location: fuelFriends.location,
        deliveryFee: fuelFriends.deliveryFee,
        rating: fuelFriends.rating,
        totalReviews: fuelFriends.totalReviews,
        latitude: fuelFriends.latitude,
        longitude: fuelFriends.longitude,
        profilePhoto: fuelFriends.profilePhoto,
        about: fuelFriends.about,
        isAvailable: fuelFriends.isAvailable
      })
      .from(fuelFriends)
      .innerJoin(
        sql`station_fuel_friends`,
        sql`station_fuel_friends.fuel_friend_id = ${fuelFriends.id}`
      )
      .where(
        sql`station_fuel_friends.station_id = ${id} AND station_fuel_friends.is_active = true AND ${fuelFriends.isAvailable} = true`
      )
      .limit(6);
      
      return res.success(RESPONSE_CODES.SUCCESS, {
        ...station[0],
        groceries: stationProducts,
        fuelFriends: stationFuelFriends
      });
    }
    
    return res.error(RESPONSE_CODES.STATION_NOT_FOUND);
  } catch (error) {
    console.error('Station details error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.get('/api/stations/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 20 } = req.query;
    
    try {
      const stationReviews = await db.select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        userName: customers.fullName,
        userAvatar: customers.profilePhoto
      })
      .from(reviews)
      .leftJoin(customers, eq(reviews.customerId, customers.id))
      .where(eq(reviews.stationId, id))
      .orderBy(sql`${reviews.createdAt} DESC`)
      .limit(parseInt(limit));
      
      return res.success(RESPONSE_CODES.REVIEWS_FOUND, stationReviews);
    } catch (dbError) {
      console.log('Reviews table not found, returning empty array');
      return res.success(RESPONSE_CODES.REVIEWS_FOUND, []);
    }
  } catch (error) {
    console.error('Station reviews error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.get('/api/fuel-friends/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const fuelFriend = await db.select().from(fuelFriends).where(eq(fuelFriends.id, id)).limit(1);
    
    if (!fuelFriend.length) {
      return res.error(RESPONSE_CODES.NOT_FOUND, 'Fuel friend not found');
    }
    
    return res.success(RESPONSE_CODES.SUCCESS, fuelFriend[0]);
  } catch (error) {
    console.error('Fuel friend details error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.get('/api/fuel-friends/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 20 } = req.query;
    
    try {
      const friendReviews = await db.select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        userName: customers.fullName,
        userAvatar: customers.profilePhoto
      })
      .from(reviews)
      .leftJoin(customers, eq(reviews.customerId, customers.id))
      .where(eq(reviews.fuelFriendId, id))
      .orderBy(sql`${reviews.createdAt} DESC`)
      .limit(parseInt(limit));
      
      return res.success(RESPONSE_CODES.REVIEWS_FOUND, friendReviews);
    } catch (dbError) {
      console.log('Reviews table not found, returning empty array');
      return res.success(RESPONSE_CODES.SUCCESS, []);
    }
  } catch (error) {
    console.error('Fuel friend reviews error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { customerId, stationId, fuelFriendId, rating, comment } = req.body;
    
    if (!customerId || !rating || (!stationId && !fuelFriendId)) {
      return res.error(RESPONSE_CODES.BAD_REQUEST, 'Customer ID, rating, and either station ID or fuel friend ID required');
    }
    
    try {
      const [newReview] = await db.insert(reviews).values({
        customerId,
        stationId: stationId || null,
        fuelFriendId: fuelFriendId || null,
        rating,
        comment: comment || null
      }).returning();
      
      return res.success(RESPONSE_CODES.REVIEW_CREATED, newReview);
    } catch (dbError) {
      console.log('Reviews table not found, cannot add review');
      return res.error(RESPONSE_CODES.INTERNAL_ERROR, 'Reviews feature not available');
    }
  } catch (error) {
    console.error('Add review error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

// ==========================================
// ORDERS ROUTES
// ==========================================

app.post('/api/orders', validateRequest(createOrderSchema), async (req, res) => {
  try {
    const orderData = req.validatedData;
    
    // Validate customer exists
    const customer = await db.select().from(customers).where(eq(customers.id, orderData.customerId)).limit(1);
    if (!customer.length) {
      return res.error(RESPONSE_CODES.USER_NOT_FOUND, 'Customer not found');
    }
    
    const trackingNumber = `TRK-${Date.now()}`;
    
    // Create order
    const [newOrder] = await db.insert(orders).values({
      trackingNumber,
      customerId: orderData.customerId,
      stationId: orderData.stationId,
      fuelFriendId: orderData.fuelFriendId,
      vehicleId: orderData.vehicleId,
      deliveryAddress: orderData.deliveryAddress,
      deliveryPhone: orderData.deliveryPhone,
      fuelType: orderData.fuelType,
      fuelQuantity: orderData.fuelQuantity,
      fuelCost: orderData.fuelCost,
      deliveryFee: orderData.deliveryFee,
      groceriesCost: orderData.groceriesCost || '0',
      totalAmount: orderData.totalAmount,
      orderType: orderData.orderType || 'instant',
      scheduledDate: orderData.scheduledDate,
      scheduledTime: orderData.scheduledTime,
      estimatedDeliveryTime: orderData.estimatedDeliveryTime,
      status: 'confirmed',
      paymentStatus: 'completed',
      paymentMethod: orderData.paymentMethod || 'credit_card'
    }).returning();
    
    // Insert order items if cartItems provided
    if (orderData.cartItems && orderData.cartItems.length > 0) {
      try {
        const orderItemsData = orderData.cartItems.map(item => ({
          orderId: newOrder.id,
          productId: item.id,
          quantity: item.quantity,
          price: item.price.toString()
        }));
        
        await db.insert(orderItems).values(orderItemsData);
        console.log(`✅ Created ${orderItemsData.length} order items for order ${newOrder.id}`);
      } catch (itemsError) {
        console.error('Error creating order items:', itemsError);
        // Continue without failing the order creation
      }
    }
    
    // 🔔 Send order confirmation notification
    try {
      await notificationService.sendOrderNotification(orderData.customerId, newOrder.id, 'confirmed');
      console.log(`✅ Order confirmation notification sent to customer ${orderData.customerId}`);
    } catch (notificationError) {
      console.error('❌ Failed to send order notification:', notificationError);
      // Don't fail order creation if notification fails
    }
    
    return res.success(RESPONSE_CODES.ORDER_CREATED, {
      orderId: newOrder.id,
      trackingNumber: newOrder.trackingNumber,
      status: 'confirmed'
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.get('/api/orders', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT token
    const { status } = req.query;
    
    const userOrders = await db.select({
      id: orders.id,
      trackingNumber: orders.trackingNumber,
      customerId: orders.customerId,
      stationId: orders.stationId,
      fuelFriendId: orders.fuelFriendId,
      vehicleId: orders.vehicleId,
      deliveryAddress: orders.deliveryAddress,
      deliveryPhone: orders.deliveryPhone,
      fuelType: orders.fuelType,
      fuelQuantity: orders.fuelQuantity,
      fuelCost: orders.fuelCost,
      deliveryFee: orders.deliveryFee,
      groceriesCost: orders.groceriesCost,
      totalAmount: orders.totalAmount,
      orderType: orders.orderType,
      scheduledDate: orders.scheduledDate,
      scheduledTime: orders.scheduledTime,
      estimatedDeliveryTime: orders.estimatedDeliveryTime,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      paymentMethod: orders.paymentMethod,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      // Fuel Friend data
      fuelFriendName: fuelFriends.fullName,
      fuelFriendPhone: fuelFriends.phoneNumber,
      fuelFriendLocation: fuelFriends.location,
      fuelFriendPhoto: fuelFriends.profilePhoto,
      // Station data
      stationName: fuelStations.name,
      stationAddress: fuelStations.address
    })
    .from(orders)
    .leftJoin(fuelFriends, eq(orders.fuelFriendId, fuelFriends.id))
    .leftJoin(fuelStations, eq(orders.stationId, fuelStations.id))
    .where(eq(orders.customerId, userId))
    .orderBy(sql`${orders.createdAt} DESC`);
    
    return res.success(RESPONSE_CODES.SUCCESS, userOrders);
  } catch (error) {
    console.error('Orders fetch error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.get('/api/orders/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const order = await db.select({
      id: orders.id,
      trackingNumber: orders.trackingNumber,
      customerId: orders.customerId,
      stationId: orders.stationId,
      fuelFriendId: orders.fuelFriendId,
      vehicleId: orders.vehicleId,
      deliveryAddress: orders.deliveryAddress,
      deliveryPhone: orders.deliveryPhone,
      fuelType: orders.fuelType,
      fuelQuantity: orders.fuelQuantity,
      fuelCost: orders.fuelCost,
      deliveryFee: orders.deliveryFee,
      groceriesCost: orders.groceriesCost,
      totalAmount: orders.totalAmount,
      orderType: orders.orderType,
      scheduledDate: orders.scheduledDate,
      scheduledTime: orders.scheduledTime,
      estimatedDeliveryTime: orders.estimatedDeliveryTime,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      paymentMethod: orders.paymentMethod,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      stationName: fuelStations.name,
      stationAddress: fuelStations.address,
      fuelFriendName: fuelFriends.fullName,
      fuelFriendPhone: fuelFriends.phoneNumber,
      fuelFriendLocation: fuelFriends.location,
      fuelFriendPhoto: fuelFriends.profilePhoto,
      vehicleBrand: vehicles.brand,
      vehicleColor: vehicles.color,
      vehicleLicense: vehicles.licenseNumber
    })
    .from(orders)
    .leftJoin(fuelStations, eq(orders.stationId, fuelStations.id))
    .leftJoin(fuelFriends, eq(orders.fuelFriendId, fuelFriends.id))
    .leftJoin(vehicles, eq(orders.vehicleId, vehicles.id))
    .where(sql`${orders.id} = ${id} AND ${orders.customerId} = ${userId}`)
    .limit(1);
    
    if (!order.length) {
      return res.error(RESPONSE_CODES.ORDER_NOT_FOUND);
    }
    
    const items = await db.select({
      id: orderItems.id,
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      price: orderItems.price,
      productName: products.name,
      productImage: products.image
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, id));
    
    return res.success(RESPONSE_CODES.SUCCESS, {
      ...order[0],
      items: items
    });
  } catch (error) {
    console.error('Order detail error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

// ==========================================
// PAYMENT ROUTES
// ==========================================

app.post('/api/payments/create-intent', validateRequest(createPaymentIntentSchema), async (req, res) => {
  try {
    const { amount, currency, orderId } = req.validatedData;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      metadata: { orderId },
      automatic_payment_methods: { enabled: true }
    });
    
    return res.success(RESPONSE_CODES.PAYMENT_SUCCESS, {
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    return res.error(RESPONSE_CODES.PAYMENT_FAILED);
  }
});

// ==========================================
// NOTIFICATION ROUTES
// ==========================================

app.post('/api/notifications/register-token', async (req, res) => {
  try {
    const { customerId, token, deviceType } = req.body;
    
    if (!customerId || !token) {
      return res.error(RESPONSE_CODES.BAD_REQUEST, 'Customer ID and token required');
    }
    
    const result = await notificationService.registerToken(customerId, token, deviceType);
    return res.success(RESPONSE_CODES.SUCCESS, result);
  } catch (error) {
    console.error('Register token error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.post('/api/notifications/send', async (req, res) => {
  try {
    const { customerId, title, body, data } = req.body;
    
    if (!customerId || !title || !body) {
      return res.error(RESPONSE_CODES.BAD_REQUEST, 'Customer ID, title, and body required');
    }
    
    const result = await notificationService.sendToCustomer(customerId, title, body, data);
    return res.success(RESPONSE_CODES.SUCCESS, result);
  } catch (error) {
    console.error('Send notification error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.get('/api/notifications', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT token
    const { limit = 20 } = req.query;
    
    const notifications = await notificationService.getCustomerNotifications(userId, parseInt(limit));
    return res.success(RESPONSE_CODES.NOTIFICATIONS_FOUND, notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.patch('/api/notifications/:id/read', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // From JWT token
    
    const result = await notificationService.markAsRead(id, userId);
    return res.success(RESPONSE_CODES.NOTIFICATION_MARKED_READ, result);
  } catch (error) {
    console.error('Mark as read error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

app.post('/api/notifications/test', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT token
    
    const result = await notificationService.sendTestNotification(userId);
    return res.success(RESPONSE_CODES.NOTIFICATION_SENT, result);
  } catch (error) {
    console.error('Test notification error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

// Add sample notification for testing
app.post('/api/notifications/sample/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    // Create a sample notification directly in database
    await db.insert(notifications).values({
      customerId,
      title: 'Welcome to FuelFriendly! 🎉',
      body: 'Your account has been set up successfully. Start ordering fuel now!',
      data: JSON.stringify({ type: 'welcome' }),
      isRead: false
    });
    
    return res.success(RESPONSE_CODES.SUCCESS, { message: 'Sample notification created' });
  } catch (error) {
    console.error('Sample notification error:', error);
    return res.error(RESPONSE_CODES.INTERNAL_ERROR);
  }
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/api/health', (req, res) => {
  return res.success(RESPONSE_CODES.SUCCESS, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'postgresql',
    whatsapp: whatsappService.isConnected
  });
});

// Error handler middleware
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 FuelFriendly Standardized API Server running on port ${PORT}`);
  console.log(`📊 Database: PostgreSQL`);
  console.log(`🔗 Health check (local): http://localhost:${PORT}/api/health`);
  console.log(`🔗 Health check (network): http://192.168.0.160:${PORT}/api/health`);
  
  // Initialize database and check tables
  console.log('\n' + '='.repeat(50));
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.log('⚠️ Server will continue but database operations may fail');
  }
  console.log('='.repeat(50) + '\n');
  
  // Initialize WhatsApp service
  console.log('🔄 Initializing WhatsApp service...');
  try {
    await whatsappService.initialize();
  } catch (error) {
    console.error('❌ WhatsApp initialization failed:', error);
  }
});