export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getExpiry(minutes = 5) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

// Simple in-memory storage for OTPs (in production, use a database)
const otpStorage = new Map();

export function saveOTP(email, otp) {
  const expiresAt = getExpiry(5); // 5 minutes expiry
  otpStorage.set(email, { otp, expiresAt });
  
  // Clean up expired OTPs periodically
  setTimeout(() => {
    otpStorage.delete(email);
  }, 5 * 60 * 1000); // 5 minutes
  
  return { otp, expiresAt };
}

export function getOTP(email) {
  return otpStorage.get(email);
}

export function deleteOTP(email) {
  return otpStorage.delete(email);
}

export function verifyOTP(email, inputOtp) {
  console.log('🔍 Verifying OTP for:', email);
  console.log('🔍 Input OTP:', inputOtp);
  console.log('🔍 Stored OTPs:', Array.from(otpStorage.keys()));
  
  const stored = getOTP(email);
  
  if (!stored) {
    console.log('❌ OTP not found for:', email);
    return { isValid: false, message: 'OTP not found' };
  }
  
  console.log('✅ Found stored OTP:', stored.otp);
  
  // Check if OTP has expired
  if (new Date() > stored.expiresAt) {
    deleteOTP(email); // Clean up expired OTP
    return { isValid: false, message: 'OTP has expired' };
  }
  
  // Check if OTP matches
  if (stored.otp !== inputOtp) {
    return { isValid: false, message: 'Invalid OTP' };
  }
  
  // OTP is valid, remove it from storage
  deleteOTP(email);
  return { isValid: true, message: 'OTP verified successfully' };
}