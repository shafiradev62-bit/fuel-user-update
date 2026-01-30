import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AnimatedPage from '../components/AnimatedPage';
import TapEffectButton from '../components/TapEffectButton';

interface ChatMessage {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: string;
}

const LiveChatSupportScreen = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAppContext();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isAuthenticated && user) {
             // Initialize with welcome message if logged in
            setMessages([{
                id: '1',
                text: 'Hello! Welcome to FuelFriend support. How can I help you with your fuel pickup today?',
                isUser: false,
                timestamp: '23:20'
            }]);
        }
    }, [isAuthenticated, user]);

    // Show login prompt if not logged in
    if (!isAuthenticated) {
        return (
            <AnimatedPage>
                <div className="min-h-screen flex flex-col bg-white">
                    <header className="p-4 flex items-center bg-white border-b border-gray-100">
                        <TapEffectButton onClick={() => navigate('/support-help')} className="p-2 -ml-2">
                            <img src="/Back.png" alt="Back" className="w-5 h-5" />
                        </TapEffectButton>
                        <h2 className="text-lg font-semibold text-center flex-grow -ml-10 text-gray-900">
                            Live Chat Support
                        </h2>
                    </header>
                    
                    <div className="flex-1 flex flex-col items-center justify-center px-4">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Send className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h3>
                            <p className="text-gray-600 mb-8 max-w-sm">
                                Please login to start a live chat with our support team.
                            </p>
                            <button 
                                onClick={() => navigate('/login')}
                                className="bg-[#3AC36C] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#2ea85a] transition-colors"
                            >
                                Login Now
                            </button>
                        </div>
                    </div>
                </div>
            </AnimatedPage>
        );
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (inputMessage.trim() === '') return;

        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            text: inputMessage,
            isUser: true,
            timestamp: new Date().toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');

        // Simulate support response after 2 seconds
        setTimeout(() => {
            const supportResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                text: 'I can help you with that! Let me check the status of your fuel pickup order TRK-123456789. One moment please...',
                isUser: false,
                timestamp: new Date().toLocaleTimeString('en-US', { 
                    hour12: false, 
                    hour: '2-digit', 
                    minute: '2-digit' 
                })
            };
            setMessages(prev => [...prev, supportResponse]);
            
            // Second response after another 2 seconds
            setTimeout(() => {
                const secondResponse: ChatMessage = {
                    id: (Date.now() + 2).toString(),
                    text: 'I can see your order is currently being prepared at the station. Your fuel will be ready for pickup at 123 Main Street in approximately 12 minutes. Is there anything specific about your pickup you\'d like to know?',
                    isUser: false,
                    timestamp: new Date().toLocaleTimeString('en-US', { 
                        hour12: false, 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })
                };
                setMessages(prev => [...prev, secondResponse]);
            }, 2000);
        }, 2000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <AnimatedPage>
            <div className="min-h-screen bg-white flex flex-col">
                <header className="p-4 flex items-center bg-white border-b border-gray-100">
                    <TapEffectButton onClick={() => navigate('/support-help')} className="p-2 -ml-2">
                        <img src="/Back.png" alt="Back" className="w-5 h-5" />
                    </TapEffectButton>
                    <h2 className="text-lg font-semibold text-center flex-grow -ml-10 text-gray-900">
                        Live Chat Support
                    </h2>
                </header>

                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                        message.isUser
                                            ? 'bg-[#3AC36C] text-white'
                                            : 'bg-gray-100 text-gray-900'
                                    }`}
                                >
                                    <p className="text-sm">{message.text}</p>
                                    <p className={`text-xs mt-1 ${
                                        message.isUser ? 'text-green-100' : 'text-gray-500'
                                    }`}>
                                        {message.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask about your fuel pickup, order status, or any other support..."
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:border-[#3AC36C] text-sm"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={inputMessage.trim() === ''}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-[#3AC36C] hover:bg-green-50 rounded-full transition-colors disabled:text-gray-300 disabled:hover:bg-transparent"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 text-center mt-2">
                        Fuel pickup support typically responds within 2 minutes
                    </p>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default LiveChatSupportScreen;