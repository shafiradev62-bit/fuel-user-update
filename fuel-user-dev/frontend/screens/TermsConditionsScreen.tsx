import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import TapEffectButton from '../components/TapEffectButton';

const TermsConditionsScreen = () => {
    const navigate = useNavigate();

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-white">
                <header className="p-4 flex items-center bg-white border-b border-gray-100">
                    <TapEffectButton onClick={() => navigate('/settings')} className="p-2 -ml-2">
                        <img src="/Back.png" alt="Back" className="w-5 h-5" />
                    </TapEffectButton>
                    <h2 className="text-lg font-semibold text-center flex-grow -ml-10 text-gray-900">
                        Terms & Conditions
                    </h2>
                </header>

                <div className="p-4">
                    <p className="text-gray-500 text-sm mb-6">
                        Last Update 10 June 2024
                    </p>

                    <div className="space-y-6 text-sm">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">1. Introduction</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Welcome to FuelFriendly. These Terms and Conditions govern your use of the FuelFriend mobile application and website (collectively, the "Service").
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">2. Definitions</h3>
                            <p className="text-gray-600 leading-relaxed mb-2">
                                Fuel Friend refers to our delivery partners who deliver fuel and other items to users.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                User refers to individuals who access or use our Service.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">3. Use of Service</h3>
                            <p className="text-gray-600 leading-relaxed">
                                FuelFriend provides a platform connecting users with fuel delivery services and convenience store items. We do not own, sell, or distribute fuel ourselves.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">4. Payments and Fees</h3>
                            <p className="text-gray-600 leading-relaxed">
                                All payments are processed securely through our payment providers. By providing payment information, you represent that you are authorized to use the payment method.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">5. Delivery Services</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Delivery times are estimates and may vary based on traffic, weather conditions, and other factors beyond our control.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">6. Contact Us</h3>
                            <p className="text-gray-600 leading-relaxed mb-2">
                                If you have any questions about these Terms, please contact us at:
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                support@fuelfriendly.com<br/>
                                FuelFriendly, Inc.<br/>
                                123 Delivery Lane<br/>
                                San Francisco, CA 94107
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default TermsConditionsScreen;