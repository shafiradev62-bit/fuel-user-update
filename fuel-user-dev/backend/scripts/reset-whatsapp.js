// Script untuk reset WhatsApp session jika ada masalah "tidak dapat menautkan perangkat"
import { promises as fs } from 'fs'
import path from 'path'

const sessionPath = path.join(process.cwd(), 'server', 'wa-session')

async function resetWhatsAppSession() {
  console.log('🔄 Resetting WhatsApp session...')
  
  try {
    // Hapus folder session
    await fs.rm(sessionPath, { recursive: true, force: true })
    console.log('✅ Session folder deleted successfully')
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('ℹ️  Session folder already clean')
    } else {
      console.log('⚠️  Error deleting session:', error.message)
    }
  }
  
  console.log('\n📋 Next steps:')
  console.log('1. Run: npm run server')
  console.log('2. Wait for QR code to appear')
  console.log('3. Scan QR code QUICKLY (within 20 seconds)')
  console.log('4. Wait for "WhatsApp connected successfully!" message')
  
  console.log('\n💡 Tips untuk sukses scan QR:')
  console.log('- Pastikan WhatsApp Web tidak terbuka di browser lain')
  console.log('- Logout semua perangkat tertaut di WhatsApp > Menu > Perangkat Tertaut')
  console.log('- Scan QR segera setelah muncul (jangan tunggu lama)')
  console.log('- Pastikan koneksi internet stabil')
}

// Jalankan reset
resetWhatsAppSession().catch(console.error)