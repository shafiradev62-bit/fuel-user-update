import { z } from 'zod';

// Authentication Schemas
export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const registerStep1Schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email format'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const registerCompleteSchema = z.object({
  step1: registerStep1Schema,
  step2: z.object({
    brand: z.string().min(1, 'Vehicle brand is required'),
    color: z.string().min(1, 'Vehicle color is required'),
    licenseNumber: z.string().min(1, 'License number is required'),
    fuelType: z.enum(['Petrol', 'Diesel', 'Electric'])
  })
});

export const googleAuthSchema = z.object({
  uid: z.string().min(1, 'Google UID is required'),
  email: z.string().email('Invalid email format'),
  displayName: z.string().min(1, 'Display name is required')
});

// OTP Schemas
export const emailOTPSendSchema = z.object({
  email: z.string().email('Invalid email format')
});

export const emailOTPVerifySchema = z.object({
  email: z.string().email('Invalid email format'),
  otp: z.string().length(6, 'OTP must be 6 digits')
});

export const whatsappOTPSendSchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits')
});

export const whatsappOTPVerifySchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  otp: z.string().length(6, 'OTP must be 6 digits')
});

// Password Reset Schemas
export const forgotPasswordSchema = z.object({
  emailOrPhone: z.string().min(1, 'Email or phone is required')
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

// Order Schemas
export const createOrderSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
  deliveryPhone: z.string().min(10, 'Delivery phone is required'),
  fuelType: z.string().min(1, 'Fuel type is required'),
  fuelQuantity: z.string().min(1, 'Fuel quantity is required'),
  totalAmount: z.string().min(1, 'Total amount is required'),
  deliveryFee: z.string().min(1, 'Delivery fee is required'),
  stationId: z.string().nullable().optional(),
  fuelFriendId: z.string().nullable().optional(),
  vehicleId: z.string().nullable().optional(),
  groceriesCost: z.string().optional(),
  orderType: z.string().optional(),
  scheduledDate: z.string().nullable().optional(),
  scheduledTime: z.string().nullable().optional(),
  estimatedDeliveryTime: z.string().nullable().optional(),
  paymentMethod: z.string().optional(),
  fuelCost: z.string().optional(),
  cartItems: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.union([z.number(), z.string()]).transform(val => typeof val === 'string' ? parseFloat(val) : val),
    quantity: z.union([z.number(), z.string()]).transform(val => typeof val === 'string' ? parseInt(val) : val)
  })).optional()
});

// Payment Schemas
export const createPaymentIntentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('usd'),
  orderId: z.string().min(1, 'Order ID is required')
});

// Account Management Schemas
export const deleteAccountSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  reason: z.string().optional()
});

// Validation middleware
export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.validatedData = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.error('RC_422', error.errors[0].message, 'Validation failed');
      }
      next(error);
    }
  };
};