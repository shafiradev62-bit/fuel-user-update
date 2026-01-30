import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { apiDeleteAccount } from '../services/api';
import AnimatedPage from '../components/AnimatedPage';
import ConfirmationModal from '../components/ConfirmationModal';

const AccountDeletionScreen = () => {
    const navigate = useNavigate();
    const { logout, user } = useAppContext();
    const [selectedReason, setSelectedReason] = useState('');
    const [showReasonDropdown, setShowReasonDropdown] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Check if user is logged in
    const isLoggedIn = !!user && !!localStorage.getItem('user');

    // Show login prompt if not logged in
    if (!isLoggedIn) {
        return (
            <AnimatedPage>
                <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
                    <div className="max-w-sm w-full text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h3>
                        <p className="text-gray-600 mb-8 max-w-sm">
                            Please login to manage your account deletion request.
                        </p>
                        <button 
                            onClick={() => navigate('/login')}
                            className="bg-[#3AC36C] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#2ea85a] transition-colors"
                        >
                            Login Now
                        </button>
                    </div>
                </div>
            </AnimatedPage>
        );
    }

    const deletionReasons = [
        'No longer need the service',
        'Facing technical issues',
        'Privacy concern',
        'App Technical Problem',
        'Found a better alternative',
        'Other'
    ];

    const handleReasonSelect = (reason: string) => {
        setSelectedReason(reason);
        setShowReasonDropdown(false);
    };

    const handleDropdownBlur = () => {
        setTimeout(() => setShowReasonDropdown(false), 150);
    };

    const handleDeleteAccount = () => {
        if (!user?.id) {
            alert('User not found. Please login again.');
            navigate('/login');
            return;
        }
        
        setShowConfirmModal(true);
    };
    
    const confirmDeleteAccount = async () => {
        setShowConfirmModal(false);
        setIsDeleting(true);
        
        try {
            await apiDeleteAccount(user.id, selectedReason);
            logout();
            navigate('/account-deleted');
        } catch (error: any) {
            console.error('Delete account error:', error);
            alert(error.message || 'Failed to delete account. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancel = () => {
        navigate('/settings');
    };

    return (
        <>
        <AnimatedPage>
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
                <div className="max-w-sm w-full text-center">
                    {/* Warning Icon */}
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Are you sure you want to delete your account?
                    </h2>
                    
                    {/* Warning Message */}
                    <p className="text-gray-600 text-sm mb-6">
                        This Action is permanent and cannot be undone.
                    </p>

                    {/* Deletion Details */}
                    <div className="text-left mb-6">
                        <p className="text-gray-900 font-medium text-sm mb-3">
                            Deleting your FuelFriendly account will:
                        </p>
                        <ul className="text-gray-600 text-sm space-y-2">
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                Remove all your personal data and saved information.
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                Cancel any active subscriptions or ongoing orders.
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                Erase your payment methods and transaction history.
                            </li>
                            <li className="flex items-start">
                                <span className="text-red-500 mr-2">•</span>
                                Disable access to the FuelFriend app and services.
                            </li>
                        </ul>
                    </div>

                    {/* Reason Dropdown */}
                    <div className="mb-6">
                        <label className="text-gray-900 font-medium text-sm mb-3 block text-left">
                            Tell us why you are leaving (Optional)
                        </label>
                        <div className="relative">
                            <button
                                onClick={() => setShowReasonDropdown(!showReasonDropdown)}
                                onBlur={handleDropdownBlur}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center justify-between focus:outline-none focus:border-red-500"
                            >
                                <span className={selectedReason ? 'text-gray-900' : 'text-gray-500'}>
                                    {selectedReason || 'Select...'}
                                </span>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                                    showReasonDropdown ? 'rotate-180' : ''
                                }`} />
                            </button>
                            
                            {showReasonDropdown && (
                                <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                    {deletionReasons.map((reason, index) => (
                                        <button
                                            key={reason}
                                            onClick={() => handleReasonSelect(reason)}
                                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-900 text-sm ${
                                                selectedReason === reason ? 'bg-[#3AC36C] text-white hover:bg-[#2ea85a]' : ''
                                            } ${
                                                index === 0 ? 'rounded-t-lg' : ''
                                            } ${
                                                index === deletionReasons.length - 1 ? 'rounded-b-lg' : ''
                                            }`}
                                        >
                                            {reason}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="w-full py-4 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? 'Deleting Account...' : 'Delete Account'}
                        </button>
                        
                        <button
                            onClick={handleCancel}
                            disabled={isDeleting}
                            className="w-full py-4 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </AnimatedPage>
        
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmDeleteAccount}
          title="Delete Account"
          message="Are you absolutely sure? This action cannot be undone and will permanently delete all your data."
          confirmText="Delete Account"
          cancelText="Cancel"
          type="warning"
        />
        </>
    );
};

export default AccountDeletionScreen;