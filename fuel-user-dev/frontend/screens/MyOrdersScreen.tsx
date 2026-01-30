import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, MessageSquare, CheckCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { apiGetOrders } from '../services/api';
import { useAppContext } from '../context/AppContext';
import LottieAnimation from '../components/LottieAnimation';
import loadingAnimation from '../assets/animations/loading.json';
import AnimatedPage from '../components/AnimatedPage';
import TapEffectButton from '../components/TapEffectButton';

type Tab = 'ongoing' | 'history';

// FIX: Added an interface for component props to fix key prop issue.

// Dispute Success Modal Component
const DisputeSuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const navigate = useNavigate();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#3AC36C] flex items-center justify-center shadow-lg shadow-green-200">
                        <CheckCircle size={24} color="white" strokeWidth={3} />
                    </div>
                </div>
                <h3 className="text-lg font-bold text-[#3F4249] mb-8">Order disputed Successfully!</h3>
                <button
                    onClick={onClose}
                    className="w-full py-4 bg-[#3AC36C] text-white font-bold rounded-full shadow-md text-base transition-transform active:scale-95 hover:bg-[#2ea85a]"
                >
                    Back to Order List
                </button>
            </div>
        </div>
    );
};

// Dispute Modal Component
interface DisputeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    order: Order | null;
}

const DisputeModal = ({ isOpen, onClose, onConfirm, order }: DisputeModalProps) => {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm animate-in fade-in zoom-in duration-200">
                <div className="flex flex-col items-center text-center">
                    {/* Dynamic Avatar */}
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-100 mb-4 shadow-sm">
                        <img
                            src={order.fuelFriendPhoto || order.fuelFriend?.avatarUrl || order.fuelfriend?.avatar || '/fuel friend.png'}
                            alt={order.fuelFriendName || order.fuelFriend?.name || order.fuelfriend?.name || 'Fuel Friend'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='32' fill='%23e5e7eb'/%3E%3Cpath d='M32 16a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM20 48a12 12 0 0 1 24 0H20z' fill='%23999'/%3E%3C/svg%3E";
                            }}
                        />
                    </div>

                    {/* Dynamic Name */}
                    <h3 className="text-xl font-bold text-[#3F4249] mb-2">
                        {order.fuelFriendName || order.fuelFriend?.name || order.fuelfriend?.name || 'Fuel Friend'}
                    </h3>

                    <p className="text-gray-600 mb-6 px-4">
                        Please confirm Do you wish to dispute this Job
                    </p>

                    <div className="flex space-x-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-3 bg-[#FF4D4D] text-white font-bold rounded-full hover:bg-[#ff3333] shadow-md transition-colors"
                        >
                            Dispute
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
interface OrderCardProps {
    order: Order;
    type: Tab;
    onDispute?: (order: Order) => void;
    onRequestCompleted?: (order: Order) => void;
}

const OrderCard = ({ order, type, onDispute, onRequestCompleted }: OrderCardProps) => {
    return (
        <div className="bg-white p-5 rounded-2xl mb-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
                <img
                    src={order.fuelFriendPhoto || order.fuelFriend?.avatarUrl || order.fuelfriend?.avatar || '/fuel friend.png'}
                    alt={order.fuelFriendName || order.fuelFriend?.name || 'Fuel Friend'}
                    className="w-14 h-14 rounded-full border-2 border-gray-100 object-cover"
                    onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='32' fill='%23e5e7eb'/%3E%3Cpath d='M32 16a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM20 48a12 12 0 0 1 24 0H20z' fill='%23999'/%3E%3C/svg%3E";
                    }}
                />
                <div className="ml-4 flex-grow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-[#3F4249] text-base">
                                {order.fuelFriendName || order.fuelFriend?.name || order.fuelfriend?.name || 'Fuel Friend'}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                                <MapPin size={14} className="mr-1 text-[#FF4D4D]" />
                                <span className="truncate max-w-[150px]">
                                    {order.deliveryAddress || order.fuelFriendLocation || order.fuelFriend?.location || order.fuelfriend?.location || 'Location'}
                                </span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 mb-1">Tracking no:</p>
                            <p className="text-xs font-semibold text-gray-600">
                                {order.trackingNumber || order.trackingNo || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 flex space-x-3">
                {type === 'ongoing' ? (
                    <>
                        <button
                            onClick={() => onRequestCompleted && onRequestCompleted(order)}
                            className="flex-1 bg-[#3AC36C] text-white py-2.5 rounded-full text-sm font-bold shadow-md active:scale-95 transition-transform"
                        >
                            Request Completed
                        </button>
                        <button
                            onClick={() => onDispute && onDispute(order)}
                            className="flex-1 bg-white border border-[#3AC36C] text-[#3AC36C] py-2.5 rounded-full text-sm font-bold active:scale-95 transition-transform"
                        >
                            Dispute
                        </button>
                    </>
                ) : (
                    <div className={`w-full text-right py-2 text-sm font-bold ${order.status?.toLowerCase() === 'delivered' || order.status?.toLowerCase() === 'completed'
                        ? 'text-[#3AC36C]'
                        : 'text-[#FF4D4D]'
                        }`}>
                        {order.status || 'History'}
                    </div>
                )}
            </div>
        </div>
    );
};

// Rating Modal Component
interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, feedback: string) => void;
    order: Order | null;
}

const RatingModal = ({ isOpen, onClose, onSubmit, order }: RatingModalProps) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl transform transition-all scale-100">
                <div className="flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold text-[#3F4249] mb-4">Rate Service</h3>

                    {/* Dynamic Avatar */}
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-100 mb-3 shadow-sm relative">
                        <img
                            src={order.fuelFriendPhoto || order.fuelFriend?.avatarUrl || order.fuelfriend?.avatar || '/fuel friend.png'}
                            alt={order.fuelFriendName || order.fuelFriend?.name || order.fuelfriend?.name || 'Fuel Friend'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='32' fill='%23e5e7eb'/%3E%3Cpath d='M32 16a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM20 48a12 12 0 0 1 24 0H20z' fill='%23999'/%3E%3C/svg%3E";
                            }}
                        />
                        <div className="absolute bottom-0 right-0 bg-[#3AC36C] rounded-full p-1 border-2 border-white">
                            <CheckCircle size={12} color="white" />
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-[#3F4249] mb-1">
                        {order.fuelFriendName || order.fuelFriend?.name || order.fuelfriend?.name || 'Fuel Friend'}
                    </h3>
                    <p className="text-gray-400 text-sm mb-6">How was your fuel pickup?</p>

                    {/* Stars */}
                    <div className="flex space-x-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className={`focus:outline-none transition-all duration-300 ${star <= rating
                                    ? "scale-110 text-yellow-400 drop-shadow-sm"
                                    : "text-gray-300 hover:scale-125 hover:text-yellow-200"
                                    } active:scale-90 active:rotate-12`}
                            >
                                <Star
                                    size={32}
                                    fill={star <= rating ? "#FFD700" : "none"}
                                    color={star <= rating ? "#FFD700" : "#D1D5DB"}
                                    strokeWidth={star <= rating ? 0 : 1.5}
                                    className="filter drop-shadow-sm"
                                />
                            </button>
                        ))}
                    </div>

                    {/* Feedback Input */}
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Additional comments... (Optional)"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 mb-6 focus:outline-none focus:ring-2 focus:ring-[#3AC36C] resize-none"
                        rows={3}
                    />

                    <div className="flex space-x-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-50 transition-colors active:scale-95 duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSubmit(rating, feedback)}
                            disabled={rating === 0}
                            className={`flex-1 py-3 text-white font-bold rounded-full shadow-md transition-all active:scale-95 duration-200 ${rating === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#3AC36C] hover:bg-[#2ea85a]'
                                }`}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MyOrdersScreen = () => {
    const navigate = useNavigate();
    const { user, token } = useAppContext();
    const [activeTab, setActiveTab] = useState<Tab>('ongoing');
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Dispute Modal State
    const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
    const [isDisputeSuccessOpen, setIsDisputeSuccessOpen] = useState(false);
    const [selectedOrderForDispute, setSelectedOrderForDispute] = useState<Order | null>(null);

    // Rating Modal State
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [selectedOrderForRating, setSelectedOrderForRating] = useState<Order | null>(null);

    const handleDispute = (order: Order) => {
        setSelectedOrderForDispute(order);
        setIsDisputeModalOpen(true);
    };

    const handleRequestCompleted = (order: Order) => {
        // Open rating modal instead of navigating
        setSelectedOrderForRating(order);
        setIsRatingModalOpen(true);
    };

    const submitRating = async (rating: number, feedback: string) => {
        if (!selectedOrderForRating) return;

        console.log(`Rating order ${selectedOrderForRating.id}: ${rating} stars, feedback: ${feedback}`);

        // Update local state
        const updatedOrders = orders.map(o => {
            if (o.id === selectedOrderForRating.id || o.trackingNumber === selectedOrderForRating.trackingNumber) {
                return { ...o, status: 'completed', rating, feedback };
            }
            return o;
        });

        setOrders(updatedOrders);

        // Update localStorage
        if (user?.id) {
            const localOrdersStr = localStorage.getItem(`userOrders_${user.id}`);
            if (localOrdersStr) {
                const localOrders = JSON.parse(localOrdersStr);
                const updatedLocal = localOrders.map((o: any) => {
                    if (o.id === selectedOrderForRating.id || o.trackingNumber === selectedOrderForRating.trackingNumber) {
                        return { ...o, status: 'completed', rating, feedback };
                    }
                    return o;
                });
                localStorage.setItem(`userOrders_${user.id}`, JSON.stringify(updatedLocal));
            }
        }

        setIsRatingModalOpen(false);
        // Switch to history tab to show the completed order
        setActiveTab('history');
    };

    const confirmDispute = () => {
        if (!selectedOrderForDispute) return;

        console.log("Disputing order:", selectedOrderForDispute.id);

        // Update local state immediately to remove from ongoing list
        const updatedOrders = orders.map(o => {
            if (o.id === selectedOrderForDispute.id || o.trackingNumber === selectedOrderForDispute.trackingNumber) {
                // Change status to cancelled or disputed so it moves to History tab
                return { ...o, status: 'cancelled' };
            }
            return o;
        });
        setOrders(updatedOrders);

        // Update localStorage as well
        if (user?.id) {
            const localOrdersStr = localStorage.getItem(`userOrders_${user.id}`);
            if (localOrdersStr) {
                const localOrders = JSON.parse(localOrdersStr);
                const updatedLocal = localOrders.map((o: any) => {
                    if (o.id === selectedOrderForDispute.id || o.trackingNumber === selectedOrderForDispute.trackingNumber) {
                        return { ...o, status: 'cancelled' };
                    }
                    return o;
                });
                localStorage.setItem(`userOrders_${user.id}`, JSON.stringify(updatedLocal));
            }
        }

        setIsDisputeModalOpen(false);
        setTimeout(() => setIsDisputeSuccessOpen(true), 300); // Small delay for smooth transition
        setActiveTab('history');
    };
    useEffect(() => {
        // Check if user is logged in via token
        if (!token || !user) {
            setIsLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                // 1. Get orders from API (With Fast Timeout)
                let apiData = [];
                try {
                    // Create a promise that rejects after 1.5 seconds
                    const timeoutPromise = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('API Timeout')), 1500)
                    );

                    // Race between API call and timeout
                    // @ts-ignore - Promise race type mismatch
                    apiData = await Promise.race([
                        apiGetOrders(),
                        timeoutPromise
                    ]);

                    if (!Array.isArray(apiData)) apiData = [];
                } catch (err) {
                    console.log("API fetch slow or failed, using local data only.");
                }

                // 2. Get local orders (from TrackOrderScreen/PaymentScreen auto-save)
                const localOrdersStr = localStorage.getItem(`userOrders_${user.id}`);
                const localOrders = localOrdersStr ? JSON.parse(localOrdersStr) : [];

                console.log('📦 API Orders:', apiData.length);
                console.log('💾 Local Orders:', localOrders.length);

                // 3. Merge orders (prefer local for most recent status)
                // Filter out duplicates based on trackingNumber or id
                const mergedOrders = [...localOrders, ...apiData];

                // Remove duplicates (keep first occurrence which is local orders - likely more recent in dev)
                const uniqueOrders = mergedOrders.filter((order, index, self) =>
                    index === self.findIndex((t) => (
                        (t.trackingNumber && t.trackingNumber === order.trackingNumber) ||
                        (t.id && t.id === order.id)
                    ))
                );

                setOrders(uniqueOrders);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, [token, user]);

    // Show login prompt if not logged in
    if (!token || !user) {
        return (
            <AnimatedPage>
                <div className="min-h-screen flex flex-col bg-white">
                    <header className="p-4 flex items-center sticky top-0 bg-white z-10">
                        <TapEffectButton onClick={() => navigate('/home')} className="p-2 rounded-full hover:bg-gray-100">
                            <img src="/Back.png" alt="Back" className="w-5 h-5" />
                        </TapEffectButton>
                        <h2 className="text-xl font-bold text-center flex-grow -ml-10">My Orders</h2>
                    </header>

                    <div className="flex-1 flex flex-col items-center justify-center px-4">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h3>
                            <p className="text-gray-600 mb-8 max-w-sm">
                                Please login to view your orders and track your fuel deliveries.
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-[#3AC36C] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#2ea85a] transition-colors"
                            >
                                Login Now
                            </button>
                        </div>
                    </div>
                </div>
            </AnimatedPage>
        );
    }

    const ongoingOrders = Array.isArray(orders) ? orders.filter(o =>
        ['pending', 'confirmed', 'in_progress', 'on_the_way', 'ongoing'].includes(o.status?.toLowerCase())
    ) : [];
    const historyOrders = Array.isArray(orders) ? orders.filter(o =>
        ['completed', 'cancelled', 'delivered', 'rejected'].includes(o.status?.toLowerCase())
    ) : [];

    return (
        <AnimatedPage>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <header className="p-4 flex items-center sticky top-0 bg-white z-10 shadow-sm">
                    <TapEffectButton onClick={() => navigate('/home')} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <img src="/Back.png" alt="Back" className="w-5 h-5" />
                    </TapEffectButton>
                    <h2 className="text-xl font-bold text-center flex-grow -ml-10 text-[#3F4249]">Manage Orders</h2>
                </header>

                <div className="px-4">
                    <div className="flex border-b-2 border-gray-200">
                        <button
                            onClick={() => setActiveTab('ongoing')}
                            className={`flex-1 py-4 font-bold transition-all duration-200 relative ${activeTab === 'ongoing'
                                ? 'text-[#3AC36C] border-b-3 border-[#3AC36C]'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Ongoing
                            {activeTab === 'ongoing' && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#3AC36C] rounded-t-full"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 py-4 font-bold transition-all duration-200 relative ${activeTab === 'history'
                                ? 'text-[#3AC36C] border-b-3 border-[#3AC36C]'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            History
                            {activeTab === 'history' && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#3AC36C] rounded-t-full"></div>
                            )}
                        </button>
                    </div>
                </div>

                <div className="p-4 flex-grow overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <LottieAnimation animationData={loadingAnimation} width={100} height={100} />
                        </div>
                    ) : (
                        activeTab === 'ongoing' ?
                            (ongoingOrders.length > 0 ? ongoingOrders.map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    type="ongoing"
                                    onDispute={handleDispute}
                                    onRequestCompleted={handleRequestCompleted}
                                />
                            )) : (
                                <div className="flex flex-col items-center mt-8">
                                    <p className="text-center text-gray-500 mt-2">No ongoing orders.</p>
                                </div>
                            ))
                            :
                            (historyOrders.length > 0 ? historyOrders.map(order => <OrderCard key={order.id} order={order} type="history" />) : (
                                <div className="flex flex-col items-center mt-8">
                                    <p className="text-center text-gray-500 mt-2">No past orders.</p>
                                </div>
                            ))
                    )}
                </div>

                {/* Dispute Modal */}
                <DisputeModal
                    isOpen={isDisputeModalOpen}
                    onClose={() => setIsDisputeModalOpen(false)}
                    onConfirm={confirmDispute}
                    order={selectedOrderForDispute}
                />

                <DisputeSuccessModal
                    isOpen={isDisputeSuccessOpen}
                    onClose={() => setIsDisputeSuccessOpen(false)}
                />

                {/* Rating Modal */}
                <RatingModal
                    isOpen={isRatingModalOpen}
                    onClose={() => setIsRatingModalOpen(false)}
                    onSubmit={submitRating}
                    order={selectedOrderForRating}
                />
            </div>
        </AnimatedPage>
    );
};

export default MyOrdersScreen;
