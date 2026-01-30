-- Clean up duplicate products and ensure all stations have groceries
-- First, remove duplicates
DELETE FROM products p1 USING products p2 
WHERE p1.id > p2.id 
AND p1.station_id = p2.station_id 
AND p1.name = p2.name;

-- Add products to stations that don't have any
INSERT INTO products (station_id, name, category, price, image, in_stock) 
SELECT 
    fs.id,
    'Coca Cola 330ml',
    'Beverages',
    CASE 
        WHEN fs.name LIKE '%Shell%' OR fs.name LIKE '%Chevron%' OR fs.name LIKE '%Exxon%' OR fs.name LIKE '%Mobil%' THEN 2.29
        WHEN fs.name LIKE '%BP%' OR fs.name LIKE '%Tesco%' OR fs.name LIKE '%Esso%' OR fs.name LIKE '%Texaco%' THEN 1.35
        ELSE 1.50
    END,
    '/grocery-cola.png',
    true
FROM fuel_stations fs
LEFT JOIN products p ON fs.id = p.station_id
WHERE p.id IS NULL;

INSERT INTO products (station_id, name, category, price, image, in_stock) 
SELECT 
    fs.id,
    'Energy Drink',
    'Beverages',
    CASE 
        WHEN fs.name LIKE '%Shell%' OR fs.name LIKE '%Chevron%' OR fs.name LIKE '%Exxon%' OR fs.name LIKE '%Mobil%' THEN 3.99
        WHEN fs.name LIKE '%BP%' OR fs.name LIKE '%Tesco%' OR fs.name LIKE '%Esso%' OR fs.name LIKE '%Texaco%' THEN 1.89
        ELSE 2.50
    END,
    '/grocery-energy.png',
    true
FROM fuel_stations fs
WHERE fs.id NOT IN (SELECT DISTINCT station_id FROM products WHERE name = 'Energy Drink');

INSERT INTO products (station_id, name, category, price, image, in_stock) 
SELECT 
    fs.id,
    'Potato Chips',
    'Snacks',
    CASE 
        WHEN fs.name LIKE '%Shell%' OR fs.name LIKE '%Chevron%' OR fs.name LIKE '%Exxon%' OR fs.name LIKE '%Mobil%' THEN 4.49
        WHEN fs.name LIKE '%BP%' OR fs.name LIKE '%Tesco%' OR fs.name LIKE '%Esso%' OR fs.name LIKE '%Texaco%' THEN 1.25
        ELSE 3.20
    END,
    '/grocery-chips.png',
    true
FROM fuel_stations fs
WHERE fs.id NOT IN (SELECT DISTINCT station_id FROM products WHERE name = 'Potato Chips');

INSERT INTO products (station_id, name, category, price, image, in_stock) 
SELECT 
    fs.id,
    'Chocolate Bar',
    'Snacks',
    CASE 
        WHEN fs.name LIKE '%Shell%' OR fs.name LIKE '%Chevron%' OR fs.name LIKE '%Exxon%' OR fs.name LIKE '%Mobil%' THEN 1.99
        WHEN fs.name LIKE '%BP%' OR fs.name LIKE '%Tesco%' OR fs.name LIKE '%Esso%' OR fs.name LIKE '%Texaco%' THEN 1.20
        ELSE 2.80
    END,
    '/grocery-chocolate.png',
    true
FROM fuel_stations fs
WHERE fs.id NOT IN (SELECT DISTINCT station_id FROM products WHERE name = 'Chocolate Bar');

INSERT INTO products (station_id, name, category, price, image, in_stock) 
SELECT 
    fs.id,
    'Bottled Water',
    'Beverages',
    CASE 
        WHEN fs.name LIKE '%Shell%' OR fs.name LIKE '%Chevron%' OR fs.name LIKE '%Exxon%' OR fs.name LIKE '%Mobil%' THEN 1.79
        WHEN fs.name LIKE '%BP%' OR fs.name LIKE '%Tesco%' OR fs.name LIKE '%Esso%' OR fs.name LIKE '%Texaco%' THEN 0.99
        ELSE 1.20
    END,
    '/grocery-water.png',
    true
FROM fuel_stations fs
WHERE fs.id NOT IN (SELECT DISTINCT station_id FROM products WHERE name = 'Bottled Water');

-- Verify all stations now have products
SELECT 
    fs.name as station_name,
    COUNT(p.id) as product_count,
    STRING_AGG(p.name, ', ' ORDER BY p.name) as products
FROM fuel_stations fs
LEFT JOIN products p ON fs.id = p.station_id
GROUP BY fs.id, fs.name
ORDER BY product_count DESC, fs.name;