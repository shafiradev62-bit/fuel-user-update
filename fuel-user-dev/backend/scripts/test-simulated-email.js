/**
 * Test script for simulated email integration
 * 
 * This script tests the simulated email functionality for development
 * 
 * Usage:
 *   NODE_ENV=development SIMULATE_EMAIL_SENDING=true node test-simulated-email.js
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

// Test email (replace with valid test email)
const TEST_EMAIL = process.env.TEST_EMAIL || 'fuelfriendly@gmail.com';

console.log('🧪 Testing Simulated Email Integration');
console.log('=====================================');

async function testSimulatedEmail() {
  console.log('\n📧 Testing Simulated Email...');
  
  // Check if simulation mode is enabled
  const isSimulationEnabled = process.env.NODE_ENV === 'development' && process.env.SIMULATE_EMAIL_SENDING === 'true';
  console.log('   Simulation Enabled:', isSimulationEnabled);
  
  if (!isSimulationEnabled) {
    console.log('   To enable simulation, set NODE_ENV=development and SIMULATE_EMAIL_SENDING=true');
    return false;
  }
  
  try {
    const otp = generateOTP();
    console.log(`Generated OTP: ${otp}`);
    
    const result = await sendEmailOTP(TEST_EMAIL, otp);
    
    if (result.success) {
      console.log('✅ Simulated email "sent" successfully');
      console.log('   Message ID:', result.messageId);
      console.log('   OTP (for testing):', result.otp);
      console.log('   Simulated:', result.simulated ? 'Yes' : 'No');
      return true;
    } else {
      console.error('❌ Simulated email test failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Simulated email test failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🔧 Environment Configuration:');
  console.log('   NODE_ENV:', process.env.NODE_ENV || 'Not set (defaults to development)');
  console.log('   SIMULATE_EMAIL_SENDING:', process.env.SIMULATE_EMAIL_SENDING || 'Not set (defaults to false)');
  
  console.log('\n📱 Test Configuration:');
  console.log('   Email:', TEST_EMAIL);
  
  // Run test
  const emailSuccess = await testSimulatedEmail();
  
  console.log('\n🏁 Test Results:');
  console.log('   Simulated Email Test:', emailSuccess ? '✅ PASSED' : '❌ FAILED');
  
  if (emailSuccess) {
    console.log('\n🎉 Test passed! Simulated email integration is working correctly.');
    console.log('   In a real production environment, this would send actual emails.');
    console.log('   For now, you can test with any email address and see the OTP in the response.');
    process.exit(0);
  } else {
    console.log('\n💥 Test failed. Please check the errors above.');
    process.exit(1);
  }
}

// Run the test
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(console.error);
}

export { testSimulatedEmail };