import { db } from './server/db.js';

async function checkSchema() {
  try {
    // Get actual table schema from database
    const result = await db.execute("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'fuel_stations' ORDER BY ordinal_position");
    
    console.log('🏗️ Actual fuel_stations schema:');
    result.rows.forEach(row => {
      console.log('  -', row.column_name, '(' + row.data_type + ')', row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkSchema();