import whatsappService from './server/whatsapp-service.js';

console.log('🚀 Setting up WhatsApp for FuelFriendly...');
console.log('');

// Clear existing session and start fresh
await whatsappService.clearSession();
await whatsappService.initialize();

// Keep the process running to maintain connection
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down WhatsApp service...');
  await whatsappService.disconnect();
  process.exit(0);
});

// Keep alive
setInterval(() => {
  if (whatsappService.isConnected) {
    console.log('✅ WhatsApp is connected and ready');
  } else {
    console.log('⏳ Waiting for WhatsApp connection...');
  }
}, 30000); // Check every 30 seconds