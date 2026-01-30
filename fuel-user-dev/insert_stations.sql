-- Insert sample fuel stations data (with conflict handling)
INSERT INTO fuel_stations (id, name, address, latitude, longitude, regular_price, premium_price, diesel_price, rating, total_reviews, average_delivery_time, is_open_24_7) VALUES
('station-1', 'Shell Kemang', 'Jl. Kemang Raya No. 12, Jakarta Selatan', -6.2615, 106.8106, 15500.00, 16200.00, 14800.00, 4.5, 128, 25, true),
('station-2', 'Pertamina Blok M', 'Jl. Blok M Raya No. 8, Jakarta Selatan', -6.2441, 106.7991, 15400.00, 16100.00, 14700.00, 4.3, 95, 30, true),
('station-3', 'Total Senayan', 'Jl. Asia Afrika No. 15, Jakarta Pusat', -6.2088, 106.8229, 15600.00, 16300.00, 14900.00, 4.7, 156, 20, true),
('station-4', 'BP Sudirman', 'Jl. Jend. Sudirman Kav. 25, Jakarta Pusat', -6.2088, 106.8229, 15550.00, 16250.00, 14850.00, 4.4, 87, 28, true),
('station-5', 'Vivo Pondok Indah', 'Jl. Metro Pondok Indah No. 3, Jakarta Selatan', -6.2615, 106.7837, 15450.00, 16150.00, 14750.00, 4.6, 112, 22, true),
('station-6', 'Shell Gatot Subroto', 'Jl. Gatot Subroto Kav. 18, Jakarta Selatan', -6.2297, 106.8253, 15500.00, 16200.00, 14800.00, 4.2, 73, 35, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample products for stations (with conflict handling)
INSERT INTO products (id, station_id, name, category, price, image, in_stock) VALUES
-- Shell Kemang products
('prod-1', 'station-1', 'Coca Cola 330ml', 'beverages', 8000.00, '/coca-cola.jpg', true),
('prod-2', 'station-1', 'Indomie Goreng', 'food', 3500.00, '/indomie.jpg', true),
('prod-3', 'station-1', 'Aqua 600ml', 'beverages', 4000.00, '/aqua.jpg', true),

-- Pertamina Blok M products  
('prod-4', 'station-2', 'Teh Botol Sosro', 'beverages', 6000.00, '/teh-botol.jpg', true),
('prod-5', 'station-2', 'Roti Tawar Sari Roti', 'food', 12000.00, '/sari-roti.jpg', true),
('prod-6', 'station-2', 'Kopi Kapal Api', 'beverages', 2500.00, '/kapal-api.jpg', true),

-- Total Senayan products
('prod-7', 'station-3', 'Pocari Sweat', 'beverages', 9000.00, '/pocari.jpg', true),
('prod-8', 'station-3', 'Chitato Sapi Panggang', 'snacks', 8500.00, '/chitato.jpg', true),
('prod-9', 'station-3', 'Energen Coklat', 'beverages', 3000.00, '/energen.jpg', true)
ON CONFLICT (id) DO NOTHING;