import { makeWASocket, DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import { promises as fs } from 'fs'
import path from 'path'
import qrcode from 'qrcode-terminal'

class WhatsAppService {
  constructor() {
    this.sock = null
    this.isConnected = false
    this.sessionPath = path.join(process.cwd(), 'server', 'wa-session')
    this.lockFile = path.join(process.cwd(), 'server', 'wa-lock')
    this.retryCount = 0
    this.maxRetries = 3
    this.isInitializing = false
  }

  async clearSession() {
    try {
      console.log('🧹 Clearing WhatsApp session...')
      await fs.rm(this.sessionPath, { recursive: true, force: true })
      console.log('✅ Session cleared successfully')
    } catch (error) {
      console.log('⚠️ Session already clear or error clearing:', error.message)
    }
    
    // Recreate session directory
    try {
      await fs.mkdir(this.sessionPath, { recursive: true })
    } catch (error) {
      console.log('⚠️ Error creating session directory:', error.message)
    }
  }

  async checkLock() {
    try {
      const lockExists = await fs.access(this.lockFile).then(() => true).catch(() => false)
      if (lockExists) {
        const lockContent = await fs.readFile(this.lockFile, 'utf8')
        const lockData = JSON.parse(lockContent)
        const lockAge = Date.now() - lockData.timestamp
        
        // If lock is older than 2 minutes, consider it stale
        if (lockAge > 120000) {
          await fs.unlink(this.lockFile)
          return false
        }
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  async createLock() {
    const lockData = {
      pid: process.pid,
      timestamp: Date.now()
    }
    await fs.writeFile(this.lockFile, JSON.stringify(lockData))
  }

  async removeLock() {
    try {
      await fs.unlink(this.lockFile)
    } catch (error) {
      // Lock file doesn't exist, ignore
    }
  }

  async initialize() {
    if (this.isInitializing) {
      console.log('⚠️ WhatsApp initialization already in progress')
      return
    }

    // Check if another instance is running
    const isLocked = await this.checkLock()
    if (isLocked) {
      console.log('⚠️ Another WhatsApp instance is running, skipping initialization')
      return
    }

    this.isInitializing = true
    
    try {
      await this.createLock()
      
      // Ensure session directory exists first
      await fs.mkdir(this.sessionPath, { recursive: true })
      
      const { state, saveCreds } = await useMultiFileAuthState(this.sessionPath)
      
      // Create a simple logger that Baileys expects
      const logger = {
        level: 'silent',
        child: () => logger,
        info: () => {},
        error: () => {},
        warn: () => {},
        debug: () => {},
        trace: () => {}
      }

      this.sock = makeWASocket({
        auth: state,
        logger: logger,
        browser: ['FuelFriendly', 'Chrome', '1.0.0'],
        syncFullHistory: false,
        generateHighQualityLinkPreview: false,
        markOnlineOnConnect: false,
        defaultQueryTimeoutMs: 60000,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 30000,
        retryRequestDelayMs: 1000,
        maxMsgRetryCount: 5
      })

      this.sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update
        
        if (qr) {
          console.log('\n📱 SCAN QR CODE INI DENGAN WHATSAPP:')
          console.log('='.repeat(60))
          qrcode.generate(qr, { small: true })
          console.log('='.repeat(60))
          console.log('📱 Langkah-langkah:')
          console.log('1. Buka WhatsApp di ponsel')
          console.log('2. Tap menu (3 titik) > Perangkat Tertaut')
          console.log('3. Tap "Tautkan Perangkat"')
          console.log('4. Scan QR code di atas')
          console.log('5. Tunggu pesan "WhatsApp connected successfully!"')
          console.log('='.repeat(60))
        }
        
        if (connection === 'connecting') {
          console.log('🔄 Connecting to WhatsApp...')
        }
        
        if (connection === 'close') {
          this.isConnected = false
          this.isInitializing = false
          this.updateStatus()
          await this.removeLock()
          
          const shouldReconnect = (lastDisconnect?.error instanceof Boom) 
            ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
            : true
          
          console.log('❌ WhatsApp connection closed:', lastDisconnect?.error?.message || 'Unknown error')
          
          if (shouldReconnect && this.retryCount < this.maxRetries) {
            this.retryCount++
            console.log(`🔄 Attempting to reconnect (${this.retryCount}/${this.maxRetries}) in 15 seconds...`)
            setTimeout(() => {
              this.initialize()
            }, 15000)
          } else {
            console.log('🚫 Max retries reached or logged out')
            this.retryCount = 0
          }
        } else if (connection === 'open') {
          console.log('✅ WhatsApp connected successfully!')
          console.log('🎉 Ready to send OTP messages!')
          this.isConnected = true
          this.isInitializing = false
          this.retryCount = 0
          this.updateStatus()
        }
      })

      this.sock.ev.on('creds.update', saveCreds)
      
    } catch (error) {
      console.error('❌ WhatsApp initialization error:', error)
      this.isInitializing = false
      await this.removeLock()
      
      // Retry after 15 seconds
      setTimeout(() => {
        console.log('🔄 Retrying WhatsApp initialization...')
        this.initialize()
      }, 15000)
    }
  }

  detectLanguage(phoneNumber) {
    const countryCode = phoneNumber.substring(0, 2)
    
    // Country code mapping
    const languageMap = {
      '62': 'id', // Indonesia
      '60': 'id', // Malaysia (use Indonesian)
      '65': 'en', // Singapore
      '1': 'en',  // USA/Canada
      '44': 'en', // UK
      '61': 'en', // Australia
      '91': 'en', // India
      '86': 'en', // China (use English)
      '81': 'en', // Japan (use English)
      '82': 'en', // South Korea (use English)
    }
    
    return languageMap[countryCode] || 'en' // Default to English
  }

  getOTPMessage(otp, language) {
    const messages = {
      'id': {
        title: '🔐 *FuelFriendly OTP*',
        body: `Kode verifikasi Anda: *${otp}*`,
        footer: 'Kode berlaku selama 5 menit.\nJangan bagikan kode ini kepada siapapun.'
      },
      'en': {
        title: '🔐 *FuelFriendly OTP*',
        body: `Your verification code: *${otp}*`,
        footer: 'Code expires in 5 minutes.\nDo not share this code with anyone.'
      }
    }
    
    const msg = messages[language] || messages['en']
    return `${msg.title}\n\n${msg.body}\n\n${msg.footer}`
  }

  async sendOTP(phoneNumber, otp) {
    if (!this.isConnected || !this.sock) {
      throw new Error('WhatsApp not connected')
    }

    try {
      // Format phone number (remove + and ensure it's valid)
      const formattedNumber = phoneNumber.replace(/[^\d]/g, '')
      const jid = `${formattedNumber}@s.whatsapp.net`
      
      // Detect language and get appropriate message
      const language = this.detectLanguage(formattedNumber)
      const message = this.getOTPMessage(otp, language)
      
      await this.sock.sendMessage(jid, { text: message })
      
      console.log(`✅ OTP sent to ${phoneNumber} in ${language}`)
      return { success: true, message: 'OTP sent successfully' }
      
    } catch (error) {
      console.error('❌ Failed to send OTP:', error)
      throw new Error('Failed to send WhatsApp OTP')
    }
  }

  // Write connection status to file for other processes
  updateStatus() {
    const statusFile = path.join(process.cwd(), 'server', 'whatsapp-status.json')
    const status = {
      isConnected: this.isConnected,
      lastUpdate: Date.now()
    }
    try {
      fs.writeFile(statusFile, JSON.stringify(status))
    } catch (error) {
      console.error('Failed to write status:', error.message)
    }
  }

  async disconnect() {
    if (this.sock) {
      await this.sock.logout()
      this.isConnected = false
    }
    await this.removeLock()
  }
}

export default new WhatsAppService()