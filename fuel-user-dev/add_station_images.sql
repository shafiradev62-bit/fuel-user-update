-- Add image column to fuel_stations table and populate with brand logos
ALTER TABLE fuel_stations ADD COLUMN IF NOT EXISTS image TEXT;

-- Update stations with appropriate brand logos
UPDATE fuel_stations SET image = '/shell-logo.png' WHERE name LIKE '%Shell%';
UPDATE fuel_stations SET image = '/bp-logo.png' WHERE name LIKE '%BP%';
UPDATE fuel_stations SET image = '/exxon-logo.png' WHERE name LIKE '%Exxon%';
UPDATE fuel_stations SET image = '/chevron-logo.png' WHERE name LIKE '%Chevron%';
UPDATE fuel_stations SET image = '/mobil-logo.png' WHERE name LIKE '%Mobil%';
UPDATE fuel_stations SET image = '/esso-logo.png' WHERE name LIKE '%Esso%';
UPDATE fuel_stations SET image = '/texaco-logo.png' WHERE name LIKE '%Texaco%';
UPDATE fuel_stations SET image = '/tesco-logo.png' WHERE name LIKE '%Tesco%';
UPDATE fuel_stations SET image = '/pertamina-logo.png' WHERE name LIKE '%Pertamina%';
UPDATE fuel_stations SET image = '/total-logo.png' WHERE name LIKE '%Total%';
UPDATE fuel_stations SET image = '/vivo-logo.png' WHERE name LIKE '%Vivo%';

-- Set default logo for any stations without specific brand logos
UPDATE fuel_stations SET image = '/brand1.png' WHERE image IS NULL;

-- Verify the updates
SELECT name, image FROM fuel_stations ORDER BY name;