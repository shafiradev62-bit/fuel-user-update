import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

import { db } from './db.js';
import { customers, vehicles, fuelStations, products, fuelFriends } from '../shared/schema.js';

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Seed fuel stations
    const stations = await db.insert(fuelStations).values([
      {
        name: 'Shell Station',
        address: 'Jl. Sudirman No. 123, Jakarta',
        latitude: '-6.200000',
        longitude: '106.816666',
        regularPrice: '10000',
        premiumPrice: '12000',
        dieselPrice: '11000'
      },
      {
        name: 'Pertamina Station',
        address: 'Jl. Thamrin No. 456, Jakarta',
        latitude: '-6.195000',
        longitude: '106.820000',
        regularPrice: '9800',
        premiumPrice: '11800',
        dieselPrice: '10800'
      }
    ]).returning();

    // Seed products
    await db.insert(products).values([
      {
        stationId: stations[0].id,
        name: 'Mineral Water',
        category: 'Drinks',
        price: '5000',
        image: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?w=100&h=100&fit=crop'
      },
      {
        stationId: stations[0].id,
        name: 'Potato Chips',
        category: 'Snacks',
        price: '8000',
        image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=100&h=100&fit=crop'
      }
    ]);

    // Seed fuel friends
    await db.insert(fuelFriends).values([
      {
        fullName: 'John Driver',
        phoneNumber: '081234567890',
        email: 'john@fuelfriend.com',
        location: 'Jakarta Pusat',
        deliveryFee: '15000',
        rating: '4.9',
        totalReviews: 124
      },
      {
        fullName: 'Sarah Spark',
        phoneNumber: '081234567891',
        email: 'sarah@fuelfriend.com',
        location: 'Jakarta Selatan',
        deliveryFee: '14500',
        rating: '4.8',
        totalReviews: 89
      }
    ]);

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
  }
}

seed();