-- Insert US fuel stations
INSERT INTO fuel_stations (id, name, address, latitude, longitude, regular_price, premium_price, diesel_price, rating, total_reviews, average_delivery_time, is_open_24_7) VALUES
-- New York City
('us-1', 'Shell Times Square', '1568 Broadway, New York, NY 10036', 40.7589, -73.9851, 3.45, 3.75, 3.55, 4.2, 89, 25, true),
('us-2', 'BP Manhattan', '350 W 42nd St, New York, NY 10036', 40.7589, -73.9851, 3.50, 3.80, 3.60, 4.1, 67, 30, true),
('us-3', 'Exxon Central Park', '200 Central Park S, New York, NY 10019', 40.7661, -73.9797, 3.48, 3.78, 3.58, 4.3, 95, 28, true),

-- Los Angeles
('us-4', 'Chevron Hollywood', '6801 Hollywood Blvd, Los Angeles, CA 90028', 34.1022, -118.3406, 4.25, 4.55, 4.35, 4.0, 78, 35, true),
('us-5', 'Shell Beverly Hills', '9100 Wilshire Blvd, Beverly Hills, CA 90212', 34.0669, -118.3959, 4.30, 4.60, 4.40, 4.4, 112, 22, true),
('us-6', 'Mobil Santa Monica', '1334 4th St, Santa Monica, CA 90401', 34.0195, -118.4912, 4.28, 4.58, 4.38, 4.2, 85, 30, true),

-- Chicago
('us-7', 'BP Chicago Loop', '200 N LaSalle St, Chicago, IL 60601', 41.8864, -87.6324, 3.15, 3.45, 3.25, 4.1, 73, 32, true),
('us-8', 'Shell Magnificent Mile', '625 N Michigan Ave, Chicago, IL 60611', 41.8930, -87.6244, 3.18, 3.48, 3.28, 4.3, 91, 27, true),

-- Miami
('us-9', 'Shell South Beach', '1200 Ocean Dr, Miami Beach, FL 33139', 25.7907, -80.1300, 3.35, 3.65, 3.45, 4.5, 134, 20, true),
('us-10', 'Exxon Downtown Miami', '100 SE 2nd St, Miami, FL 33131', 25.7743, -80.1937, 3.32, 3.62, 3.42, 4.2, 88, 25, true)
ON CONFLICT (id) DO NOTHING;

-- Insert UK fuel stations  
INSERT INTO fuel_stations (id, name, address, latitude, longitude, regular_price, premium_price, diesel_price, rating, total_reviews, average_delivery_time, is_open_24_7) VALUES
-- London
('uk-1', 'Shell Oxford Street', '318 Oxford St, London W1C 1HF', 51.5186, -0.1426, 1.45, 1.65, 1.55, 4.3, 156, 25, true),
('uk-2', 'BP Piccadilly Circus', '225 Piccadilly, London W1J 9HR', 51.5101, -0.1344, 1.48, 1.68, 1.58, 4.1, 89, 30, true),
('uk-3', 'Esso Tower Bridge', '2 More London Riverside, London SE1 2RR', 51.5045, -0.0865, 1.46, 1.66, 1.56, 4.4, 127, 22, true),
('uk-4', 'Texaco Canary Wharf', '40 Bank St, London E14 5NR', 51.5054, -0.0235, 1.47, 1.67, 1.57, 4.2, 98, 28, true),

-- Manchester
('uk-5', 'Shell Manchester City Centre', '57 Portland St, Manchester M1 3HP', 53.4794, -2.2453, 1.42, 1.62, 1.52, 4.0, 76, 35, true),
('uk-6', 'BP Deansgate', '303 Deansgate, Manchester M3 4LQ', 53.4794, -2.2453, 1.44, 1.64, 1.54, 4.2, 84, 30, true),

-- Birmingham
('uk-7', 'Esso Birmingham New Street', '200 Corporation St, Birmingham B4 6QD', 52.4796, -1.8951, 1.40, 1.60, 1.50, 4.1, 67, 32, true),
('uk-8', 'Shell Bullring', '5 Bullring, Birmingham B5 4BU', 52.4796, -1.8951, 1.43, 1.63, 1.53, 4.3, 93, 25, true),

-- Edinburgh
('uk-9', 'BP Royal Mile', '322 High St, Edinburgh EH1 1PW', 55.9533, -3.1883, 1.41, 1.61, 1.51, 4.5, 118, 20, true),
('uk-10', 'Shell Princes Street', '107 Princes St, Edinburgh EH2 3AA', 55.9533, -3.1883, 1.44, 1.64, 1.54, 4.2, 87, 27, true),

-- Liverpool
('uk-11', 'Texaco Albert Dock', 'Albert Dock, Liverpool L3 4AF', 53.3998, -2.9916, 1.39, 1.59, 1.49, 4.0, 72, 33, true),
('uk-12', 'Esso Liverpool One', '5 Wall St, Liverpool L1 8JQ', 53.4048, -2.9916, 1.42, 1.62, 1.52, 4.1, 79, 29, true)
ON CONFLICT (id) DO NOTHING;

-- Insert products for US stations
INSERT INTO products (id, station_id, name, category, price, image, in_stock) VALUES
-- US products (prices in USD cents)
('us-prod-1', 'us-1', 'Coca Cola 12oz', 'beverages', 1.99, '/coca-cola.jpg', true),
('us-prod-2', 'us-1', 'Doritos Nacho Cheese', 'snacks', 2.49, '/doritos.jpg', true),
('us-prod-3', 'us-1', 'Red Bull 8.4oz', 'beverages', 2.99, '/redbull.jpg', true),

('us-prod-4', 'us-4', 'Pepsi 12oz', 'beverages', 1.89, '/pepsi.jpg', true),
('us-prod-5', 'us-4', 'Lay\'s Classic', 'snacks', 2.29, '/lays.jpg', true),
('us-prod-6', 'us-4', 'Monster Energy', 'beverages', 3.19, '/monster.jpg', true),

('us-prod-7', 'us-9', 'Gatorade Blue', 'beverages', 2.19, '/gatorade.jpg', true),
('us-prod-8', 'us-9', 'Pringles Original', 'snacks', 2.79, '/pringles.jpg', true),

-- UK products (prices in GBP)
('uk-prod-1', 'uk-1', 'Coca Cola 330ml', 'beverages', 1.20, '/coca-cola.jpg', true),
('uk-prod-2', 'uk-1', 'Walker\'s Crisps', 'snacks', 1.00, '/walkers.jpg', true),
('uk-prod-3', 'uk-1', 'Lucozade Energy', 'beverages', 1.50, '/lucozade.jpg', true),

('uk-prod-4', 'uk-5', 'Ribena Blackcurrant', 'beverages', 1.30, '/ribena.jpg', true),
('uk-prod-5', 'uk-5', 'Cadbury Dairy Milk', 'snacks', 1.25, '/cadbury.jpg', true),
('uk-prod-6', 'uk-5', 'Irn-Bru', 'beverages', 1.40, '/irn-bru.jpg', true),

('uk-prod-7', 'uk-9', 'Tennent\'s Lager', 'beverages', 2.50, '/tennents.jpg', true),
('uk-prod-8', 'uk-9', 'Shortbread Biscuits', 'snacks', 2.00, '/shortbread.jpg', true)
ON CONFLICT (id) DO NOTHING;