-- Drop existing fcm_tokens table if exists
DROP TABLE IF EXISTS fcm_tokens;

-- Create fcm_tokens table with correct data types
CREATE TABLE fcm_tokens (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id VARCHAR NOT NULL REFERENCES customers(id),
  token TEXT NOT NULL,
  device_type TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);