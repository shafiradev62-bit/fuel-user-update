import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, Plus, X } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import { apiCreateOrder, apiHealthCheck } from '../services/api';
import { useAppContext } from '../context/AppContext';
import TapEffectButton from '../components/TapEffectButton';
import CheckoutBreakdownComponent from '../components/CheckoutBreakdown';
import ConfettiEffect from '../components/ConfettiEffect';

const PaymentScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, token, isAuthenticated } = useAppContext();

    // Debug logging
    console.log('🔍 PaymentScreen - Component mounted');
    console.log('🔍 PaymentScreen - isAuthenticated:', isAuthenticated);
    console.log('🔍 PaymentScreen - user:', user);
    console.log('🔍 PaymentScreen - location.state:', location.state);
    const [selectedPayment, setSelectedPayment] = useState('card');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [trackingId, setTrackingId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const {
        formData,
        station,
        cartItems = [],
        selectedFuelFriend,
        subscriptionPlan,
        tip,
        additionalVehicles,
        breakdown
    } = location.state || {};

    // Safety check - redirect if not authenticated
    if (!isAuthenticated) {
        console.log('🔍 PaymentScreen - Not authenticated, redirecting to login');
        localStorage.setItem('redirectAfterLogin', '/payment');
        navigate('/login');
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Redirecting to login...</p>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                </div>
            </div>
        );
    }

    // Safety check - redirect if no state data
    if (!location.state) {
        console.log('🔍 PaymentScreen - No state data, redirecting to home');
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
            reviewCount: 128,
            imageUrl: '/brand1.png',
            bannerUrl: '/brand1.png',
            logoUrl: '/logo-green.png',
            groceries: [],
            fuelFriends: []
        },
        cartItems: cartItems || [],
        selectedFuelFriend: selectedFuelFriend || {
            id: 'default-friend',
            name: 'Fuel Friend',
            avatarUrl: '/fuel friend.png'
        },
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
    const vehicleType: 'car' | 'suv' = (formData?.fuelType || '').toLowerCase().includes('suv') || (formData?.fuelType || '').toLowerCase().includes('truck') ? 'suv' : 'car';

    // Determine if user is in UK or US based on location
    const userCity = user?.city?.toLowerCase() || '';
    const isUK = userCity.includes('london') ||
        userCity.includes('uk') ||
        userCity.includes('england') ||
        userCity.includes('scotland') ||
        userCity.includes('wales') ||
        userCity.includes('ireland');

    // Check API health on component mount
    useEffect(() => {
        const checkAPI = async () => {
            try {
                await apiHealthCheck();
                console.log('API connection successful');
            } catch (error) {
                console.log('API connection failed:', error);
            }
        };
        checkAPI();
    }, []);

    const handlePlaceOrder = async () => {
        console.log('🔍 Place Order clicked - User state:', user);
        console.log('🔍 User ID:', user?.id);
        console.log('🔍 Token:', token);

        // Allow guest browsing but require authentication for order placement
        if (!user) {
            console.log('❌ No user found, redirecting to login');
            // Store the current checkout state and redirect to login
            const checkoutState = {
                formData,
                station,
                cartItems,
                selectedFuelFriend,
                subscriptionPlan,
                tip,
                additionalVehicles,
                breakdown
            };

            // Store checkout state in sessionStorage
            sessionStorage.setItem('pendingCheckout', JSON.stringify(checkoutState));

            // Store redirect URL
            localStorage.setItem('redirectAfterLogin', '/payment');

            alert('Please login to complete your order');
            navigate('/login');
            return;
        }

        if (!station?.id) {
            alert('Station information missing. Please go back and select a station.');
            navigate('/home');
            return;
        }

        setIsProcessing(true);
        try {
            // Simulate payment processing with delay
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

            // Determine if user is in UK or US based on location or other factors
            // For now, we'll use a simple heuristic based on user data
            // isUK is defined at component scope

            // Determine tax based on region
            const taxRate = isUK ? 0.20 : 0.08; // 20% VAT for UK, 8% sales tax for US
            const orderTotal = breakdown?.total || 0;
            const taxAmount = orderTotal * taxRate;
            const grandTotal = orderTotal + taxAmount;

            // Generate order data
            const orderData: any = {
                customerId: user.id.toString(),
                stationId: station.id.toString(),
                deliveryAddress: formData?.address || user?.address || user?.city || 'Address not provided',
                deliveryPhone: formData?.phoneNumber || user.phone || '1234567890',
                fuelType: formData?.fuelType || 'Premium',
                fuelQuantity: (formData?.quantity?.replace(' liters', '') || '10').toString(),
                fuelCost: (breakdown?.fuelCost || 0).toFixed(2),
                convenienceItemsCost: (breakdown?.convenienceItemsCost || 0).toFixed(2),
                serviceFee: (breakdown?.serviceFee || 0).toFixed(2),
                nonSubscriberFee: (breakdown?.nonSubscriberFee || 0).toFixed(2),
                subscriptionPlanId: subscriptionPlan?.id || null,
                subscriptionCost: (breakdown?.subscriptionPlan?.price || 0).toFixed(2),
                additionalVehicles: additionalVehicles || 0,
                additionalVehicleCost: (breakdown?.additionalVehicleCost || 0).toFixed(2),
                vat: (breakdown?.vat || 0).toFixed(2),
                tip: (tip || 0).toFixed(2),
                totalAmount: orderTotal.toFixed(2),
                taxAmount: taxAmount.toFixed(2),
                grandTotal: grandTotal.toFixed(2),
                vehicleType: vehicleType,
                fuelFriendId: selectedFuelFriend?.id || '1',
                fuelFriendName: selectedFuelFriend?.name || 'John Doe',
                fuelFriendPhoto: selectedFuelFriend?.avatarUrl || '/fuel friend.png',
                orderStatus: 'pending',
                paymentMethod: selectedPayment === 'card' ? 'credit_card' : selectedPayment,
                paymentStatus: 'paid',
                orderDate: new Date().toISOString(),
                estimatedDeliveryTime: formData?.deliveryTime || 'Instant order',
                orderType: formData?.orderType || 'instant',
                cartItems: cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: parseFloat(item.price),
                    quantity: parseInt(item.quantity)
                })),
                currency: isUK ? 'GBP' : 'USD',
                taxRate: taxRate,
                taxLabel: isUK ? 'VAT' : 'Sales Tax',
                trackingNumber: `FF-${Math.floor(100000 + Math.random() * 900000)}`, // Generate tracking ID like FF-782190
                status: 'on_the_way', // Changed from 'PAID' to 'on_the_way' for proper tracking
                timestamp: new Date().toISOString(),
                // Add fuelfriend object for TrackOrderScreen compatibility
                fuelfriend: {
                    name: selectedFuelFriend?.name || 'John Doe',
                    location: formData?.address || user?.address || user?.city || 'On the way to your location',
                    phone: formData?.phoneNumber || user.phone || '1234567890',
                    avatar: selectedFuelFriend?.avatarUrl || '/fuel friend.png'
                }
            };

            console.log('🔍 Order data being sent:', {
                customerId: orderData.customerId,
                stationId: orderData.stationId,
                vehicleId: orderData.vehicleId,
                fuelFriendId: orderData.fuelFriendId,
                user: user,
                userVehicles: user?.vehicles
            });

            // Add optional fields only if they have values
            if (selectedFuelFriend?.id) {
                orderData.fuelFriendId = selectedFuelFriend.id.toString();
            }

            // Get vehicle ID from user data or create default vehicle
            let vehicleId = null;
            if (user?.vehicles && user.vehicles.length > 0) {
                const primaryVehicle = user.vehicles[0]; // Just use first vehicle since no isPrimary property
                vehicleId = primaryVehicle?.id;
            }

            // If no vehicle found, try to get from API or use a default
            if (!vehicleId && user?.id) {
                console.log('⚠️ No vehicle in user context, will create order without vehicleId');
                // Backend will handle null vehicleId
            }

            if (vehicleId) {
                orderData.vehicleId = vehicleId.toString();
                console.log('✅ Vehicle ID added to order:', vehicleId);
            } else {
                console.log('⚠️ No vehicle found for user, order will be created without vehicleId');
            }

            // Simulate successful order creation
            // In real implementation, this would call the API
            const result = {
                success: true,
                trackingNumber: orderData.trackingNumber,
                orderId: `ORD-${Date.now()}`,
                ...orderData
            };

            if (result) {
                setTrackingId(result.trackingNumber);

                // Store order details for receipt
                sessionStorage.setItem('lastOrder', JSON.stringify(result));

                // Verify the data was stored
                const storedOrder = sessionStorage.getItem('lastOrder');
                console.log('✅ Order stored in sessionStorage:', storedOrder);

                console.log('✅ Order created successfully, showing success modal');

                // Show success modal and confetti
                setShowSuccessModal(true);
                setShowConfetti(true);
                // Stop processing but don't navigate yet
                setIsProcessing(false);
            } else {
                throw new Error('Failed to create order');
            }
        } catch (error) {
            console.error('Order creation failed:', error);
            alert('Failed to create order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <AnimatedPage>
            <div className="bg-white dark:bg-black min-h-screen pb-24">
                {/* Debug indicator */}
                <div className="bg-blue-500 text-white text-center py-1 text-xs">
                    PaymentScreen - Processing: {isProcessing ? 'Yes' : 'No'} | User: {user ? 'Found' : 'Not Found'}
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800">
                    <TapEffectButton
                        onClick={() => navigate("/home")}
                        className="p-2 -ml-2"
                    >
                        <img src="/Back.png" alt="Back" className="w-5 h-5" />
                    </TapEffectButton>
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Payment</h1>
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
                            <span className="text-sm text-gray-600 dark:text-gray-400 mt-2">Order</span>
                        </div>

                        {/* Connector 1-2 */}
                        <div className="flex-1 h-0.5 mx-2 bg-green-500"></div>

                        {/* Step 2 - Completed */}
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500 border-2 border-green-500 text-white">
                                <Check className="w-6 h-6" />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 mt-2">Order summary</span>
                        </div>

                        {/* Connector 2-3 */}
                        <div className="flex-1 h-0.5 mx-2 bg-green-500"></div>

                        {/* Step 3 - Current */}
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500 border-2 border-green-500 text-white">
                                <span className="font-semibold">3</span>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 mt-2">Payment</span>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="px-4 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Payment Method</h2>

                    {/* Credit Card Option */}
                    <div className="mb-4">
                        <TapEffectButton
                            onClick={() => setSelectedPayment('card')}
                            className={`w-full p-4 border-2 rounded-3xl transition-all duration-200 mobile-button ${selectedPayment === 'card'
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'card'
                                        ? 'border-green-500 bg-green-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                        }`}>
                                        {selectedPayment === 'card' && (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                                {/* Visa Logo */}
                                <img
                                    src="/Visa.png"
                                    alt="Visa"
                                    className="h-6 w-auto"
                                />
                            </div>
                        </TapEffectButton>
                    </div>

                    {/* PayPal Option */}
                    <div className="mb-4">
                        <TapEffectButton
                            onClick={() => setSelectedPayment('paypal')}
                            className={`w-full p-4 border-2 rounded-3xl transition-all duration-200 mobile-button ${selectedPayment === 'paypal'
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'paypal'
                                        ? 'border-green-500 bg-green-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                        }`}>
                                        {selectedPayment === 'paypal' && (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                                {/* PayPal Logo */}
                                <img
                                    src="/paypal.png"
                                    alt="PayPal"
                                    className="h-6 w-auto"
                                />
                            </div>
                        </TapEffectButton>
                    </div>

                    {/* Apple Pay Option */}
                    <div className="mb-4">
                        <TapEffectButton
                            onClick={() => setSelectedPayment('apple')}
                            className={`w-full p-4 border-2 rounded-3xl transition-all duration-200 mobile-button ${selectedPayment === 'apple'
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'apple'
                                        ? 'border-green-500 bg-green-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                        }`}>
                                        {selectedPayment === 'apple' && (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                                {/* Apple Pay Logo */}
                                <img
                                    src="/apple.svg"
                                    alt="Apple Pay"
                                    className="h-6 w-auto"
                                />
                            </div>
                        </TapEffectButton>
                    </div>

                    {/* Add New Payment Method */}
                    <TapEffectButton className="w-full p-4 border-2 border-dashed border-gray-300 rounded-3xl text-gray-600 hover:border-green-300 hover:text-green-600 transition-all duration-200 mobile-button">
                        <div className="flex items-center justify-center space-x-2">
                            <Plus className="w-5 h-5" />
                            <span className="font-medium">Add New Payment Method</span>
                        </div>
                    </TapEffectButton>
                </div>

                {/* Order Summary */}
                <div className="mx-4 mb-6">
                    <CheckoutBreakdownComponent
                        breakdown={fallbackData.breakdown}
                        isNonSubscriber={isNonSubscriber}
                        vehicleType={vehicleType}
                    />
                </div>

                {/* Place Order Button */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
                    <TapEffectButton
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="w-full bg-green-500 text-white py-4 rounded-full text-lg font-semibold disabled:opacity-50 mobile-button haptic-button"
                        style={{ borderRadius: '9999px' }}
                    >
                        {isProcessing ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </div>
                        ) : (
                            'Place Order'
                        )}
                    </TapEffectButton>
                </div>


                {/* Processing Overlay */}
                {isProcessing && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center">
                            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Order</h3>
                            <p className="text-gray-600">Please wait while we process your payment...</p>
                        </div>
                    </div>
                )}

                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center">
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Success Icon */}
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check className="w-10 h-10 text-white" />
                            </div>

                            {/* Success Message */}
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Your payment has Been made Successfully
                            </h2>

                            {/* Tracking ID */}
                            <p className="text-gray-600 mb-8">
                                Tracking ID No: {trackingId || '#12345'}
                            </p>

                            {/* Detailed receipt information */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                                <h3 className="font-semibold text-gray-900 mb-2">Receipt Details</h3>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="text-gray-900">${breakdown?.total?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax (VAT 20% for UK / Sales Tax 8% for US):</span>
                                        <span className="text-gray-900">${((breakdown?.total || 0) * (isUK ? 0.20 : 0.08)).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                        <span className="font-semibold text-gray-900">Grand Total:</span>
                                        <span className="font-semibold text-gray-900">${((breakdown?.total || 0) * (1 + (isUK ? 0.20 : 0.08))).toFixed(2)}</span>
                                    </div>
                                    <div className="pt-2 mt-2 border-t border-gray-200">
                                        <div className="text-xs text-gray-500">Status:</div>
                                        <div className="font-semibold text-green-600">PAID</div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => {
                                        setShowSuccessModal(false);
                                        navigate('/track');
                                    }}
                                    className="w-full bg-green-500 text-white py-4 rounded-full text-lg font-semibold"
                                >
                                    Track Order
                                </button>

                                <button
                                    onClick={() => {
                                        setShowSuccessModal(false);
                                        navigate('/home');
                                    }}
                                    className="w-full text-green-500 text-lg font-medium underline rounded-full py-4"
                                >
                                    Back To Home
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confetti Effect */}
                <ConfettiEffect show={showConfetti} />
            </div>
        </AnimatedPage>
    );
};

export default PaymentScreen;