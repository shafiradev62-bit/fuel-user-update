import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

const ReportSubmittedSuccessScreen = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const userData = localStorage.getItem('user');
        if (!userData) {
            setIsLoggedIn(false);
            return;
        }
        setIsLoggedIn(true);
    }, []);

    // Show login prompt if not logged in
    if (!isLoggedIn) {
        return (
            <AnimatedPage>
                <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
                    <div className="text-center max-w-sm">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h3>
                        <p className="text-gray-600 mb-8 max-w-sm">
                            Please login to view report submission status.
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

    const handleSubmitAnother = () => {
        navigate('/report-issue');
    };

    const handleGoHome = () => {
        navigate('/home');
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-[#3AC36C] rounded-full flex items-center justify-center mx-auto mb-8">
                        <Check className="w-10 h-10 text-white stroke-[3]" />
                    </div>

                    {/* Success Message */}
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Report Submitted Successfully!
                    </h2>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-12">
                        Thank you for reporting the issue. Our team will review your report and get back to you as soon as possible.
                    </p>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <button
                            onClick={handleSubmitAnother}
                            className="w-full py-4 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
                        >
                            Submit another report
                        </button>
                        
                        <button
                            onClick={handleGoHome}
                            className="w-full py-4 bg-transparent text-[#3AC36C] font-medium hover:underline transition-colors"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ReportSubmittedSuccessScreen;