import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import TapEffectButton from '../components/TapEffectButton';

const PrivacyPolicyScreen = () => {
    const navigate = useNavigate();

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-white">
                <header className="p-4 flex items-center bg-white border-b border-gray-100">
                    <TapEffectButton onClick={() => navigate('/settings')} className="p-2 -ml-2">
                        <img src="/Back.png" alt="Back" className="w-5 h-5" />
                    </TapEffectButton>
                    <h2 className="text-lg font-semibold text-center flex-grow -ml-10 text-gray-900">
                        Privacy Policy
                    </h2>
                </header>

                <div className="p-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                        <p className="text-green-700 text-sm">
                            Last Update 10 June 2024
                        </p>
                    </div>

                    <div className="space-y-6 text-sm">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">1. Introduction</h3>
                            <p className="text-gray-600 leading-relaxed">
                                FuelFriendly ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website (collectively, the "Service").
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">2. Information We Collect</h3>
                            <p className="text-gray-600 leading-relaxed mb-3">Personal Information</p>
                            <ul className="text-gray-600 leading-relaxed space-y-1 ml-4">
                                <li>• Name</li>
                                <li>• Email address</li>
                                <li>• Phone number</li>
                                <li>• Billing address</li>
                                <li>• Payment information</li>
                                <li>• Vehicle information (make, model, color, fuel type)</li>
                                <li>• Location data</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">3. How We Use Your Information</h3>
                            <p className="text-gray-600 leading-relaxed mb-3">
                                We use the collected information for various purposes, including to:
                            </p>
                            <ul className="text-gray-600 leading-relaxed space-y-1 ml-4">
                                <li>• Provide and maintain our Service</li>
                                <li>• Process and complete transactions</li>
                                <li>• Send you order confirmations and updates</li>
                                <li>• Provide customer support</li>
                                <li>• Gather analysis to improve our Service</li>
                                <li>• Monitor the usage of our Service</li>
                                <li>• Detect, prevent, and address technical issues</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">4. Data Security</h3>
                            <p className="text-gray-600 leading-relaxed mb-3">
                                The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                We implement appropriate security measures to protect your personal information, including encryption of sensitive data and secure payment processing.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">5. Changes to This Privacy Policy</h3>
                            <p className="text-gray-600 leading-relaxed mb-3">
                                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
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

export default PrivacyPolicyScreen;