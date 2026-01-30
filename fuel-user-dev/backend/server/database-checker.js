import { db } from './db.js';
import { sql } from 'drizzle-orm';

export const checkDatabaseConnection = async () => {
  try {
    console.log('🔍 Checking database connection...');
    
    // Test basic connection
    await db.execute(sql`SELECT 1`);
    console.log('✅ Database connection successful');
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

export const checkTablesExist = async () => {
  try {
    console.log('🔍 Checking database tables...');
    
    // Check if main tables exist
    const tables = [
      'customers',
      'vehicles', 
      'fuel_stations',
      'products',
      'fuel_friends',
      'orders',
      'fcm_tokens',
      'notifications'
    ];
    
    const results = [];
    
    for (const table of tables) {
      try {
        const result = await db.execute(sql`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = ${table}
          );
        `);
        
        const exists = result.rows[0]?.exists || false;
        results.push({ table, exists });
        
        if (exists) {
          console.log(`✅ Table '${table}' exists`);
        } else {
          console.log(`❌ Table '${table}' missing`);
        }
      } catch (error) {
        console.log(`❌ Error checking table '${table}':`, error.message);
        results.push({ table, exists: false, error: error.message });
      }
    }
    
    const allTablesExist = results.every(r => r.exists);
    
    if (allTablesExist) {
      console.log('✅ All required tables exist');
    } else {
      console.log('⚠️ Some tables are missing. Run migrations:');
      console.log('   npm run db:generate');
      console.log('   npm run db:migrate');
    }
    
    return { allTablesExist, results };
    
  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
    return { allTablesExist: false, error: error.message };
  }
};

export const initializeDatabase = async () => {
  console.log('🚀 Initializing database...');
  
  // Check connection first
  const connectionOk = await checkDatabaseConnection();
  if (!connectionOk) {
    throw new Error('Database connection failed');
  }
  
  // Check tables
  const { allTablesExist } = await checkTablesExist();
  
  if (!allTablesExist) {
    console.log('⚠️ Database tables missing or incomplete');
    console.log('📋 To fix this, run:');
    console.log('   cd backend');
    console.log('   npm run db:generate');
    console.log('   npm run db:migrate');
    console.log('   npm run seed');
  } else {
    console.log('✅ Database is ready');
  }
  
  return allTablesExist;
};