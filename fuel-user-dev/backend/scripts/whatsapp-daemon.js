import whatsappService from './server/whatsapp-service.js';
import { promises as fs } from 'fs';
import path from 'path';

console.log('🚀 Starting WhatsApp service for FuelFriendly...');

// Initialize WhatsApp
await whatsappService.initialize();

// Monitor for OTP requests
const processOTPRequests = async () => {
  const requestFile = path.join(process.cwd(), 'server', 'otp-request.json');
  
  try {
    const data = await fs.readFile(requestFile, 'utf8');
    const request = JSON.parse(data);
    
    if (!request.processed && whatsappService.isConnected) {
      try {
        await whatsappService.sendOTP(request.phoneNumber, request.otp);
        request.processed = true;
        request.success = true;
      } catch (error) {
        request.processed = true;
        request.error = error.message;
      }
      
      await fs.writeFile(requestFile, JSON.stringify(request));
    }
  } catch (error) {
    // File doesn't exist or other error, ignore
  }
};

// Check for requests every second
setInterval(processOTPRequests, 1000);

// Keep the service alive and monitor connection
const keepAlive = setInterval(async () => {
  if (!whatsappService.isConnected) {
    console.log('⚠️ WhatsApp disconnected, attempting to reconnect...');
    try {
      await whatsappService.initialize();
    } catch (error) {
      console.error('❌ Failed to reconnect:', error.message);
    }
  } else {
    console.log('✅ WhatsApp service is running');
  }
}, 60000); // Check every minute

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down WhatsApp service...');
  clearInterval(keepAlive);
  await whatsappService.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  clearInterval(keepAlive);
  await whatsappService.disconnect();
  process.exit(0);
});

// Keep process alive
process.stdin.resume();