import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import TapEffectButton from './TapEffectButton';

interface TipSelectorProps {
  onTipChange: (tip: number) => void;
  initialTip?: number;
}

const TipSelector: React.FC<TipSelectorProps> = ({ onTipChange, initialTip = 0 }) => {
  const [selectedTip, setSelectedTip] = useState(initialTip);
  const [customTip, setCustomTip] = useState(initialTip >= 2 ? initialTip.toString() : '');

  const presetTips = [2, 5, 10, 15];

  const handlePresetTip = (amount: number) => {
    setSelectedTip(amount);
    setCustomTip('');
    onTipChange(amount);
  };

  const handleCustomTip = (value: string) => {
    setCustomTip(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 2) {
      setSelectedTip(numValue);
      onTipChange(numValue);
    } else if (value === '') {
      setSelectedTip(0);
      onTipChange(0);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-4">
      <div className="flex items-center mb-3">
        <DollarSign className="w-5 h-5 text-gray-600 mr-2" />
        <h3 className="font-semibold text-gray-900">Tip for Fuel Friend</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Thank your Fuel Friend for excellent service (minimum $2)
      </p>

      {/* Preset Tips */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {presetTips.map((amount) => (
          <TapEffectButton
            key={amount}
            onClick={() => handlePresetTip(amount)}
            className={`py-2 rounded-2xl font-medium transition-colors ${selectedTip === amount && customTip === ''
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            ${amount}
          </TapEffectButton>
        ))}
      </div>

      {/* Custom Tip Input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          $
        </span>
        <input
          type="number"
          min="2"
          step="0.01"
          placeholder="Custom amount"
          value={customTip}
          onChange={(e) => handleCustomTip(e.target.value)}
          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ios-input"
        />
      </div>

      {selectedTip > 0 && (
        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-2xl">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Tip added:</span> ${selectedTip.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TipSelector;
