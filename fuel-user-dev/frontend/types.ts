export enum Theme {
    LIGHT = 'light',
    DARK = 'dark',
    DEFAULT = 'default',
}

export interface User {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    city: string;
    avatarUrl: string;
    vehicles: Vehicle[];
}

export interface Vehicle {
    id: string;
    brand: string;
    color: string;
    licenseNumber: string;
    fuelType: 'Petrol' | 'Diesel' | 'Electric';
}

export interface Station {
    id: string;
    name: string;
    address: string;
    distance: string;
    deliveryTime: string;
    rating: number;
    reviewCount: number;
    imageUrl: string;
    bannerUrl: string;
    logoUrl: string;
    fuelPrices: {
        regular: number;
        premium: number;
        diesel: number;
    };
    lat?: number;
    lon?: number;
    groceries: GroceryItem[];
    fuelFriends: FuelFriend[];
}

export interface GroceryItem {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
}

export interface FuelFriend {
    id: string;
    name: string;
    rate: number;
    rating: number;
    reviewCount: number;
    avatarUrl: string;
}

export type OrderStatus = 'Ongoing' | 'Completed' | 'Canceled';

export interface Order {
    id: string;
    trackingNo: string;
    fuelFriend: {
        name: string;
        location: string;
        avatarUrl: string;
    },
    status: OrderStatus;
    items: { name: string; price: number }[];
    fuelCost: number;
    deliveryFee: number;
    totalAmount: number;
    deliveryTime: string;
    vehicle: {
        brand: string;
        color: string;
        licenseNumber: string;
    }
}
