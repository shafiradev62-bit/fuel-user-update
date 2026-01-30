-- Insert grocery products for fuel stations
-- This script adds realistic grocery items to fuel stations

-- Get station IDs first (we'll use the first few stations)
-- Products for Indonesian stations
INSERT INTO products (station_id, name, category, price, image, in_stock) VALUES
-- Station 1 products
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 0), 'Indomie Goreng', 'Food', 2.50, '/grocery-1.png', true),
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 0), 'Aqua 600ml', 'Beverages', 1.20, '/grocery-2.png', true),
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 0), 'Teh Botol Sosro', 'Beverages', 1.80, '/grocery-3.png', true),
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 0), 'Chitato Chips', 'Snacks', 3.20, '/grocery-4.png', true),
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 0), 'Kopi Kapal Api', 'Beverages', 2.80, '/grocery-5.png', true),

-- Station 2 products  
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 1), 'Pocari Sweat', 'Beverages', 2.20, '/grocery-6.png', true),
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 1), 'Oreo Cookies', 'Snacks', 4.50, '/grocery-7.png', true),
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 1), 'Mie Sedaap', 'Food', 2.30, '/grocery-8.png', true),
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 1), 'Coca Cola 330ml', 'Beverages', 1.50, '/grocery-9.png', true),
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 1), 'Pringles Original', 'Snacks', 5.80, '/grocery-10.png', true),

-- Station 3 products
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 2), 'Sprite 330ml', 'Beverages', 1.50, '/grocery-11.png', true),
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 2), 'Lays Chips', 'Snacks', 3.80, '/grocery-12.png', true),
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 2), 'Energen Cereal', 'Food', 3.50, '/grocery-13.png', true),
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 2), 'Fanta Orange', 'Beverages', 1.50, '/grocery-14.png', true),
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 2), 'Richeese Nabati', 'Snacks', 2.80, '/grocery-15.png', true),

-- US Station products (higher prices in USD)
((SELECT id FROM fuel_stations WHERE name LIKE '%Shell%' OR name LIKE '%Chevron%' OR name LIKE '%Exxon%' LIMIT 1), 'Red Bull Energy', 'Beverages', 3.99, '/grocery-us-1.png', true),
((SELECT id FROM fuel_stations WHERE name LIKE '%Shell%' OR name LIKE '%Chevron%' OR name LIKE '%Exxon%' LIMIT 1), 'Doritos Nacho', 'Snacks', 4.49, '/grocery-us-2.png', true),
((SELECT id FROM fuel_stations WHERE name LIKE '%Shell%' OR name LIKE '%Chevron%' OR name LIKE '%Exxon%' LIMIT 1), 'Coca Cola 20oz', 'Beverages', 2.29, '/grocery-us-3.png', true),
((SELECT id FROM fuel_stations WHERE name LIKE '%Shell%' OR name LIKE '%Chevron%' OR name LIKE '%Exxon%' LIMIT 1), 'Snickers Bar', 'Snacks', 1.99, '/grocery-us-4.png', true),
((SELECT id FROM fuel_stations WHERE name LIKE '%Shell%' OR name LIKE '%Chevron%' OR name LIKE '%Exxon%' LIMIT 1), 'Monster Energy', 'Beverages', 3.49, '/grocery-us-5.png', true),

-- UK Station products (prices in GBP)
((SELECT id FROM fuel_stations WHERE name LIKE '%BP%' OR name LIKE '%Tesco%' OR name LIKE '%Sainsbury%' LIMIT 1), 'Walkers Crisps', 'Snacks', 1.25, '/grocery-uk-1.png', true),
((SELECT id FROM fuel_stations WHERE name LIKE '%BP%' OR name LIKE '%Tesco%' OR name LIKE '%Sainsbury%' LIMIT 1), 'Lucozade Energy', 'Beverages', 1.89, '/grocery-uk-2.png', true),
((SELECT id FROM fuel_stations WHERE name LIKE '%BP%' OR name LIKE '%Tesco%' OR name LIKE '%Sainsbury%' LIMIT 1), 'Mars Bar', 'Snacks', 1.20, '/grocery-uk-3.png', true),
((SELECT id FROM fuel_stations WHERE name LIKE '%BP%' OR name LIKE '%Tesco%' OR name LIKE '%Sainsbury%' LIMIT 1), 'Pepsi Max 330ml', 'Beverages', 1.35, '/grocery-uk-4.png', true),
((SELECT id FROM fuel_stations WHERE name LIKE '%BP%' OR name LIKE '%Tesco%' OR name LIKE '%Sainsbury%' LIMIT 1), 'Haribo Gummies', 'Snacks', 1.50, '/grocery-uk-5.png', true);

-- Add more products to ensure each station has at least 5-8 items
-- Additional Indonesian products
INSERT INTO products (station_id, name, category, price, image, in_stock) VALUES
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 3), 'Tango Wafer', 'Snacks', 1.80, '/grocery-16.png', true),
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 3), 'Mizone Isotonic', 'Beverages', 2.50, '/grocery-17.png', true),
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 3), 'Supermi Instant', 'Food', 2.20, '/grocery-18.png', true),
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 3), 'Kopiko Coffee', 'Beverages', 1.90, '/grocery-19.png', true),
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 3), 'Nextar Crackers', 'Snacks', 3.20, '/grocery-20.png', true),

((SELECT id FROM fuel_stations LIMIT 1 OFFSET 4), 'Yakult Drink', 'Beverages', 3.80, '/grocery-21.png', true),
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 4), 'Biskuat Biscuit', 'Snacks', 2.90, '/grocery-22.png', true),
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 4), 'Sarimi Instant', 'Food', 2.40, '/grocery-23.png', true),
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 4), 'Fruit Tea Drink', 'Beverages', 2.10, '/grocery-24.png', true),
((SELECT id FROM fuel_stations LIMIT 1 OFFSET 4), 'Cheetos Snack', 'Snacks', 3.50, '/grocery-25.png', true);

-- Verify insertion
SELECT 
    fs.name as station_name,
    COUNT(p.id) as product_count,
    STRING_AGG(p.name, ', ') as products
FROM fuel_stations fs
LEFT JOIN products p ON fs.id = p.station_id
GROUP BY fs.id, fs.name
ORDER BY fs.name;