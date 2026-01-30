import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Eye, EyeOff, Mail, MessageSquare } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { apiRegisterComplete, apiLogin } from '../services/api';
import Logo from '../components/Logo';
import AnimatedPage from '../components/AnimatedPage';
import VerificationSuccess from '../components/VerificationSuccess';
import Button from '../components/Button';
import TouchFeedback from '../components/TouchFeedback';
import TapEffectButton from '../components/TapEffectButton';
import SubscriptionPlans from '../components/SubscriptionPlans';

const Stepper = ({ currentStep }: { currentStep: number }) => {
    const steps = [1, 2, 3];
    return (
        <div className="flex items-center justify-center w-full my-2">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className="flex flex-col items-center">
                        <div className={`mobile-stepper-circle rounded-full border-2 flex items-center justify-center font-semibold ${
                            index + 1 === currentStep 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : index + 1 < currentStep
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                            {index + 1 < currentStep ? <Check size={20} /> : step}
                        </div>
                        {/* Car icon positioned below current step */}
                        {index + 1 === currentStep && (
                            <div className="mt-2">
                                <img 
                                    src="/car.png" 
                                    alt="Car icon" 
                                    className="w-8 h-4"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    {index < steps.length - 1 && (
                        <div className="flex items-center mx-4" style={{ minWidth: '40px', maxWidth: '80px' }}>
                            <div className={`w-2 h-2 rounded-full ${
                                index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-300'
                            }`}></div>
                            <div className={`flex-1 h-0.5 mx-1 border-t-2 border-dotted ${
                                index + 1 < currentStep ? 'border-green-500' : 'border-gray-300'
                            }`}></div>
                            <div className={`w-2 h-2 rounded-full ${
                                index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-300'
                            }`}></div>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const RegistrationScreen = () => {
    const navigate = useNavigate();
    const { login, updateUser } = useAppContext();
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        vehicleBrand: '',
        vehicleColor: '',
        licenseNumber: '',
        fuelType: 'Petrol',
    });
    const [loading, setLoading] = useState(false);
    const [verificationMethod, setVerificationMethod] = useState<'email' | 'whatsapp' | null>(null);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => {
        if (step > 1) {
            setStep(s => s - 1);
        } else {
            navigate("/home");
        }
    };
    
    const createAccount = async (subscription: string = 'gold') => {
        console.log('Creating account with data:', formData, 'and subscription:', subscription);
        setLoading(true);
        setError('');
        
        // Transform data to match backend API expectations
        const registrationData = {
            step1: {
                fullName: formData.fullName,
                email: formData.email,
                phoneNumber: formData.phone,
                password: formData.password
            },
            step2: {
                brand: formData.vehicleBrand,
                color: formData.vehicleColor,
                licenseNumber: formData.licenseNumber,
                fuelType: formData.fuelType
            },
            subscription: subscription  // Add subscription info
        };
        
        console.log('Sending registration data:', registrationData);
        
        try {
            // Navigate to verification immediately
            setStep(4); // Go to email verification screen
            
            // Make API call
            const userData = await apiRegisterComplete(registrationData);
            console.log('Registration successful:', userData);
            
            // Save token and user data
            localStorage.setItem('token', userData.token);
            updateUser(userData.customer);
            
        } catch (error) {
            console.error("Registration failed:", error);
            
            // Extract error message from API response
            let errorMessage = "Registration failed. Please try again.";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
            // Go back to step 3 if registration fails
            setStep(3);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1 next={handleNext} formData={formData} handleChange={handleChange} />;
            case 2:
                return <Step2 next={handleNext} back={handleBack} formData={formData} handleChange={handleChange} />;
            case 3:
                return <Step3 
                    createAccount={createAccount} 
                    editDetails={() => setStep(2)}
                    formData={formData} 
                    loading={loading}
                    error={error}
                />;
            case 4:
                return <EmailVerificationStep 
                    formData={formData} 
                    onBack={handleBack}
                    onNext={() => setStep(5)}
                    onTryAnotherWay={() => setStep(6)}
                />;
            case 5:
                return <EmailOTPVerification 
                    formData={formData} 
                    onBack={() => setStep(4)}
                    onComplete={() => {
                        setVerificationMethod('email');
                        setStep(8);
                    }}
                />;
            case 6:
                return <WhatsAppVerificationStep 
                    formData={formData} 
                    onBack={() => setStep(4)}
                    onNext={() => setStep(7)}
                />;
            case 7:
                return <WhatsAppOTPVerification 
                    formData={formData} 
                    onBack={() => setStep(6)}
                    onComplete={() => {
                        setVerificationMethod('whatsapp');
                        setStep(8);
                    }}
                />;
            case 8:
                return <VerificationSuccess 
                    type={verificationMethod || 'email'} 
                    formData={formData} 
                    onCreateAccount={createAccount} 
                />;
            default:
                return <Step1 next={handleNext} formData={formData} handleChange={handleChange} />;
        }
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen flex flex-col p-4 bg-white">
                <header className="flex items-center mb-0">
                    <button 
                        onClick={handleBack} 
                        className="p-2 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all"
                        disabled={loading}
                    >
                        <img src="/Back.png" alt="Back" className="w-5 h-5" />
                    </button>
                </header>
                
                {step < 4 && (
                    <>
                        <div className="flex flex-col items-center mb-2">
                            <div className="mobile-logo-size mb-2">
                                <Logo />
                            </div>
                        </div>

                        <div className="text-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Registration</h2>
                        </div>

                        <Stepper currentStep={step} />
                    </>
                )}

                <div className="flex-grow mt-0">
                    {renderStep()}
                </div>
            </div>
        </AnimatedPage>
    );
};

interface StepProps {
    next: () => void;
    back?: () => void;
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    loading?: boolean;
}

const Step1 = ({ next, formData, handleChange }: StepProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        next();
    }
    
    return (
        <div className="space-y-4">
            <form onSubmit={handleFormSubmit} className="space-y-4">
                <input 
                    name="fullName" 
                    type="text" 
                    placeholder="Full Name"
                    value={formData.fullName} 
                    onChange={handleChange} 
                    className="w-full mobile-form-input rounded-full border border-black/50 bg-white focus:outline-none focus:ring-2 focus:ring-[#3AC36C] focus:border-[#3AC36C] placeholder-gray-400 transition-all duration-200" 
                    required 
                />
                
                <input 
                    name="email" 
                    type="email" 
                    placeholder="Email address"
                    value={formData.email} 
                    onChange={handleChange} 
                    className="w-full mobile-form-input rounded-full border border-black/50 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400" 
                    required 
                />
                
                <input 
                    name="phone" 
                    type="tel" 
                    placeholder="Phone Number"
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="w-full mobile-form-input rounded-full border border-black/50 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400" 
                    required 
                />
                
                <div className="relative">
                    <input 
                        name="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password"
                        value={formData.password} 
                        onChange={handleChange} 
                        className="w-full mobile-form-input rounded-full border border-black/50 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400" 
                        required 
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute inset-y-0 right-0 px-6 flex items-center text-gray-400"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                
                <div className="relative">
                    <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Confirm Password"
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        className="w-full mobile-form-input rounded-full border border-black/50 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400" 
                        required 
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                        className="absolute inset-y-0 right-0 px-6 flex items-center text-gray-400"
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                
                <Button 
                    type="submit" 
                    variant="primary"
                    size="md"
                    className="w-full py-4 rounded-full font-semibold text-base shadow-lg mt-6"
                >
                    Next
                </Button>
            </form>
            
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or</span>
                </div>
            </div>
            
            <TouchFeedback className="block">
                <Button 
                    type="button"
                    variant="outline"
                    size="md"
                    className="w-full py-4 rounded-full flex items-center justify-center gap-3 shadow-md"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                </Button>
            </TouchFeedback>
        </div>
    );
};

const Step2 = ({ next, back, formData, handleChange }: StepProps) => {
    const [vehicles, setVehicles] = useState([{
        brand: formData.vehicleBrand || '',
        color: formData.vehicleColor || '',
        licenseNumber: formData.licenseNumber || '',
        fuelType: formData.fuelType || 'Petrol'
    }]);

    const addVehicle = () => {
        setVehicles([...vehicles, {
            brand: '',
            color: '',
            licenseNumber: '',
            fuelType: 'Petrol'
        }]);
    };

    const updateVehicle = (index: number, field: string, value: string) => {
        const updatedVehicles = [...vehicles];
        updatedVehicles[index] = { ...updatedVehicles[index], [field]: value };
        setVehicles(updatedVehicles);
        
        // Update main form data for first vehicle
        if (index === 0) {
            const event = {
                target: {
                    name: field === 'brand' ? 'vehicleBrand' : 
                          field === 'color' ? 'vehicleColor' : 
                          field === 'licenseNumber' ? 'licenseNumber' : 'fuelType',
                    value
                }
            } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;
            handleChange(event);
        }
    };

    const removeVehicle = (index: number) => {
        if (vehicles.length > 1) {
            setVehicles(vehicles.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={(e) => { e.preventDefault(); next(); }} className="space-y-4">
                {vehicles.map((vehicle, index) => (
                    <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-lg">
                        {index > 0 && (
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium text-gray-700">Vehicle {index + 1}</h3>
                                <button
                                    type="button"
                                    onClick={() => removeVehicle(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                        
                        <div className="relative">
                            <select 
                                value={vehicle.brand}
                                onChange={(e) => updateVehicle(index, 'brand', e.target.value)}
                                className="w-full mobile-form-input rounded-full border border-black/50 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                                required
                            >
                                <option value="" disabled>Select Brand</option>
                                <option value="Toyota">Toyota</option>
                                <option value="Honda">Honda</option>
                                <option value="Ford">Ford</option>
                                <option value="BMW">BMW</option>
                                <option value="Mercedes">Mercedes</option>
                                <option value="Audi">Audi</option>
                                <option value="Tesla">Tesla</option>
                                <option value="Hyundai">Hyundai</option>
                                <option value="Nissan">Nissan</option>
                                <option value="Mazda">Mazda</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        
                        <input 
                            type="text" 
                            placeholder="Vehicle Color"
                            value={vehicle.color}
                            onChange={(e) => updateVehicle(index, 'color', e.target.value)}
                            className="w-full mobile-form-input rounded-full border border-black/50 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400" 
                            required 
                        />
                        
                        <input 
                            type="text" 
                            placeholder="License Number"
                            value={vehicle.licenseNumber}
                            onChange={(e) => updateVehicle(index, 'licenseNumber', e.target.value)}
                            className="w-full mobile-form-input rounded-full border border-black/50 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400" 
                            required 
                        />
                        
                        <div className="relative">
                            <select 
                                value={vehicle.fuelType}
                                onChange={(e) => updateVehicle(index, 'fuelType', e.target.value)}
                                className="w-full mobile-form-input rounded-full border border-black/50 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                            >
                                <option value="" disabled>Fuel type</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
                
                <button 
                    type="button"
                    onClick={addVehicle}
                    className="w-full mobile-form-button rounded-full border border-green-500 bg-white hover:bg-green-50 text-green-500 font-medium flex items-center justify-center gap-2 transition-colors"
                >
                    <span className="text-lg">+</span>
                    Add Vehicle
                </button>
                
                <Button 
                    type="submit" 
                    variant="primary"
                    size="md"
                    className="w-full py-4 rounded-full font-semibold text-base shadow-lg mt-6"
                >
                    Next
                </Button>
            </form>
        </div>
    );
};

const Step3 = ({ createAccount, editDetails, formData, loading, error }: { createAccount: (subscription: string) => void; editDetails: () => void; formData: any; loading: boolean; error?: string }) => {
    const [selectedSubscription, setSelectedSubscription] = useState('gold');
    
    return (
        <div className="space-y-6">
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
                </div>
            )}
            
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-dotted border-gray-300">
                        <span className="text-gray-600 font-medium">Name</span>
                        <span className="text-gray-800 font-medium">{formData.fullName}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-dotted border-gray-300">
                        <span className="text-gray-600 font-medium">Emai Address</span>
                        <span className="text-gray-800 font-medium">{formData.email}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-dotted border-gray-300">
                        <span className="text-gray-600 font-medium">Phone No.</span>
                        <span className="text-gray-800 font-medium">{formData.phone}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-dotted border-gray-300">
                        <span className="text-gray-600 font-medium">Password</span>
                        <span className="text-gray-800 font-medium">••••••••</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-dotted border-gray-300">
                        <span className="text-gray-600 font-medium">Vehicle Brand</span>
                        <span className="text-gray-800 font-medium">{formData.vehicleBrand}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-dotted border-gray-300">
                        <span className="text-gray-600 font-medium">Vehicle color</span>
                        <span className="text-gray-800 font-medium">{formData.vehicleColor}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-dotted border-gray-300">
                        <span className="text-gray-600 font-medium">License Number</span>
                        <span className="text-gray-800 font-medium">{formData.licenseNumber}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Fuel Type</span>
                        <span className="text-gray-800 font-medium">{formData.fuelType}</span>
                    </div>
                </div>
            </div>
            
            {/* Subscription Selection */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-medium text-gray-800 mb-4">Subscription Plan</h3>
                <SubscriptionPlans
                    selectedPlan={selectedSubscription}
                    onPlanSelect={(plan) => setSelectedSubscription(plan.id)}
                    isNonSubscriber={true}
                />
            </div>
            
            <Button 
                onClick={() => createAccount(selectedSubscription)} 
                variant="primary"
                size="md"
                className="w-full py-4 rounded-full font-semibold text-base shadow-lg"
                disabled={loading}
                isLoading={loading}
            >
                {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
            
            <div className="text-center">
                <button 
                    onClick={editDetails} 
                    className="text-green-500 font-semibold text-base hover:underline"
                    disabled={loading}
                >
                    Edit Details
                </button>
            </div>
        </div>
    );
};

const EmailVerificationStep = ({ formData, onBack, onNext, onTryAnotherWay }: { 
    formData: any; 
    onBack: () => void;
    onNext: () => void;
    onTryAnotherWay: () => void;
}) => {
    const [email, setEmail] = useState(formData.email);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendCode = async () => {
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch(`https://apidecor.kelolahrd.life/api/auth/otp/email/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (data.success) {
                onNext();
            } else {
                setError(data.error || 'Failed to send email OTP');
            }
        } catch (err) {
            setError('Failed to send email OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Email Icon */}
            <div className="flex justify-center">
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail size={48} className="text-green-500" />
                </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 text-center">
                Email Verification
            </h2>

            {/* Description */}
            <p className="text-base text-gray-600 text-center">
                Enter your email address to receive verification code
            </p>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
            )}

            {/* Email Input */}
            <input 
                type="email" 
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mobile-form-input rounded-full border border-black/50 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400" 
            />

            {/* Send Code Button */}
            <TouchFeedback className="block">
                <Button 
                    onClick={handleSendCode}
                    variant="primary"
                    size="md"
                    className="w-full py-4 rounded-full font-semibold text-base shadow-lg"
                    disabled={loading || !email}
                    isLoading={loading}
                >
                    {loading ? 'Sending...' : 'Send Code'}
                </Button>
            </TouchFeedback>

            {/* Try Another Way */}
            <div className="text-center">
                <button 
                    onClick={onTryAnotherWay}
                    className="text-gray-600 text-base hover:underline"
                >
                    Try another way
                </button>
            </div>
        </div>
    );
};

const EmailOTPVerification = ({ formData, onBack, onComplete }: { 
    formData: any;
    onBack: () => void;
    onComplete: () => void;
}) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(t => t - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        setError('');
        
        try {
            const otpCode = otp.join('');
            const response = await fetch(`https://apidecor.kelolahrd.life/api/auth/otp/email/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: formData.email, 
                    otp: otpCode 
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // ✅ OTP verified, now create account
                onComplete();
            } else {
                setError(data.error || 'Invalid verification code');
            }
        } catch (err) {
            setError('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setTimer(60);
        setCanResend(false);
        setError('');
        
        try {
            const response = await fetch(`https://apidecor.kelolahrd.life/api/auth/otp/email/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: formData.email })
            });
        } catch (err) {
            // Handle error silently
        }
    };

    return (
        <div className="space-y-8">
            {/* Email Icon */}
            <div className="flex justify-center">
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail size={48} className="text-green-500" />
                </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 text-center">
                Verify code
            </h2>

            {/* Description */}
            <p className="text-base text-gray-600 text-center">
                Enter four-digits verification code sent to {formData.email}
            </p>

            {/* OTP Input Boxes */}
            <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-semibold border-2 border-green-300 rounded-xl focus:outline-none focus:border-green-500 bg-white"
                    />
                ))}
            </div>
            
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
            )}
            
            <TouchFeedback className="block">
                <Button
                    onClick={handleVerify}
                    variant="primary"
                    size="md"
                    className="w-full rounded-full font-semibold shadow-lg hover:shadow-xl"
                    disabled={loading || otp.some(digit => !digit)}
                    isLoading={loading}
                >
                    {loading ? 'Verifying...' : 'Verify'}
                </Button>
            </TouchFeedback>

            {/* Resend Section */}
            <div className="text-center space-y-2">
                <p className="text-gray-600">
                    Haven't received the verification code?
                </p>
                <button
                    onClick={handleResend}
                    disabled={!canResend || loading}
                    className="text-green-500 font-semibold hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    {canResend ? 'Resend' : 'Resend'}
                </button>
                {!canResend && (
                    <p className="text-gray-500 text-sm">{timer}s</p>
                )}
            </div>
        </div>
    );
};

const WhatsAppVerificationStep = ({ formData, onBack, onNext }: { 
    formData: any; 
    onBack: () => void;
    onNext: () => void;
}) => {
    const [phone, setPhone] = useState(formData.phone);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendCode = async () => {
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch(`https://apidecor.kelolahrd.life/api/auth/otp/whatsapp/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phoneNumber: phone })
            });
            
            const data = await response.json();
            
            if (data.success) {
                onNext();
            } else {
                setError(data.error || 'Failed to send WhatsApp OTP');
            }
        } catch (err) {
            setError('Failed to send WhatsApp OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* WhatsApp Icon */}
            <div className="flex justify-center">
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageSquare size={48} className="text-green-500" />
                </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 text-center">
                WhatsApp Verification
            </h2>

            {/* Description */}
            <p className="text-base text-gray-600 text-center">
                Enter your phone number to receive verification code via WhatsApp
            </p>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
            )}

            {/* Phone Input */}
            <input 
                type="tel" 
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mobile-form-input rounded-full border border-black/50 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400" 
            />

            {/* Send Code Button */}
            <button 
                onClick={handleSendCode}
                disabled={loading || !phone}
                className="w-full py-4 bg-[#3AC36C] hover:bg-[#2ea85a] text-white rounded-full font-semibold text-base shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-70"
            >
                {loading ? 'Sending...' : 'Send Code'}
            </button>

            {/* Back to Email */}
            <div className="text-center">
                <button 
                    onClick={onBack}
                    className="text-gray-600 text-base hover:underline"
                >
                    Back to Email
                </button>
            </div>
        </div>
    );
};

const WhatsAppOTPVerification = ({ formData, onBack, onComplete }: { 
    formData: any;
    onBack: () => void;
    onComplete: () => void;
}) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(t => t - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        setError('');
        
        try {
            const otpCode = otp.join('');
            const response = await fetch(`https://apidecor.kelolahrd.life/api/auth/otp/whatsapp/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    phoneNumber: formData.phone, 
                    otp: otpCode 
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // ✅ OTP verified, now create account
                onComplete();
            } else {
                setError(data.error || 'Invalid verification code');
            }
        } catch (err) {
            setError('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setTimer(60);
        setCanResend(false);
        setError('');
        
        try {
            const response = await fetch(`https://apidecor.kelolahrd.life/api/auth/otp/whatsapp/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phoneNumber: formData.phone })
            });
        } catch (err) {
            // Handle error silently
        }
    };

    return (
        <div className="space-y-8">
            {/* WhatsApp Icon */}
            <div className="flex justify-center">
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageSquare size={48} className="text-green-500" />
                </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 text-center">
                Verify code
            </h2>

            {/* Description */}
            <p className="text-base text-gray-600 text-center">
                Enter four-digits verification code sent to {formData.phone}
            </p>

            {/* OTP Input Boxes */}
            <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-semibold border-2 border-green-300 rounded-xl focus:outline-none focus:border-green-500 bg-white"
                    />
                ))}
            </div>
            
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
            )}
            
            <TouchFeedback className="block">
                <Button
                    onClick={handleVerify}
                    variant="primary"
                    size="md"
                    className="w-full rounded-full font-semibold shadow-lg hover:shadow-xl"
                    disabled={loading || otp.some(digit => !digit)}
                    isLoading={loading}
                >
                    {loading ? 'Verifying...' : 'Verify'}
                </Button>
            </TouchFeedback>

            {/* Resend Section */}
            <div className="text-center space-y-2">
                <p className="text-gray-600">
                    Haven't received the verification code?
                </p>
                <button
                    onClick={handleResend}
                    disabled={!canResend || loading}
                    className="text-green-500 font-semibold hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    {canResend ? 'Resend' : 'Resend'}
                </button>
                {!canResend && (
                    <p className="text-gray-500 text-sm">{timer}s</p>
                )}
            </div>
        </div>
    );
};

export default RegistrationScreen;