import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronRight, MessageCircle, AlertTriangle } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import TapEffectButton from '../components/TapEffectButton';

const SupportHelpScreen = () => {
    const navigate = useNavigate();
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);

    const faqs = [
        {
            question: "How does the fuel delivery service work?",
            answer: "Our fuel delivery service connects you with nearby fuel stations and fuel friends who can deliver fuel to your location. Simply select a station, choose your fuel type and amount, and we'll deliver it to your vehicle."
        },
        {
            question: "Can I order Groceries with fuel?",
            answer: "Yes! You can add groceries and snacks to your fuel order. Browse our selection of convenience items and add them to your cart along with your fuel purchase."
        },
        {
            question: "How does the fuel delivery service work?",
            answer: "Our delivery process is simple: place your order, track your delivery in real-time, and our certified delivery partner will arrive at your location with your fuel and any additional items you ordered."
        },
        {
            question: "How do I manage my profile?",
            answer: "You can manage your profile by going to Settings > My Profile. There you can update your personal information, vehicle details, and delivery preferences."
        },
        {
            question: "What payment methods are accepted?",
            answer: "We accept all major credit cards, debit cards, digital wallets, and mobile payment methods. You can manage your payment methods in the Settings section."
        }
    ];

    const toggleFAQ = (index: number) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    const handleLiveChat = () => {
        navigate('/live-chat');
    };

    const handleReportIssue = () => {
        navigate('/report-issue');
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-white">
                <header className="p-4 flex items-center bg-white border-b border-gray-100">
                    <TapEffectButton onClick={() => navigate("/home")} className="p-2 -ml-2">
                        <img src="/Back.png" alt="Back" className="w-5 h-5" />
                    </TapEffectButton>
                    <h2 className="text-lg font-semibold text-center flex-grow -ml-10 text-gray-900">
                        Support & help
                    </h2>
                </header>

                <div className="p-4">
                    <p className="text-gray-600 text-sm mb-6">
                        Need help with Fuelfriendly? Find answers to common questions or contact our support team.
                    </p>

                    {/* FAQ Section */}
                    <div className="mb-8">
                        <h3 className="text-gray-900 font-medium mb-4">Frequently Asked Questions</h3>
                        
                        <div className="space-y-2">
                            {faqs.map((faq, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-gray-900 font-medium text-sm pr-2">
                                            {faq.question}
                                        </span>
                                        <ChevronDown 
                                            className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
                                                expandedFAQ === index ? 'rotate-180' : ''
                                            }`} 
                                        />
                                    </button>
                                    
                                    {expandedFAQ === index && (
                                        <div className="px-4 pb-4 border-t border-gray-100">
                                            <p className="text-gray-600 text-sm leading-relaxed pt-3">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Support Section */}
                    <div>
                        <h3 className="text-gray-900 font-medium mb-4">Contact Support</h3>
                        
                        <div className="space-y-3">
                            <button
                                onClick={handleLiveChat}
                                className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <MessageCircle className="w-5 h-5 text-gray-600 mr-3" />
                                <span className="text-gray-900 font-medium">Live Chat Support</span>
                            </button>
                            
                            <button
                                onClick={handleReportIssue}
                                className="w-full flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <AlertTriangle className="w-5 h-5 text-gray-600 mr-3" />
                                <span className="text-gray-900 font-medium">Report an Issue</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default SupportHelpScreen;