import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import TapEffectButton from '../components/TapEffectButton';
import CheckoutBreakdownComponent from '../components/CheckoutBreakdown';
import { CheckoutBreakdown } from '../types/subscription';

const OrderSummaryScreen = () => {
  console.log('🔍 OrderSummaryScreen component mounted');
  const navigate = useNavigate();
  const location = useLocation();

  // Debug logging
  console.log('🔍 OrderSummaryScreen - location.state:', location.state);
  console.log('🔍 OrderSummaryScreen - location.state type:', typeof location.state);
  const {
    formData,
    station,
    cartItems = [],
    selectedFuelFriend,
    user,
    subscriptionPlan,
    tip,
    additionalVehicles,
    breakdown
  } = location.state || {};

  // Debug logging
  console.log('🔍 OrderSummaryScreen - location.state:', location.state);
  console.log('🔍 OrderSummaryScreen - station:', station);
  console.log('🔍 OrderSummaryScreen - cartItems:', cartItems);
  console.log('🔍 OrderSummaryScreen - selectedFuelFriend:', selectedFuelFriend);
  console.log('🔍 OrderSummaryScreen - breakdown:', breakdown);
  console.log('🔍 OrderSummaryScreen - user:', user);

  // Safety check - redirect if no state data
  if (!location.state) {
    console.log('🔍 OrderSummaryScreen - No state data, redirecting to home');
    navigate('/home');
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Redirecting...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  // Fallback data to prevent blank screen
  const fallbackData = {
    station: station || {
      id: 'default-station',
      name: 'Fuel Station',
      address: 'Station Address',
      fuelPrices: { regular: 3.29, premium: 3.79, diesel: 3.59 },
      regularPrice: 3.29,
      deliveryTime: '15-20 mins',
      rating: 4.5,
      reviewCount: 128
    },
    cartItems: cartItems || [],
    selectedFuelFriend: selectedFuelFriend || null,
    breakdown: breakdown || {
      fuelCost: 32.90,
      convenienceItemsCost: 0,
      serviceFee: 2.99,
      subscriptionCost: 0,
      vat: 7.18,
      tip: 0,
      total: 43.07
    }
  };

  // Determine if user is non-subscriber
  const isNonSubscriber = !user?.subscriptionPlan && !subscriptionPlan;

  // Determine vehicle type for service fee calculation
  const vehicleType: 'car' | 'suv' = formData?.fuelType?.toLowerCase().includes('suv') || formData?.fuelType?.toLowerCase().includes('truck') ? 'suv' : 'car';

  return (
    <AnimatedPage>
      <div className="bg-white min-h-screen pb-24">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <TapEffectButton
            onClick={() => navigate("/home")}
            className="p-2 -ml-2"
          >
            <img src="/Back.png" alt="Back" className="w-5 h-5" />
          </TapEffectButton>
          <h1 className="text-lg font-semibold text-gray-900">Order summary</h1>
          <div className="w-10"></div>
        </div>

        {/* Step Indicator */}
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            {/* Step 1 - Completed */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500 border-2 border-green-500 text-white">
                <Check className="w-6 h-6" />
              </div>
              <span className="text-sm text-gray-600 mt-2">Order</span>
            </div>

            {/* Connector 1-2 */}
            <div className="flex-1 h-0.5 mx-2 bg-green-500"></div>

            {/* Step 2 - Current */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500 border-2 border-green-500 text-white">
                <span className="font-semibold">2</span>
              </div>
              <span className="text-sm text-gray-600 mt-2">Order summary</span>
            </div>

            {/* Connector 2-3 */}
            <div className="flex-1 h-0.5 mx-2 bg-gray-300"></div>

            {/* Step 3 */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-gray-300 text-gray-400">
                <span className="font-semibold">3</span>
              </div>
              <span className="text-sm text-gray-600 mt-2">Payment</span>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="mx-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 text-center mb-6">Fuel order details</h2>

            <div className="space-y-4">
              {/* Station Name */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Station Name</span>
                <span className="text-gray-900 font-medium">{fallbackData.station.name}</span>
              </div>

              {/* Fuel Type */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Fuel Type</span>
                <span className="text-gray-900 font-medium">{formData?.fuelType || 'Regular'}</span>
              </div>

              {/* Quantity */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Quantity</span>
                <span className="text-gray-900 font-medium">{formData?.quantity || '10 liters'}</span>
              </div>

              {/* Groceries */}
              {fallbackData.cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">{item.name} (x{item.quantity})</span>
                  <span className="text-gray-900 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              {/* Fuel Friend */}
              {fallbackData.selectedFuelFriend && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Fuel Friend</span>
                  <span className="text-gray-900 font-medium">{fallbackData.selectedFuelFriend.name || fallbackData.selectedFuelFriend.fullName}</span>
                </div>
              )}

              {/* Pickup Time */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Pickup Time</span>
                <span className="text-gray-900 font-medium">{formData?.deliveryTime || '15-20 mins'}</span>
              </div>

              {/* Vehicle Details */}
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Vehicle</span>
                <span className="text-gray-900 font-medium">{formData?.vehicleBrand || 'Toyota'} ({formData?.vehicleColor || 'Silver'})</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">License Number</span>
                <span className="text-gray-900 font-medium">{formData?.numberPlate || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Breakdown */}
        <div className="px-4 mb-6">
          <CheckoutBreakdownComponent
            breakdown={fallbackData.breakdown}
            isNonSubscriber={isNonSubscriber}
            vehicleType={vehicleType}
          />
        </div>

        {/* Confirm Payment Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button
            onClick={() => navigate('/payment', {
              state: {
                formData,
                station: fallbackData.station,
                cartItems: fallbackData.cartItems,
                selectedFuelFriend: fallbackData.selectedFuelFriend,
                user,
                subscriptionPlan,
                tip,
                additionalVehicles,
                breakdown: fallbackData.breakdown
              }
            })}
            className="w-full bg-green-500 text-white py-4 rounded-full text-lg font-semibold mb-4"
          >
            Confirm Payment & Address
          </button>

          {/* Edit Details Link */}
          <button
            onClick={() => navigate("/home")}
            className="w-full text-green-500 text-lg font-medium rounded-full py-4"
          >
            Edit Details
          </button>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default OrderSummaryScreen;