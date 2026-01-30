import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check } from 'lucide-react';

interface PasswordChangeSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PasswordChangeSuccessModal = ({ isOpen, onClose }: PasswordChangeSuccessModalProps) => {
    const navigate = useNavigate();

    const handleBackToHome = () => {
        onClose();
        navigate('/home');
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                {/* Success Icon */}
                <div className="flex justify-center mb-6 mt-4">
                    <div className="w-16 h-16 bg-[#3AC36C] rounded-full flex items-center justify-center">
                        <Check size={32} className="text-white" />
                    </div>
                </div>

                {/* Success Message */}
                <div className="text-center mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        Your password has been
                    </h2>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Changed successfully
                    </h2>
                </div>

                {/* Back to Home Button */}
                <button
                    onClick={handleBackToHome}
                    className="w-full py-4 bg-[#3AC36C] text-white rounded-full font-semibold text-base hover:bg-[#2ea85a] transition-colors"
                >
                    Back To Home
                </button>
            </div>
        </div>
    );
};

export default PasswordChangeSuccessModal;