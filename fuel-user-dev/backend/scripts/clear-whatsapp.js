import { promises as fs } from 'fs';
import path from 'path';

const sessionPath = path.join(process.cwd(), 'server', 'wa-session');

console.log('🧹 Clearing WhatsApp session...');

try {
  await fs.rm(sessionPath, { recursive: true, force: true });
  console.log('✅ WhatsApp session cleared successfully');
  console.log('📱 Now run: node setup-whatsapp.js');
} catch (error) {
  console.log('⚠️ Session already clear or error:', error.message);
}