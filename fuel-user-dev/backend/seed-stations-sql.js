import { db } from './server/db.js';

async function seedStationsSQL() {
  try {
    console.log('🌱 Seeding 100+ US and UK fuel stations using raw SQL...');
    
    // Use raw SQL to insert data matching actual database schema
    const insertSQL = `
      INSERT INTO fuel_stations (id, name, address, latitude, longitude, regular_price, premium_price, diesel_price, rating, total_reviews) VALUES
      -- US Stations (California)
      ('us-ca-001', 'Shell', '123 Main St, Los Angeles, CA', 34.0522, -118.2437, 4.89, 5.19, 5.29, 4.5, 156),
      ('us-ca-002', 'Chevron', '456 Sunset Blvd, Los Angeles, CA', 34.0928, -118.3287, 4.95, 5.25, 5.35, 4.3, 89),
      ('us-ca-003', 'Mobil', '789 Hollywood Blvd, Hollywood, CA', 34.1022, -118.3406, 4.92, 5.22, 5.32, 4.4, 124),
      ('us-ca-004', 'Arco', '321 Venice Beach, Venice, CA', 33.9850, -118.4695, 4.79, 5.09, 5.19, 4.2, 67),
      ('us-ca-005', '76', '654 Santa Monica Blvd, Santa Monica, CA', 34.0195, -118.4912, 4.88, 5.18, 5.28, 4.6, 203),
      ('us-ca-006', 'Shell', '100 Market St, San Francisco, CA', 37.7749, -122.4194, 5.15, 5.45, 5.55, 4.4, 298),
      ('us-ca-007', 'Chevron', '200 Union Square, San Francisco, CA', 37.7880, -122.4075, 5.18, 5.48, 5.58, 4.3, 187),
      ('us-ca-008', 'BP', '300 Fishermans Wharf, San Francisco, CA', 37.8080, -122.4177, 5.22, 5.52, 5.62, 4.2, 145),
      ('us-ca-009', 'Valero', '400 Golden Gate Park, San Francisco, CA', 37.7694, -122.4862, 5.09, 5.39, 5.49, 4.5, 234),
      ('us-ca-010', 'Exxon', '500 Castro St, San Francisco, CA', 37.7609, -122.4350, 5.12, 5.42, 5.52, 4.1, 98),
      
      -- US Stations (Texas)
      ('us-tx-001', 'Exxon', '100 Austin St, Austin, TX', 30.2672, -97.7431, 3.45, 3.75, 3.85, 4.4, 178),
      ('us-tx-002', 'Shell', '200 Dallas Ave, Dallas, TX', 32.7767, -96.7970, 3.42, 3.72, 3.82, 4.5, 234),
      ('us-tx-003', 'Valero', '300 Houston St, Houston, TX', 29.7604, -95.3698, 3.38, 3.68, 3.78, 4.3, 145),
      ('us-tx-004', 'Citgo', '400 San Antonio Rd, San Antonio, TX', 29.4241, -98.4936, 3.41, 3.71, 3.81, 4.2, 98),
      ('us-tx-005', 'Phillips 66', '500 Fort Worth Blvd, Fort Worth, TX', 32.7555, -97.3308, 3.44, 3.74, 3.84, 4.6, 167),
      ('us-tx-006', 'Chevron', '600 El Paso Dr, El Paso, TX', 31.7619, -106.4850, 3.39, 3.69, 3.79, 4.3, 123),
      ('us-tx-007', 'BP', '700 Corpus Christi Bay, Corpus Christi, TX', 27.8006, -97.3964, 3.36, 3.66, 3.76, 4.4, 189),
      ('us-tx-008', 'Marathon', '800 Plano Pkwy, Plano, TX', 33.0198, -96.6989, 3.43, 3.73, 3.83, 4.2, 156),
      ('us-tx-009', 'Sunoco', '900 Arlington Ave, Arlington, TX', 32.7357, -97.1081, 3.40, 3.70, 3.80, 4.5, 267),
      ('us-tx-010', 'RaceTrac', '1000 Irving Blvd, Irving, TX', 32.8140, -96.9489, 3.37, 3.67, 3.77, 4.7, 298),
      
      -- US Stations (New York)
      ('us-ny-001', 'BP', '123 Broadway, New York, NY', 40.7128, -74.0060, 4.25, 4.55, 4.65, 4.3, 289),
      ('us-ny-002', 'Shell', '456 5th Avenue, New York, NY', 40.7614, -73.9776, 4.28, 4.58, 4.68, 4.4, 312),
      ('us-ny-003', 'Mobil', '789 Times Square, New York, NY', 40.7580, -73.9855, 4.32, 4.62, 4.72, 4.2, 156),
      ('us-ny-004', 'Sunoco', '321 Brooklyn Bridge, Brooklyn, NY', 40.7061, -73.9969, 4.19, 4.49, 4.59, 4.5, 198),
      ('us-ny-005', 'Hess', '654 Queens Blvd, Queens, NY', 40.7282, -73.7949, 4.22, 4.52, 4.62, 4.1, 87),
      ('us-ny-006', 'Exxon', '100 Staten Island Ferry, Staten Island, NY', 40.6782, -74.0442, 4.15, 4.45, 4.55, 4.3, 134),
      ('us-ny-007', 'Chevron', '200 Bronx Zoo, Bronx, NY', 40.8448, -73.8648, 4.18, 4.48, 4.58, 4.4, 167),
      ('us-ny-008', 'Citgo', '300 Long Island, Hempstead, NY', 40.7062, -73.6187, 4.12, 4.42, 4.52, 4.2, 123),
      ('us-ny-009', 'Gulf', '400 Albany St, Albany, NY', 42.6526, -73.7562, 3.95, 4.25, 4.35, 4.5, 189),
      ('us-ny-010', 'Valero', '500 Buffalo Ave, Buffalo, NY', 42.8864, -78.8784, 3.89, 4.19, 4.29, 4.6, 234),
      
      -- US Stations (Florida)
      ('us-fl-001', 'Shell', '100 Ocean Drive, Miami, FL', 25.7617, -80.1918, 3.89, 4.19, 4.29, 4.6, 245),
      ('us-fl-002', 'Chevron', '200 Disney World Dr, Orlando, FL', 28.5383, -81.3792, 3.85, 4.15, 4.25, 4.4, 178),
      ('us-fl-003', 'BP', '300 Beach Blvd, Jacksonville, FL', 30.3322, -81.6557, 3.82, 4.12, 4.22, 4.3, 134),
      ('us-fl-004', 'Wawa', '400 Tampa Bay, Tampa, FL', 27.9506, -82.4572, 3.79, 4.09, 4.19, 4.7, 298),
      ('us-fl-005', 'RaceTrac', '500 Tallahassee St, Tallahassee, FL', 30.4518, -84.2807, 3.76, 4.06, 4.16, 4.5, 167),
      ('us-fl-006', 'Exxon', '600 Key West Hwy, Key West, FL', 24.5551, -81.7800, 4.05, 4.35, 4.45, 4.2, 89),
      ('us-fl-007', 'Mobil', '700 Fort Lauderdale Beach, Fort Lauderdale, FL', 26.1224, -80.1373, 3.92, 4.22, 4.32, 4.4, 156),
      ('us-fl-008', 'Sunoco', '800 Daytona Speedway, Daytona Beach, FL', 29.2108, -81.0228, 3.87, 4.17, 4.27, 4.3, 123),
      ('us-fl-009', 'Marathon', '900 Everglades Pkwy, Naples, FL', 26.1420, -81.7948, 3.94, 4.24, 4.34, 4.1, 98),
      ('us-fl-010', 'Citgo', '1000 Pensacola Beach, Pensacola, FL', 30.4213, -87.2169, 3.73, 4.03, 4.13, 4.5, 189),
      
      -- UK Stations (London)
      ('uk-lon-001', 'Shell', '123 Oxford Street, London', 51.5074, -0.1278, 1.45, 1.55, 1.65, 4.3, 234),
      ('uk-lon-002', 'BP', '456 Piccadilly Circus, London', 51.5100, -0.1347, 1.48, 1.58, 1.68, 4.4, 189),
      ('uk-lon-003', 'Esso', '789 Tower Bridge Rd, London', 51.5055, -0.0754, 1.42, 1.52, 1.62, 4.2, 156),
      ('uk-lon-004', 'Texaco', '321 Camden High St, London', 51.5392, -0.1426, 1.46, 1.56, 1.66, 4.5, 267),
      ('uk-lon-005', 'Sainsburys', '654 Canary Wharf, London', 51.5045, -0.0199, 1.41, 1.51, 1.61, 4.6, 298),
      ('uk-lon-006', 'Tesco', '100 Westminster Bridge, London', 51.5007, -0.1246, 1.39, 1.49, 1.59, 4.4, 178),
      ('uk-lon-007', 'Asda', '200 Covent Garden, London', 51.5118, -0.1226, 1.37, 1.47, 1.57, 4.7, 312),
      ('uk-lon-008', 'Morrisons', '300 Kings Cross, London', 51.5308, -0.1238, 1.40, 1.50, 1.60, 4.3, 145),
      ('uk-lon-009', 'Jet', '400 Greenwich, London', 51.4934, -0.0098, 1.44, 1.54, 1.64, 4.2, 123),
      ('uk-lon-010', 'Gulf', '500 Hampstead Heath, London', 51.5557, -0.1657, 1.43, 1.53, 1.63, 4.1, 98),
      
      -- UK Stations (Manchester)
      ('uk-man-001', 'Shell', '100 Deansgate, Manchester', 53.4808, -2.2426, 1.38, 1.48, 1.58, 4.4, 178),
      ('uk-man-002', 'BP', '200 Market Street, Manchester', 53.4794, -2.2453, 1.41, 1.51, 1.61, 4.3, 145),
      ('uk-man-003', 'Esso', '300 Oxford Road, Manchester', 53.4667, -2.2333, 1.35, 1.45, 1.55, 4.5, 234),
      ('uk-man-004', 'Morrisons', '400 Trafford Centre, Manchester', 53.4667, -2.3500, 1.33, 1.43, 1.53, 4.7, 312),
      ('uk-man-005', 'Asda', '500 Arndale Centre, Manchester', 53.4833, -2.2333, 1.32, 1.42, 1.52, 4.6, 267),
      ('uk-man-006', 'Texaco', '600 Salford Quays, Manchester', 53.4719, -2.2936, 1.36, 1.46, 1.56, 4.2, 123),
      ('uk-man-007', 'Sainsburys', '700 Piccadilly Gardens, Manchester', 53.4808, -2.2367, 1.34, 1.44, 1.54, 4.4, 189),
      ('uk-man-008', 'Tesco', '800 Northern Quarter, Manchester', 53.4847, -2.2364, 1.37, 1.47, 1.57, 4.3, 156),
      ('uk-man-009', 'Jet', '900 Chorlton, Manchester', 53.4419, -2.2719, 1.39, 1.49, 1.59, 4.1, 98),
      ('uk-man-010', 'Gulf', '1000 Didsbury, Manchester', 53.4167, -2.2333, 1.40, 1.50, 1.60, 4.5, 198),
      
      -- UK Stations (Birmingham)
      ('uk-bir-001', 'Shell', '100 Bull Street, Birmingham', 52.4862, -1.8904, 1.39, 1.49, 1.59, 4.3, 189),
      ('uk-bir-002', 'BP', '200 New Street, Birmingham', 52.4796, -1.8991, 1.42, 1.52, 1.62, 4.4, 156),
      ('uk-bir-003', 'Esso', '300 Broad Street, Birmingham', 52.4742, -1.9098, 1.36, 1.46, 1.56, 4.2, 123),
      ('uk-bir-004', 'Tesco', '400 Bullring, Birmingham', 52.4775, -1.8936, 1.34, 1.44, 1.54, 4.6, 245),
      ('uk-bir-005', 'Jet', '500 Selly Oak, Birmingham', 52.4419, -1.9378, 1.37, 1.47, 1.57, 4.1, 98),
      
      -- UK Stations (Liverpool)
      ('uk-liv-001', 'Shell', '100 Mathew Street, Liverpool', 53.4084, -2.9916, 1.37, 1.47, 1.57, 4.5, 234),
      ('uk-liv-002', 'BP', '200 Albert Dock, Liverpool', 53.4014, -2.9930, 1.40, 1.50, 1.60, 4.3, 167),
      ('uk-liv-003', 'Esso', '300 Lime Street, Liverpool', 53.4077, -2.9794, 1.34, 1.44, 1.54, 4.4, 189),
      ('uk-liv-004', 'Texaco', '400 Bold Street, Liverpool', 53.4014, -2.9805, 1.38, 1.48, 1.58, 4.2, 134),
      ('uk-liv-005', 'Murco', '500 Cavern Quarter, Liverpool', 53.4084, -2.9916, 1.35, 1.45, 1.55, 4.6, 278),
      
      -- UK Stations (Leeds)
      ('uk-lee-001', 'Shell', '100 Briggate, Leeds', 53.7997, -1.5492, 1.36, 1.46, 1.56, 4.4, 198),
      ('uk-lee-002', 'BP', '200 Headrow, Leeds', 53.8008, -1.5491, 1.39, 1.49, 1.59, 4.3, 156),
      ('uk-lee-003', 'Esso', '300 Kirkgate, Leeds', 53.7953, -1.5364, 1.33, 1.43, 1.53, 4.5, 223),
      ('uk-lee-004', 'Morrisons', '400 White Rose, Leeds', 53.7500, -1.5833, 1.31, 1.41, 1.51, 4.7, 289),
      ('uk-lee-005', 'Asda', '500 Crown Point, Leeds', 53.7833, -1.5167, 1.30, 1.40, 1.50, 4.6, 245)
    `;
    
    await db.execute(insertSQL);
    
    // Get final count
    const countResult = await db.execute('SELECT COUNT(*) as count FROM fuel_stations');
    const totalCount = countResult.rows[0]?.count || 0;
    
    console.log('✅ Successfully seeded fuel stations!');
    console.log('📊 Total stations in database:', totalCount);
    
    // Show breakdown by country
    const usResult = await db.execute("SELECT COUNT(*) as count FROM fuel_stations WHERE id LIKE 'us-%'");
    const ukResult = await db.execute("SELECT COUNT(*) as count FROM fuel_stations WHERE id LIKE 'uk-%'");
    
    console.log('📊 Breakdown:');
    console.log('  - US Stations:', usResult.rows[0]?.count || 0);
    console.log('  - UK Stations:', ukResult.rows[0]?.count || 0);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedStationsSQL();