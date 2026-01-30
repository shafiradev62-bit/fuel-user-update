#!/usr/bin/env node

import { promises as fs } from 'fs'
import path from 'path'

const sessionPath = path.join(process.cwd(), 'server', 'wa-session')
const lockFile = path.join(process.cwd(), 'server', 'wa-lock')

async function resetWhatsApp() {
  try {
    console.log('🧹 Resetting WhatsApp service...')
    
    // Remove lock file
    try {
      await fs.unlink(lockFile)
      console.log('✅ Lock file removed')
    } catch (error) {
      console.log('ℹ️ No lock file to remove')
    }
    
    // Clear session
    try {
      await fs.rm(sessionPath, { recursive: true, force: true })
      console.log('✅ Session cleared')
    } catch (error) {
      console.log('ℹ️ No session to clear')
    }
    
    console.log('🎉 WhatsApp service reset complete!')
    console.log('💡 You can now restart your server')
    
  } catch (error) {
    console.error('❌ Reset failed:', error)
  }
}

resetWhatsApp()