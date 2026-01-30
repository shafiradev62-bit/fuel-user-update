-- Create station_fuel_friends mapping table for dynamic assignment
CREATE TABLE IF NOT EXISTS station_fuel_friends (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id VARCHAR NOT NULL REFERENCES fuel_stations(id) ON DELETE CASCADE,
    fuel_friend_id VARCHAR NOT NULL REFERENCES fuel_friends(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(station_id, fuel_friend_id)
);

-- Insert mappings for Jakarta stations (using default fuel friend for now)
INSERT INTO station_fuel_friends (station_id, fuel_friend_id, is_active) VALUES
-- Indonesian stations with available fuel friends
((SELECT id FROM fuel_stations WHERE name LIKE '%Shell Kemang%' LIMIT 1), 'ff1', true),  -- Default Driver
((SELECT id FROM fuel_stations WHERE name LIKE '%Pertamina Blok%' LIMIT 1), 'ff1', true),  -- Default Driver
((SELECT id FROM fuel_stations WHERE name LIKE '%Total Senayan%' LIMIT 1), 'ff1', true),  -- Default Driver
((SELECT id FROM fuel_stations WHERE name LIKE '%BP Sudirman%' LIMIT 1), 'ff1', true),  -- Default Driver
((SELECT id FROM fuel_stations WHERE name LIKE '%Vivo Pondok%' LIMIT 1), 'ff1', true),  -- Default Driver
((SELECT id FROM fuel_stations WHERE name LIKE '%Shell Gatot%' LIMIT 1), 'ff1', true)   -- Default Driver
ON CONFLICT (station_id, fuel_friend_id) DO NOTHING;

-- Insert mappings for US stations
INSERT INTO station_fuel_friends (station_id, fuel_friend_id, is_active) VALUES
-- US stations with US fuel friends (using actual IDs)
((SELECT id FROM fuel_stations WHERE name LIKE '%Shell Times Square%' LIMIT 1), '2dce6596-e554-4305-8ea0-693e802d2c91', true),   -- Michael Johnson (New York)
((SELECT id FROM fuel_stations WHERE name LIKE '%Shell Times Square%' LIMIT 1), 'd0642dc0-3d3f-4879-8020-ba6642c1ca6e', true),   -- Sarah Williams (Los Angeles)
((SELECT id FROM fuel_stations WHERE name LIKE '%BP Manhattan%' LIMIT 1), '2dce6596-e554-4305-8ea0-693e802d2c91', true),   -- Michael Johnson (New York)
((SELECT id FROM fuel_stations WHERE name LIKE '%Chevron Hollywood%' LIMIT 1), 'd0642dc0-3d3f-4879-8020-ba6642c1ca6e', true),   -- Sarah Williams (Los Angeles)
((SELECT id FROM fuel_stations WHERE name LIKE '%Shell Beverly Hills%' LIMIT 1), 'd0642dc0-3d3f-4879-8020-ba6642c1ca6e', true),   -- Sarah Williams (Los Angeles)
((SELECT id FROM fuel_stations WHERE name LIKE '%BP Chicago%' LIMIT 1), '2dce6596-e554-4305-8ea0-693e802d2c91', true),   -- Michael Johnson (New York)
((SELECT id FROM fuel_stations WHERE name LIKE '%Shell South Beach%' LIMIT 1), 'd0642dc0-3d3f-4879-8020-ba6642c1ca6e', true)    -- Sarah Williams (Los Angeles)
ON CONFLICT (station_id, fuel_friend_id) DO NOTHING;

-- Insert mappings for UK stations  
INSERT INTO station_fuel_friends (station_id, fuel_friend_id, is_active) VALUES
-- UK stations with UK fuel friends (using actual IDs)
((SELECT id FROM fuel_stations WHERE name LIKE '%Shell Oxford%' LIMIT 1), 'c0bc07c1-6956-4273-bb27-4a5d6bd46b38', true),   -- James Thompson (London)
((SELECT id FROM fuel_stations WHERE name LIKE '%BP Piccadilly%' LIMIT 1), 'c0bc07c1-6956-4273-bb27-4a5d6bd46b38', true),   -- James Thompson (London)
((SELECT id FROM fuel_stations WHERE name LIKE '%Esso Tower%' LIMIT 1), 'c0bc07c1-6956-4273-bb27-4a5d6bd46b38', true),   -- James Thompson (London)
((SELECT id FROM fuel_stations WHERE name LIKE '%Texaco Canary%' LIMIT 1), 'c0bc07c1-6956-4273-bb27-4a5d6bd46b38', true),   -- James Thompson (London)
((SELECT id FROM fuel_stations WHERE name LIKE '%Shell Manchester%' LIMIT 1), '6a224e87-f68a-4536-8560-624fdf07c67c', true),   -- Emily Davis (Manchester)
((SELECT id FROM fuel_stations WHERE name LIKE '%Tesco%Manchester%' LIMIT 1), '6a224e87-f68a-4536-8560-624fdf07c67c', true),   -- Emily Davis (Manchester)
((SELECT id FROM fuel_stations WHERE name LIKE '%Esso Birmingham%' LIMIT 1), '6a224e87-f68a-4536-8560-624fdf07c67c', true),   -- Emily Davis (Manchester)
((SELECT id FROM fuel_stations WHERE name LIKE '%BP Royal%' LIMIT 1), 'c0bc07c1-6956-4273-bb27-4a5d6bd46b38', true),   -- James Thompson (London)
((SELECT id FROM fuel_stations WHERE name LIKE '%Texaco Albert%' LIMIT 1), '6a224e87-f68a-4536-8560-624fdf07c67c', true)   -- Emily Davis (Manchester)
ON CONFLICT (station_id, fuel_friend_id) DO NOTHING;