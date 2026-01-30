/**
 * Test script for SendGrid Email integration
 * 
 * This script tests the SendGrid email functionality
 * 
 * Usage:
 *   node test-sendgrid-email.js
 */

// Load environment variables
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateOTP } from './server/utils/otp.js';
import { sendEmailOTP } from './server/services/sendgrid.service.js';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// SendGrid API key
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

// Test email (replace with valid test email)
const TEST_EMAIL = process.env.TEST_EMAIL || 'fuelfriendly@gmail.com';

console.log('🧪 Testing SendGrid Email Integration');
console.log('===================================');

async function testSendGridEmail() {
  console.log('\n📧 Testing SendGrid Email...');
  
  // Check if API key is configured
  if (!SENDGRID_API_KEY) {
    console.error('❌ SendGrid API key not configured. Please update SENDGRID_API_KEY in .env.local');
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
  console.log('🔑 SendGrid API Key:');
  console.log('   API Key:', SENDGRID_API_KEY ? '✓ Configured' : '⚠️ Not configured');
  
  if (!SENDGRID_API_KEY) {
    console.error('\n⚠️  SendGrid API key is not configured.');
    console.error('   Please update SENDGRID_API_KEY in .env.local with your actual SendGrid API key.');
  }
  
  console.log('\n📱 Test Configuration:');
  console.log('   Email:', TEST_EMAIL);
  
  // Run test
  const emailSuccess = await testSendGridEmail();
  
  console.log('\n🏁 Test Results:');
  console.log('   Email Test:', emailSuccess ? '✅ PASSED' : '❌ FAILED');
  
  if (emailSuccess) {
    console.log('\n🎉 Test passed! SendGrid email integration is working correctly.');
    process.exit(0);
  } else {
    console.log('\n💥 Test failed. Please check the errors above.');
    console.log('\n💡 Tips:');
    console.log('   1. Make sure you have a valid SendGrid account and API key');
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

export { testSendGridEmail };