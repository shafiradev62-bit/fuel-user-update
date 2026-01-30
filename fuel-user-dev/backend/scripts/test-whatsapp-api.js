// Test script for WhatsApp OTP API
const API_BASE = 'https://apidecor.kelolahrd.life';

async function testWhatsAppStatus() {
  try {
    console.log('🔍 Testing WhatsApp connection status...');
    const response = await fetch(`${API_BASE}/api/whatsapp/status`);
    const data = await response.json();
    console.log('✅ Status:', data);
    return data.connected;
  } catch (error) {
    console.error('❌ Status check failed:', error.message);
    console.log('💡 Make sure server is running: npm run server');
    return false;
  }
}

async function resetWhatsAppSession() {
  try {
    console.log('🔄 Resetting WhatsApp session...');
    const response = await fetch(`${API_BASE}/api/whatsapp/reset`, {
      method: 'POST'
    });
    const data = await response.json();
    console.log('🔄 Reset result:', data);
    return data.success;
  } catch (error) {
    console.error('❌ Reset failed:', error.message);
    return false;
  }
}

async function reconnectWhatsApp() {
  try {
    console.log('🔄 Reconnecting WhatsApp...');
    const response = await fetch(`${API_BASE}/api/whatsapp/reconnect`, {
      method: 'POST'
    });
    const data = await response.json();
    console.log('🔄 Reconnect result:', data);
    return data.success;
  } catch (error) {
    console.error('❌ Reconnect failed:', error.message);
    return false;
  }
}

async function testSendOTP(phoneNumber) {
  try {
    console.log(`📱 Testing send OTP to ${phoneNumber}...`);
    const response = await fetch(`${API_BASE}/api/otp/whatsapp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber })
    });
    
    const data = await response.json();
    console.log('📤 Send OTP result:', data);
    return data.success;
  } catch (error) {
    console.error('❌ Send OTP failed:', error.message);
    return false;
  }
}

async function testVerifyOTP(phoneNumber, otp) {
  try {
    console.log(`🔐 Testing verify OTP ${otp} for ${phoneNumber}...`);
    const response = await fetch(`${API_BASE}/api/otp/whatsapp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, otp })
    });
    
    const data = await response.json();
    console.log('✅ Verify OTP result:', data);
    return data.success;
  } catch (error) {
    console.error('❌ Verify OTP failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting WhatsApp OTP API Tests\n');
  
  // Test 1: Check WhatsApp connection status
  const isConnected = await testWhatsAppStatus();
  
  if (!isConnected) {
    console.log('\n⚠️  WhatsApp not connected. Troubleshooting options:');
    console.log('1. Make sure server is running: npm run server');
    console.log('2. If "tidak dapat menautkan perangkat", try: node reset-whatsapp.js');
    console.log('3. Or use API reset: resetWhatsAppSession()');
    console.log('4. Scan QR code with WhatsApp');
    console.log('5. Wait for "WhatsApp connected successfully!" message');
    
    console.log('\n🔧 Available troubleshooting functions:');
    console.log('- resetWhatsAppSession() - Reset session if linking fails');
    console.log('- reconnectWhatsApp() - Force reconnect');
    console.log('- testWhatsAppStatus() - Check connection status');
    return;
  }
  
  console.log('\n✅ WhatsApp is connected! Ready to test OTP...\n');
  
  // Test 2: Send OTP (replace with your test number)
  const testPhone = '+628123456789'; // Replace with your WhatsApp number
  console.log(`📝 To test OTP, replace '${testPhone}' with your actual WhatsApp number in test-whatsapp-api.js\n`);
  
  // Uncomment these lines and replace with your number to test:
  // const sendSuccess = await testSendOTP(testPhone);
  // if (sendSuccess) {
  //   console.log('\n📱 Check your WhatsApp for OTP message!');
  //   console.log('💡 Then run: testVerifyOTP("' + testPhone + '", "123456")');
  // }
}

// Troubleshooting functions
async function troubleshoot() {
  console.log('🔧 WhatsApp Troubleshooting Menu\n');
  
  console.log('Available commands:');
  console.log('1. testWhatsAppStatus() - Check connection');
  console.log('2. resetWhatsAppSession() - Reset if "tidak dapat menautkan perangkat"');
  console.log('3. reconnectWhatsApp() - Force reconnect');
  console.log('4. Or run: node reset-whatsapp.js\n');
  
  // Auto check status
  await testWhatsAppStatus();
}

// Run tests
runTests().catch(console.error);

// Export functions for manual testing
if (typeof module !== 'undefined') {
  module.exports = { 
    testWhatsAppStatus, 
    testSendOTP, 
    testVerifyOTP, 
    resetWhatsAppSession, 
    reconnectWhatsApp, 
    troubleshoot 
  };
}