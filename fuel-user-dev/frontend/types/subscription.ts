export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: 'monthly';
  users: number;
  vehicles: number;
  includesConvenienceDelivery: boolean;
  additionalVehiclePrice: number;
  features: string[];
  popular?: boolean;
}

export interface ServiceFee {
  car: number;
  suv: number;
  nonSubscriberAdditionalFee: number;
}

export interface CheckoutBreakdown {
  fuelCost: number;
  convenienceItemsCost: number;
  serviceFee: number;
  nonSubscriberFee?: number;
  subscriptionPlan?: SubscriptionPlan;
  additionalVehicles?: number;
  additionalVehicleCost?: number;
  vat: number;
  total: number;
  tip?: number;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'gold',
    name: 'Gold Plan',
    price: 8.99,
    duration: 'monthly',
    users: 1,
    vehicles: 2,
    includesConvenienceDelivery: false,
    additionalVehiclePrice: 6.99,
    features: [
      'Register up to 2 vehicles',
      'Access to Fuel Friend service for gas pumping',
      'Additional vehicles can be added for $6.99'
    ]
  },
  {
    id: 'gold-plus',
    name: 'Gold Plus Plan',
    price: 12.99,
    duration: 'monthly',
    users: 1,
    vehicles: 2,
    includesConvenienceDelivery: true,
    additionalVehiclePrice: 8.99,
    features: [
      'Includes all Gold Plan benefits',
      'Convenience store item delivery to vehicle',
      'Additional vehicles can be added for $8.99'
    ]
  },
  {
    id: 'family',
    name: 'Family Plan',
    price: 21.99,
    duration: 'monthly',
    users: 4,
    vehicles: 4,
    includesConvenienceDelivery: false,
    additionalVehiclePrice: 6.99,
    features: [
      'Register up to 4 users and 4 vehicles',
      'Access to Fuel Friend service for gas pumping for all users',
      'Additional vehicles can be added for $6.99'
    ]
  },
  {
    id: 'family-plus',
    name: 'Family Plus Plan',
    price: 28.99,
    duration: 'monthly',
    users: 4,
    vehicles: 4,
    includesConvenienceDelivery: true,
    additionalVehiclePrice: 8.99,
    popular: true,
    features: [
      'Includes all Family Plan benefits',
      'Convenience store item delivery to vehicles for all users',
      'Additional vehicles can be added for $8.99'
    ]
  },
  {
    id: 'business',
    name: 'Business Plan',
    price: 78.99,
    duration: 'monthly',
    users: 15,
    vehicles: 15,
    includesConvenienceDelivery: false,
    additionalVehiclePrice: 6.99,
    features: [
      'Register up to 15 users and 15 vehicles',
      'Access to Fuel Friend service for gas pumping for all users',
      'Additional vehicles can be added for $6.99'
    ]
  },
  {
    id: 'business-plus',
    name: 'Business Plus Plan',
    price: 95.99,
    duration: 'monthly',
    users: 15,
    vehicles: 15,
    includesConvenienceDelivery: true,
    additionalVehiclePrice: 8.99,
    features: [
      'Includes all Business Plan benefits',
      'Convenience store item delivery to vehicles for all users',
      'Additional vehicles can be added for $8.99'
    ]
  }
];

export const SERVICE_FEES: ServiceFee = {
  car: 3.99,
  suv: 4.99,
  nonSubscriberAdditionalFee: 5.00
};

export const VAT_RATE = 0.10; // 10% VAT on convenience items only
