/**
 * Test script for Resend Email integration
 * 
 * This script tests the Resend email functionality
 * 
 * Usage:
 *   node test-resend-email.js
 */

// Load environment variables
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateOTP } from './server/utils/otp.js';
import { sendEmailOTP } from './server/services/email.service.js';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Resend API key
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Test email (replace with valid test email)
const TEST_EMAIL = process.env.TEST_EMAIL || 'shafiradev62@gmail.com';

console.log('🧪 Testing Resend Email Integration');
console.log('==================================');

async function testResendEmail() {
  console.log('\n📧 Testing Resend Email...');
  
  // Check if API key is configured
  if (!RESEND_API_KEY || RESEND_API_KEY === 'your_resend_api_key_here') {
    console.error('❌ Resend API key not configured. Please update RESEND_API_KEY in .env.local');
    return false;
  }
  
  try {
    const otp = generateOTP();
    console.log(`Generated OTP: ${otp}`);
    
    const result = await sendEmailOTP(TEST_EMAIL, otp);
    
    if (result.success) {
      console.log('✅ Email sent successfully');
      console.log('   Message ID:', result.messageId);
      return true;
    } else {
      console.error('❌ Email test failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🔑 Resend API Key:');
  console.log('   API Key:', RESEND_API_KEY && RESEND_API_KEY !== 'your_resend_api_key_here' ? '✓ Configured' : '⚠️ Using default value');
  
  if (!RESEND_API_KEY || RESEND_API_KEY === 'your_resend_api_key_here') {
    console.error('\n⚠️  Warning: Resend API key is still set to the default value.');
    console.error('   Please update RESEND_API_KEY in .env.local with your actual Resend API key.');
  }
  
  console.log('\n📱 Test Configuration:');
  console.log('   Email:', TEST_EMAIL);
  
  // Run test
  const emailSuccess = await testResendEmail();
  
  console.log('\n🏁 Test Results:');
  console.log('   Email Test:', emailSuccess ? '✅ PASSED' : '❌ FAILED');
  
  if (emailSuccess) {
    console.log('\n🎉 Test passed! Resend email integration is working correctly.');
    process.exit(0);
  } else {
    console.log('\n💥 Test failed. Please check the errors above.');
    console.log('\n💡 Tips:');
    console.log('   1. Make sure you have a valid Resend account and API key');
    console.log('   2. Verify your API key is correct');
    console.log('   3. Check your internet connection');
    console.log('   4. Ensure the test email address is valid');
    process.exit(1);
  }
}

// Run the test
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(console.error);
}

export { testResendEmail };