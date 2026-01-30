import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ChevronDown, X, Zap, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AnimatedPage from '../components/AnimatedPage';
import AddressAutocomplete from '../components/AddressAutocomplete';
import TapEffectButton from '../components/TapEffectButton';
import SubscriptionPlans from '../components/SubscriptionPlans';
import CheckoutBreakdownComponent from '../components/CheckoutBreakdown';
import TipSelector from '../components/TipSelector';
import { useCheckoutCalculation } from '../hooks/useCheckoutCalculation';
import { SubscriptionPlan, SUBSCRIPTION_PLANS } from '../types/subscription';

const CheckoutScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAppContext();

  // Debug logging
  console.log('🔍 CheckoutScreen - Component mounted');
  console.log('🔍 CheckoutScreen - isAuthenticated:', isAuthenticated);
  console.log('🔍 CheckoutScreen - user:', user);
  console.log('🔍 CheckoutScreen - location.state:', location.state);
  const [currentStep, setCurrentStep] = useState(1);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(16);
  const [selectedTime, setSelectedTime] = useState('12:45 am');
  const [currentMonth, setCurrentMonth] = useState('February');

  // Subscription and payment states
  const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] = useState<SubscriptionPlan | undefined>();
  const [tip, setTip] = useState(0);
  const [additionalVehicles, setAdditionalVehicles] = useState(0);

  // Order Scheduling State
  const [showOrderTypeModal, setShowOrderTypeModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [orderType, setOrderType] = useState<'instant' | 'schedule'>('instant');

  const handleOrderTypeSelect = (type: 'instant' | 'schedule') => {
    setOrderType(type);
    setShowOrderTypeModal(false);
    if (type === 'schedule') {
      setShowScheduleModal(true);
    } else {
      setFormData(prev => ({ ...prev, deliveryTime: 'Instant (15-20 mins)' }));
    }
  };

  const daysInMonth = Array.from({ length: 28 }, (_, i) => i + 1);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Determine if user is non-subscriber
  const isNonSubscriber = true; // Assuming all users start as non-subscribers for checkout

  // Get data from location state with better fallbacks
  const station = location.state?.station || {
    id: 'default-station',
    name: 'Default Fuel Station',
    address: 'Station Address',
    fuelPrices: { regular: 3.29, premium: 3.79, diesel: 3.59 },
    regularPrice: 3.29
  };
  const cartItems = location.state?.cartItems || [];
  const selectedFuelFriend = location.state?.selectedFuelFriend || {
    id: 'default-friend',
    name: 'Fuel Friend',
    avatarUrl: '/fuel friend.png'
  };

  // Debug logging
  console.log('CheckoutScreen - location.state:', location.state);
  console.log('CheckoutScreen - station:', station);
  console.log('CheckoutScreen - cartItems:', cartItems);
  console.log('CheckoutScreen - selectedFuelFriend:', selectedFuelFriend);

  // Form data state
  const [formData, setFormData] = useState({
    address: '',
    phoneNumber: '',
    vehicleColor: '',
    vehicleBrand: '',
    fuelType: 'Regular',
    quantity: '10 liters',
    deliveryTime: '15-20 mins',
    numberPlate: ''
  });

  // Calculate costs with better error handling
  const fuelCost = station ? (parseFloat(station.fuelPrices?.regular || station.regularPrice || '3.29') * parseFloat(formData?.quantity?.replace(' liters', '') || '10')) : 32.90;
  const convenienceItemsCost = cartItems.reduce((total, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    return total + (isNaN(price) ? 0 : price * item.quantity);
  }, 0);
  const vehicleType: 'car' | 'suv' = formData.fuelType?.toLowerCase().includes('suv') || formData.fuelType?.toLowerCase().includes('truck') ? 'suv' : 'car';

  // Calculate checkout breakdown
  const breakdown = useCheckoutCalculation({
    fuelCost,
    convenienceItemsCost,
    vehicleType,
    subscriptionPlan: selectedSubscriptionPlan,
    additionalVehicles,
    tip,
    isNonSubscriber
  });

  // Handle subscription plan selection
  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedSubscriptionPlan(plan);
  };

  // Handle tip change
  const handleTipChange = (amount: number) => {
    setTip(amount);
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    console.log('🔍 CheckoutScreen - Auth check - isAuthenticated:', isAuthenticated);
    if (!isAuthenticated) {
      console.log('🔍 CheckoutScreen - Not authenticated, redirecting to login');
      // Store the intended destination
      localStorage.setItem('redirectAfterLogin', '/checkout');
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Load real user data on component mount
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        address: user?.address || user?.city || '',
        phoneNumber: user?.phone || ''
      }));
    }
  }, [user]);

  // Save and continue
  const handleSaveAndContinue = () => {
    console.log('🔍 Checkout - Save & Continue clicked');
    console.log('🔍 Checkout - formData:', formData);
    console.log('🔍 Checkout - station:', station);
    console.log('🔍 Checkout - cartItems:', cartItems);
    console.log('🔍 Checkout - selectedFuelFriend:', selectedFuelFriend);
    console.log('🔍 Checkout - user:', user);

    // Validate required fields
    if (!formData.address || formData.address.trim() === '') {
      alert('Please enter your delivery address');
      return;
    }

    if (!formData.phoneNumber || formData.phoneNumber.trim() === '') {
      alert('Please enter your phone number');
      return;
    }

    navigate('/order-summary', {
      state: {
        formData,
        station,
        cartItems,
        selectedFuelFriend,
        user,
        subscriptionPlan: selectedSubscriptionPlan,
        tip,
        additionalVehicles,
        breakdown
      }
    });
  };

  // Safety check - ensure we have required data
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Redirecting to login...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="bg-white min-h-screen">


        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <TapEffectButton
            onClick={() => navigate(-1)}
            className="p-2 -ml-2"
          >
            <img src="/Back.png" alt="Back" className="w-5 h-5" />
          </TapEffectButton>
          <h1 className="text-lg font-semibold text-gray-900">Checkout</h1>
          <div className="w-10"></div>
        </div>

        {/* Progress Steps */}
        <div className="px-4 py-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                1
              </div>
              <span className={`ml-2 text-sm ${currentStep >= 1 ? 'text-green-500 font-medium' : 'text-gray-500'}`}>
                Order
              </span>
            </div>

            <div className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-green-500' : 'bg-gray-300'}`}></div>

            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                2
              </div>
              <span className={`ml-2 text-sm ${currentStep >= 2 ? 'text-green-500 font-medium' : 'text-gray-500'}`}>
                Order Summary
              </span>
            </div>

            <div className={`w-12 h-0.5 ${currentStep >= 3 ? 'bg-green-500' : 'bg-gray-300'}`}></div>

            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                3
              </div>
              <span className={`ml-2 text-sm ${currentStep >= 3 ? 'text-green-500 font-medium' : 'text-gray-500'}`}>
                Payment
              </span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-4 pb-32">
          {/* Delivery Information */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h2>

            {/* Address */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Delivery Address
              </label>
              <AddressAutocomplete
                value={formData.address}
                onChange={(value) => handleInputChange('address', value)}
                placeholder="Enter your delivery address"
              />
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Delivery Time */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Delivery Time
              </label>
              <TapEffectButton
                onClick={() => setShowOrderTypeModal(true)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-left flex items-center justify-between mobile-button"
              >
                <span>{orderType === 'schedule' ? `${selectedDate} Feb, ${selectedTime}` : formData.deliveryTime}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </TapEffectButton>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Vehicle Color
                </label>
                <input
                  type="text"
                  value={formData.vehicleColor}
                  onChange={(e) => handleInputChange('vehicleColor', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Color"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Vehicle Brand
                </label>
                <input
                  type="text"
                  value={formData.vehicleBrand}
                  onChange={(e) => handleInputChange('vehicleBrand', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ios-input"
                  placeholder="Brand"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Fuel Type
                </label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => handleInputChange('fuelType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ios-input"
                >
                  <option value="Regular">Regular</option>
                  <option value="Premium">Premium</option>
                  <option value="Diesel">Diesel</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Quantity
                </label>
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ios-input"
                  placeholder="Quantity"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                License Plate
              </label>
              <input
                type="text"
                value={formData.numberPlate}
                onChange={(e) => handleInputChange('numberPlate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ios-input"
                placeholder="Enter license plate"
              />
            </div>
          </div>

          {/* Subscription Plans */}
          {isNonSubscriber && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plans</h2>
              <SubscriptionPlans
                selectedPlan={selectedSubscriptionPlan?.id}
                onPlanSelect={handlePlanSelect}
              />
            </div>
          )}

          {/* Tip Selection */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Tip for Fuel Friend</h2>
            <TipSelector
              initialTip={tip}
              onTipChange={handleTipChange}
            />
          </div>

          {/* Checkout Breakdown */}
          <div className="mb-6">
            <CheckoutBreakdownComponent
              breakdown={breakdown}
              isNonSubscriber={isNonSubscriber}
              vehicleType={vehicleType}
            />
          </div>
        </div>

        {/* Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <TapEffectButton
            onClick={handleSaveAndContinue}
            className="w-full bg-green-500 text-white py-4 rounded-full text-lg font-semibold hover:bg-green-600 transition-all duration-200 mobile-button haptic-button"
            style={{ borderRadius: '9999px' }}
          >
            Save & Continue
          </TapEffectButton>
        </div>
      </div>
      {/* Order Type Selection Modal */}
      {showOrderTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in" style={{ zIndex: 6000 }}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-scale-in relative">
            <button
              onClick={() => setShowOrderTypeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-6">Select order type</h3>

            <div className="space-y-4">
              <button
                onClick={() => handleOrderTypeSelect('instant')}
                className="w-full py-4 bg-[#3AC36C] text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-[#2ea85a] transition-all shadow-md"
              >
                <Zap className="w-5 h-5 fill-white" />
                Instant order
              </button>

              <button
                onClick={() => handleOrderTypeSelect('schedule')}
                className="w-full py-4 bg-white border border-gray-200 text-gray-900 rounded-full font-semibold flex items-center justify-center gap-2 hover:border-[#3AC36C] hover:text-[#3AC36C] transition-all shadow-sm"
              >
                <Clock className="w-5 h-5" />
                Schedule Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Picker Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in" style={{ zIndex: 6001 }}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-scale-in relative">
            <div className="flex items-center justify-between mb-6">
              <button className="p-1 rounded-full hover:bg-gray-100">
                <ChevronLeft className="w-5 h-5 text-[#3AC36C]" />
              </button>
              <h3 className="text-lg font-bold text-gray-900">February</h3>
              <button className="p-1 rounded-full hover:bg-gray-100">
                <ChevronRight className="w-5 h-5 text-[#3AC36C]" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="mb-6">
              <div className="grid grid-cols-7 mb-2">
                {weekDays.map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-gray-500 py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-2">
                {/* Empty slots for start of month (assuming starts on Monday based on screenshot blank) */}
                <div></div>
                {daysInMonth.map(day => (
                  <div key={day} className="flex justify-center">
                    <button
                      onClick={() => setSelectedDate(day)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all ${selectedDate === day
                        ? 'bg-[#3AC36C] text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {day}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-3 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:border-[#3AC36C] bg-white"
                >
                  <option>12:45 am</option>
                  <option>1:00 am</option>
                  <option>1:15 am</option>
                  <option>9:00 am</option>
                  <option>12:00 pm</option>
                  <option>3:00 pm</option>
                  <option>6:00 pm</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setFormData(prev => ({ ...prev, deliveryTime: `${selectedDate} Feb, ${selectedTime}` }));
                }}
                className="flex-1 bg-[#3AC36C] text-white font-semibold py-3 rounded-full hover:bg-[#2ea85a] transition-all shadow-md"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
};

export default CheckoutScreen;
