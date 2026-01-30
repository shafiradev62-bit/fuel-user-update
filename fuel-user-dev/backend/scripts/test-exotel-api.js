/**
 * Test script for Exotel API integration
 * 
 * This script tests the Exotel SMS and Email functionality
 * 
 * Usage:
 *   node test-exotel-api.js
 */

// Load environment variables
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Exotel API configuration
const EXOTEL_API_KEY = process.env.VITE_EXOTEL_API_KEY || process.env.EXOTEL_API_KEY;
const EXOTEL_API_TOKEN = process.env.VITE_EXOTEL_API_TOKEN || process.env.EXOTEL_API_TOKEN;
const EXOTEL_SUBDOMAIN = process.env.VITE_EXOTEL_SUBDOMAIN || process.env.EXOTEL_SUBDOMAIN;

// Check if credentials are configured
if (!EXOTEL_API_KEY || !EXOTEL_API_TOKEN || !EXOTEL_SUBDOMAIN) {
  console.error('❌ Exotel API credentials not configured');
  console.error('Please set the following environment variables:');
  console.error('  VITE_EXOTEL_API_KEY');
  console.error('  VITE_EXOTEL_API_TOKEN');
  console.error('  VITE_EXOTEL_SUBDOMAIN');
  process.exit(1);
}

// Test phone number and email (replace with valid test values)
const TEST_PHONE_NUMBER = process.env.TEST_PHONE_NUMBER || '+6281234567890';
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';

console.log('🧪 Testing Exotel API Integration');
console.log('================================');

async function testExotelSMS() {
  console.log('\n📧 Testing Exotel SMS...');
  
  // Check if subdomain is properly configured
  if (EXOTEL_SUBDOMAIN === 'your-subdomain') {
    console.error('❌ Exotel subdomain not configured. Please update VITE_EXOTEL_SUBDOMAIN in .env.local');
    return false;
  }
  
  try {
    const formData = new URLSearchParams();
    formData.append('From', 'FuelFriend');
    formData.append('To', TEST_PHONE_NUMBER);
    formData.append('Body', '🧪 Test SMS from FuelFriendly Exotel Integration');

    const response = await fetch(`https://${EXOTEL_SUBDOMAIN}.exotel.com/v1/Accounts/${EXOTEL_API_KEY}/Sms/send.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${EXOTEL_API_KEY}:${EXOTEL_API_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send SMS: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ SMS sent successfully');
    console.log('   SMS ID:', data.SmsMessage.SmsSid);
    console.log('   Status:', data.SmsMessage.Status);
    return true;
  } catch (error) {
    console.error('❌ SMS test failed:', error.message);
    return false;
  }
}

async function testExotelEmail() {
  console.log('\n📧 Testing Exotel Email...');
  
  // Check if subdomain is properly configured
  if (EXOTEL_SUBDOMAIN === 'your-subdomain') {
    console.error('❌ Exotel subdomain not configured. Please update VITE_EXOTEL_SUBDOMAIN in .env.local');
    return false;
  }
  
  try {
    const formData = new URLSearchParams();
    formData.append('From', `test@${EXOTEL_SUBDOMAIN}.com`);
    formData.append('To', TEST_EMAIL);
    formData.append('Subject', '🧪 Test Email from FuelFriendly Exotel Integration');
    formData.append('Body', `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>FuelFriendly Test</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4CAF50;">🧪 Test Email from FuelFriendly</h2>
        <p>This is a test email sent via Exotel API integration.</p>
        <p>If you received this email, the Exotel integration is working correctly!</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999;">
            Email sent by FuelFriendly Exotel Integration Test Script
        </p>
    </div>
</body>
</html>
    `.trim());

    const response = await fetch(`https://${EXOTEL_SUBDOMAIN}.exotel.com/v1/Accounts/${EXOTEL_API_KEY}/Email/send.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${EXOTEL_API_KEY}:${EXOTEL_API_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send email: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Email sent successfully');
    console.log('   Email ID:', data.Email.EmailId);
    console.log('   Status:', data.Email.Status);
    return true;
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🔑 Exotel API Credentials:');
  console.log('   API Key:', EXOTEL_API_KEY ? '✓ Configured' : '✗ Missing');
  console.log('   API Token:', EXOTEL_API_TOKEN ? '✓ Configured' : '✗ Missing');
  console.log('   Subdomain:', EXOTEL_SUBDOMAIN !== 'your-subdomain' ? '✓ Configured' : '⚠️ Using default value');
  
  if (!EXOTEL_API_KEY || !EXOTEL_API_TOKEN || !EXOTEL_SUBDOMAIN) {
    console.error('\n❌ Exotel API credentials are not properly configured');
    process.exit(1);
  }
  
  if (EXOTEL_SUBDOMAIN === 'your-subdomain') {
    console.error('\n⚠️  Warning: Exotel subdomain is still set to the default value.');
    console.error('   Please update VITE_EXOTEL_SUBDOMAIN in .env.local with your actual Exotel subdomain.');
  }
  
  console.log('\n📱 Test Configuration:');
  console.log('   Phone Number:', TEST_PHONE_NUMBER);
  console.log('   Email:', TEST_EMAIL);
  
  // Run tests
  const smsSuccess = await testExotelSMS();
  const emailSuccess = await testExotelEmail();
  
  console.log('\n🏁 Test Results:');
  console.log('   SMS Test:', smsSuccess ? '✅ PASSED' : '❌ FAILED');
  console.log('   Email Test:', emailSuccess ? '✅ PASSED' : '❌ FAILED');
  
  if (smsSuccess && emailSuccess) {
    console.log('\n🎉 All tests passed! Exotel integration is working correctly.');
    process.exit(0);
  } else {
    console.log('\n💥 Some tests failed. Please check the errors above.');
    console.log('\n💡 Tips:');
    console.log('   1. Make sure you have a valid Exotel account and subdomain');
    console.log('   2. Verify your API key and token are correct');
    console.log('   3. Check your internet connection');
    console.log('   4. Ensure the test phone number and email are valid');
    process.exit(1);
  }
}

// Run the tests
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(console.error);
}

export { testExotelSMS, testExotelEmail };