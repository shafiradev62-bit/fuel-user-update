import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    AlertTriangle, 
    ChevronDown, 
    Upload, 
    X, 
    ArrowLeft, 
    AlertCircle,
    User
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AnimatedPage from '../components/AnimatedPage';
import TapEffectButton from '../components/TapEffectButton';

const ReportIssueScreen = () => {
    const navigate = useNavigate();
    const { user } = useAppContext();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(user);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!userData || !token) {
            setIsLoggedIn(false);
            return;
        }
        
        try {
            const parsedUser = JSON.parse(userData);
            setCurrentUser(parsedUser);
            setIsLoggedIn(true);
        } catch (e) {
            console.error('Failed to parse user data:', e);
            setIsLoggedIn(false);
        }
    }, []);

    const handleLoginRedirect = () => {
        // Store current location for redirect after login
        localStorage.setItem('redirectAfterLogin', '/report-issue');
        navigate('/login');
    };

    const categories = [
        'Select a Category',
        'Fuel Delivery Problem',
        'Payment Issue',
        'App Technical Problem',
        'Account Access',
        'Other'
    ];

    const handleCategorySelect = (category: string) => {
        if (category !== 'Select a Category') {
            setSelectedCategory(category);
        }
        setShowCategoryDropdown(false);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files).slice(0, 3 - attachments.length);
            setAttachments(prev => [...prev, ...newFiles]);
        }
        // Reset input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddPhoto = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async () => {
        if (!isLoggedIn) {
            handleLoginRedirect();
            return;
        }

        if (!selectedCategory || selectedCategory === 'Select a Category' || !description.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            navigate('/report-submitted');
        }, 2000);
    };

    const characterCount = description.length;
    const minCharacters = 10;

    // Close dropdown when clicking outside
    const handleDropdownBlur = () => {
        setTimeout(() => setShowCategoryDropdown(false), 150);
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-white">
                <header className="p-4 flex items-center bg-white border-b border-gray-100">
                    <TapEffectButton onClick={() => navigate('/support-help')} className="p-2 -ml-2">
                        <img src="/Back.png" alt="Back" className="w-5 h-5" />
                    </TapEffectButton>
                    <h2 className="text-lg font-semibold text-center flex-grow -ml-10 text-gray-900">
                        Report an Issue
                    </h2>
                </header>

                <div className="p-4 space-y-6">
                    {!isLoggedIn ? (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                                <p className="text-yellow-800 text-sm">You are not logged in. <button onClick={handleLoginRedirect} className="text-[#3AC36C] font-medium underline">Login</button> to submit your report.</p>
                            </div>
                        </div>
                    ) : null}

                    <p className="text-gray-600 text-sm">
                        Please provide details about the issue you're experiencing. Our support team will review and respond as soon as possible.
                    </p>

                    {/* Issue Category */}
                    <div>
                        <label className="text-gray-900 font-medium mb-3 block">Issue Category</label>
                        <div className="relative">
                            <button
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                onBlur={handleDropdownBlur}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center justify-between focus:outline-none focus:border-[#3AC36C]"
                            >
                                <span className={selectedCategory && selectedCategory !== 'Select a Category' ? 'text-gray-900' : 'text-gray-500'}>
                                    {selectedCategory || 'Select a Category'}
                                </span>
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                                    showCategoryDropdown ? 'rotate-180' : ''
                                }`} />
                            </button>
                            
                            {showCategoryDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                    {categories.map((category, index) => (
                                        <button
                                            key={category}
                                            onClick={() => handleCategorySelect(category)}
                                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-900 ${
                                                index === 0 ? 'bg-[#3AC36C] text-white hover:bg-[#2ea85a]' : ''
                                            } ${
                                                index === categories.length - 1 ? 'rounded-b-lg' : ''
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-gray-900 font-medium mb-3 block">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please describe the issue in details..."
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3AC36C] resize-none text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            {characterCount}/{minCharacters} characters (minimum {minCharacters})
                        </p>
                    </div>

                    {/* Attachments */}
                    <div>
                        <label className="text-gray-900 font-medium mb-3 block">Attachments (Optional)</label>
                        
                        <div className="flex items-start gap-3">
                            {/* Uploaded Images */}
                            {attachments.map((file, index) => (
                                <div key={index} className="relative">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Attachment ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button
                                        onClick={() => removeAttachment(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            
                            {/* Add Image Button - only show if we have less than 3 attachments */}
                            {attachments.length < 3 && (
                                <button
                                    onClick={handleAddPhoto}
                                    className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-[#3AC36C] hover:text-[#3AC36C] transition-colors"
                                >
                                    <Upload size={20} />
                                    <span className="text-xs mt-1">Add</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full py-4 bg-[#3AC36C] text-white rounded-full font-semibold text-base hover:bg-[#2ea85a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ios-button active:scale-96"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </div>
                        ) : (
                            'Submit Report'
                        )}
                    </button>

                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        multiple
                        className="hidden"
                    />

                    {/* Show a simplified view when not logged in */}
                    {!isLoggedIn && (
                        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-start">
                                <User className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-blue-900 mb-1">Account Benefits</h4>
                                    <p className="text-sm text-blue-800">Logging in ensures our support team can contact you regarding your report and provide personalized assistance.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ReportIssueScreen;