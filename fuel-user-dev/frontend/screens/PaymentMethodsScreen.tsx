import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Plus, Edit3, Trash2, Check } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';
import TapEffectButton from '../components/TapEffectButton';

const PaymentMethodsScreen = () => {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'Visa',
      lastFour: '4242',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: '2', 
      type: 'Mastercard',
      lastFour: '5893',
      expiry: '08/24',
      isDefault: false
    },
    {
      id: '3',
      type: 'PayPal',
      lastFour: '',
      expiry: '',
      isDefault: false
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({
    type: 'Visa',
    number: '',
    expiry: '',
    cvv: ''
  });

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const handleDelete = (id: string) => {
    if (paymentMethods.length <= 1) {
      alert('You must have at least one payment method.');
      return;
    }
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const handleAddCard = () => {
    if (newCard.number.length < 16) {
      alert('Please enter a valid card number');
      return;
    }
    const lastFour = newCard.number.slice(-4);
    setPaymentMethods(prev => [...prev, {
      id: (prev.length + 1).toString(),
      type: newCard.type,
      lastFour,
      expiry: newCard.expiry,
      isDefault: prev.length === 0
    }]);
    setNewCard({ type: 'Visa', number: '', expiry: '', cvv: '' });
    setShowAddForm(false);
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-white">
        <header className="p-4 flex items-center bg-white border-b border-gray-100">
          <TapEffectButton onClick={() => navigate('/settings')} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </TapEffectButton>
          <h2 className="text-lg font-semibold text-center flex-grow -ml-10 text-gray-900">
            Payment Methods
          </h2>
        </header>

        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-gray-900 font-medium mb-4">Saved Cards</h3>
            
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id} 
                  className={`p-4 border rounded-xl ${
                    method.isDefault 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-3 p-2 bg-gray-100 rounded-lg">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {method.type} {method.lastFour ? `•••• ${method.lastFour}` : ''}
                        </div>
                        {method.expiry && (
                          <div className="text-sm text-gray-500">
                            Expires {method.expiry}
                          </div>
                        )}
                        {method.isDefault && (
                          <div className="flex items-center mt-1">
                            <Check className="w-3 h-3 text-green-600 mr-1" />
                            <span className="text-xs text-green-600 font-medium">Default</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleSetDefault(method.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          method.isDefault 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {method.isDefault ? 'Default' : 'Set Default'}
                      </button>
                      <button 
                        onClick={() => handleDelete(method.id)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Payment Method
            </button>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-medium text-gray-900 mb-4">Add New Card</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={newCard.number}
                    onChange={(e) => setNewCard({...newCard, number: e.target.value.replace(/\D/g, '')})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={newCard.expiry}
                      onChange={(e) => setNewCard({...newCard, expiry: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={newCard.cvv}
                      onChange={(e) => setNewCard({...newCard, cvv: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCard}
                    className="flex-1 py-3 bg-green-500 text-white rounded-lg font-medium"
                  >
                    Save Card
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default PaymentMethodsScreen;