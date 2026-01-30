import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Moon, Settings } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Theme } from '../types';
import AnimatedPage from '../components/AnimatedPage';
import TapEffectButton from '../components/TapEffectButton';

const ThemeScreen = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useAppContext();

    const themeOptions = [
        {
            id: Theme.LIGHT,
            name: 'Light Mode',
            icon: <Sun size={20} className="text-gray-600" />
        },
        {
            id: Theme.DARK,
            name: 'Dark Mode',
            icon: <Moon size={20} className="text-gray-600" />
        },
        {
            id: Theme.DEFAULT,
            name: 'System Default',
            icon: <Settings size={20} className="text-gray-600" />
        }
    ];

    const handleThemeSelect = (selectedTheme: Theme) => {
        setTheme(selectedTheme);
        console.log('Theme changed to:', selectedTheme);
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-white dark:bg-gray-900">
                <header className="p-4 flex items-center bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                    <TapEffectButton onClick={() => navigate(-1)} className="p-2 -ml-2">
                        <img src="/Back.png" alt="Back" className="w-5 h-5" />
                    </TapEffectButton>
                    <h2 className="text-lg font-semibold text-center flex-grow -ml-10 text-gray-900 dark:text-white">Theme</h2>
                </header>

                <div className="p-4">
                    <div className="mb-6">
                        <h3 className="text-gray-900 dark:text-white font-medium text-lg mb-2">Appearance</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Select your preferred theme</p>
                    </div>

                    <div className="space-y-0">
                        {themeOptions.map((option, index) => (
                            <div key={option.id}>
                                <button
                                    onClick={() => handleThemeSelect(option.id)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <div className="mr-4">
                                            {React.cloneElement(option.icon, {
                                                className: "w-5 h-5 text-gray-600 dark:text-gray-300"
                                            })}
                                        </div>
                                        <span className="text-gray-800 dark:text-gray-200 text-base">{option.name}</span>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        theme === option.id 
                                            ? 'border-[#3AC36C] bg-white dark:bg-gray-800' 
                                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                                    }`}>
                                        {theme === option.id && (
                                            <div className="w-3 h-3 rounded-full bg-[#3AC36C]"></div>
                                        )}
                                    </div>
                                </button>
                                {index < themeOptions.length - 1 && (
                                    <div className="border-t border-gray-100 dark:border-gray-700 ml-12"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default ThemeScreen;