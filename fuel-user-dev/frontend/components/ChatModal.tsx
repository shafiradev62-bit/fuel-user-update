import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Phone, MoreVertical, Image as ImageIcon, Mic } from 'lucide-react';

interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    driverName: string;
    driverAvatar: string;
    driverPhone: string;
    onCall: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, driverName, driverAvatar, driverPhone, onCall }) => {
    console.log('ChatModal render - isOpen:', isOpen);
    
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I've arrived and I'm waiting for your pickup.", sender: 'driver', time: 'Just now' }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        
        // Prevent body scroll when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            // Restore body scroll when modal is closed
            document.body.style.overflow = 'auto';
        };
    }, [messages, isOpen]);

    if (!isOpen) {
        console.log('ChatModal: Not rendering because isOpen is false');
        return null;
    }
    
    console.log('ChatModal: Rendering because isOpen is true');

    const handleSend = () => {
        if (!message.trim()) return;
        setMessages([...messages, { id: Date.now(), text: message, sender: 'user', time: 'Now' }]);
        setMessage('');
    };

    return (
        <>
            {/* Backdrop Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-70 z-[99998]"></div>
            
            {/* Chat Modal */}
            <div className="fixed inset-0 bg-[#F8F9FA] z-[99999] flex flex-col animate-slide-up">
                {/* Header */}
                <div className="bg-white px-4 py-3 shadow-sm flex items-center justify-between border-b border-gray-100 space-x-3 z-10">
                    <div className="flex items-center gap-3 flex-1">
                        <button
                            onClick={onClose}
                            className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors active:scale-95"
                        >
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                        <div className="relative">
                            <img
                                src={driverAvatar}
                                className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                alt="Driver"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 leading-tight">{driverName}</h3>
                            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                                Online
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={onCall}
                            className="p-2.5 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors active:scale-95"
                            title="Call FuelFriend"
                        >
                            <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#F8F9FA]">
                    <div className="text-center">
                        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Today</span>
                    </div>

                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-scale-in`}>
                            <div className={`max-w-[75%] shadow-sm px-4 py-3 ${msg.sender === 'user'
                                ? 'bg-[#3AC36C] text-white rounded-2xl rounded-tr-sm'
                                : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-100'
                                }`}>
                                <p className="text-[15px] leading-relaxed">{msg.text}</p>
                                <span className={`text-[10px] mt-1 block text-right font-medium ${msg.sender === 'user' ? 'text-green-100' : 'text-gray-400'}`}>
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-white p-3 border-t border-gray-100 safe-area-bottom mb-2">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-[28px] px-4 py-3 border border-gray-100 focus-within:border-green-200 focus-within:ring-2 focus-within:ring-green-100 transition-all">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <ImageIcon className="w-6 h-6" />
                        </button>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Message..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 text-[15px]"
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        {message.trim() ? (
                            <button
                                onClick={handleSend}
                                className="p-2.5 bg-[#3AC36C] text-white rounded-full shadow-md hover:bg-[#2ea85a] transform transition-all active:scale-95"
                            >
                                <Send className="w-5 h-5 ml-0.5" />
                            </button>
                        ) : (
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <Mic className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatModal;
