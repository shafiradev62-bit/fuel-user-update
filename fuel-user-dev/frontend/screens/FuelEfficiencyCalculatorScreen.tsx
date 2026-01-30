import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Fuel, DollarSign, TrendingUp } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import TapEffectButton from '../components/TapEffectButton';
import { useAppContext } from '../context/AppContext';

const FuelEfficiencyCalculatorScreen = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        totalDistance: '80',
        fuelFilled: '10',
        fuelCostPerLiter: '30'
    });

    const [calculations, setCalculations] = useState({
        monthlyUsage: 0,
        monthlyCost: 0,
        fuelEfficiency: 0
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        const distance = parseFloat(formData.totalDistance) || 0;
        const fuel = parseFloat(formData.fuelFilled) || 0;
        const costPerLiter = parseFloat(formData.fuelCostPerLiter) || 0;

        if (distance > 0 && fuel > 0) {
            const efficiency = distance / fuel; // KM per liter
            // Assume this is weekly distance, so monthly = weekly * 4
            const weeklyDistance = distance;
            const monthlyDistance = weeklyDistance * 4;
            const monthlyUsage = monthlyDistance / efficiency;
            const monthlyCost = monthlyUsage * costPerLiter;

            setCalculations({
                monthlyUsage: Math.round(monthlyUsage),
                monthlyCost: Math.round(monthlyCost),
                fuelEfficiency: parseFloat(efficiency.toFixed(1))
            });
        } else {
            setCalculations({
                monthlyUsage: 0,
                monthlyCost: 0,
                fuelEfficiency: 0
            });
        }
    }, [formData]);

    const chartData = [
        { day: 'MON', value: 8 },
        { day: 'TUE', value: 12 },
        { day: 'WED', value: 18 },
        { day: 'THU', value: 10 },
        { day: 'FRI', value: 15 },
        { day: 'SAT', value: 20 },
        { day: 'SUN', value: 16 }
    ];

    const maxValue = Math.max(...chartData.map(d => d.value));

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-white">
                <header className="p-4 flex items-center bg-white border-b border-gray-100">
                    <TapEffectButton onClick={() => navigate('/settings')} className="p-2 -ml-2">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </TapEffectButton>
                    <h2 className="text-lg font-semibold text-center flex-grow -ml-10 text-gray-900">Fuel Efficiency Calculator</h2>
                </header>

                <div className="p-4 space-y-6">
                    {/* Description */}
                    <div>
                        <p className="text-gray-600 text-sm">
                            Track your fuel consumption and optimize your fuel usage. Enter your weekly driving data below.
                        </p>
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-gray-700 text-sm mb-2 block">Total Distance Driven (KM)</label>
                            <input
                                type="number"
                                name="totalDistance"
                                value={formData.totalDistance}
                                onChange={handleChange}
                                placeholder="80 KM"
                                min="0"
                                step="0.1"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3AC36C]"
                            />
                        </div>

                        <div>
                            <label className="text-gray-700 text-sm mb-2 block">Fuel Filled (Liters)</label>
                            <input
                                type="number"
                                name="fuelFilled"
                                value={formData.fuelFilled}
                                onChange={handleChange}
                                placeholder="10 L"
                                min="0"
                                step="0.1"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3AC36C]"
                            />
                        </div>

                        <div>
                            <label className="text-gray-700 text-sm mb-2 block">Fuel Cost Per Liter (Optional)</label>
                            <input
                                type="number"
                                name="fuelCostPerLiter"
                                value={formData.fuelCostPerLiter}
                                onChange={handleChange}
                                placeholder="$30/L"
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#3AC36C]"
                            />
                        </div>
                    </div>

                    {/* Results */}
                    <div>
                        <h3 className="text-gray-900 font-medium text-lg mb-4">Fuel Efficiency & Monthly Estimates</h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <Fuel className="w-5 h-5 text-gray-500 mr-3" />
                                <div>
                                    <p className="text-gray-600 text-sm">Estimated Monthly Usage</p>
                                    <p className="text-gray-900 font-semibold">{calculations.monthlyUsage} Liters</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <DollarSign className="w-5 h-5 text-gray-500 mr-3" />
                                <div>
                                    <p className="text-gray-600 text-sm">Estimated Monthly Cost</p>
                                    <p className="text-gray-900 font-semibold">${calculations.monthlyCost}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <TrendingUp className="w-5 h-5 text-gray-500 mr-3" />
                                <div>
                                    <p className="text-gray-600 text-sm">Fuel Efficiency</p>
                                    <p className="text-gray-900 font-semibold">{calculations.fuelEfficiency} KM/L</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-900 font-medium">Fuel Usage Trends</h3>
                            <span className="text-gray-500 text-sm">Week</span>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-end justify-between h-32 mb-2">
                                {chartData.map((item, index) => (
                                    <div key={index} className="flex flex-col items-center flex-1">
                                        <div 
                                            className="w-6 bg-[#3AC36C] rounded-t-sm mb-1"
                                            style={{ 
                                                height: `${(item.value / maxValue) * 100}px`,
                                                minHeight: '8px'
                                            }}
                                        ></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                {chartData.map((item, index) => (
                                    <span key={index} className="flex-1 text-center">{item.day}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Fuel-Saving Tips */}
                    <div>
                        <h3 className="text-gray-900 font-medium text-lg mb-4">Fuel-Saving Tips</h3>
                        
                        <div className="space-y-2">
                            <div className="flex items-start">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <p className="text-gray-600 text-sm">Maintain proper tire pressure</p>
                            </div>
                            <div className="flex items-start">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <p className="text-gray-600 text-sm">Avoid excessive idling</p>
                            </div>
                            <div className="flex items-start">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <p className="text-gray-600 text-sm">Drive at a steady speed</p>
                            </div>
                            <div className="flex items-start">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <p className="text-gray-600 text-sm">Use cruise control on highways</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default FuelEfficiencyCalculatorScreen;