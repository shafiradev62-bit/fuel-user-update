#!/usr/bin/env node

import { initializeDatabase, checkDatabaseConnection, checkTablesExist } from './server/database-checker.js';

async function main() {
  console.log('🔍 FuelFriendly Database Checker');
  console.log('='.repeat(40));
  
  try {
    await initializeDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    process.exit(1);
  }
}

main();