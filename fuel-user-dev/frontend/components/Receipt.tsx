import React from 'react';
import { Download, Printer, CheckCircle } from 'lucide-react';

interface ReceiptProps {
  order: {
    id: string;
    trackingNumber: string;
    fuelType: string;
    fuelQuantity: string;
    fuelCost: number;
    serviceFee: number;
    cartItems?: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
    totalAmount: number;
    currency: string;
    deliveryAddress: string;
    stationName: string;
    createdAt: string;
    driverName: string;
    driverPhone: string;
  };
  onDownload: () => void;
  onPrint: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ order, onDownload, onPrint }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateSubtotal = () => {
    let subtotal = order.fuelCost;
    
    if (order.cartItems) {
      order.cartItems.forEach(item => {
        if (!item.name.toLowerCase().includes('fee')) {
          subtotal += item.price * item.quantity;
        }
      });
    }
    
    return subtotal;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Receipt</h2>
        <p className="text-gray-600">Thank you for your purchase!</p>
      </div>

      {/* Order Info */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Order ID</span>
          <span className="font-medium text-gray-900">{order.trackingNumber}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Date</span>
          <span className="font-medium text-gray-900">{formatDate(order.createdAt)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Fuel Friend</span>
          <span className="font-medium text-gray-900">{order.driverName}</span>
        </div>
      </div>

      {/* Items */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
        
        {/* Fuel Item */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <div>
            <span className="text-gray-700 font-medium">{order.fuelType} Fuel</span>
            <span className="text-sm text-gray-500 ml-2">({order.fuelQuantity})</span>
          </div>
          <span className="font-medium text-gray-900">
            {order.currency}{order.fuelCost.toFixed(2)}
          </span>
        </div>

        {/* Cart Items */}
        {order.cartItems?.filter(item => !item.name.toLowerCase().includes('fee')).map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <span className="text-gray-700">{item.name}</span>
              <span className="text-sm text-gray-500 ml-2">(x{item.quantity})</span>
            </div>
            <span className="font-medium text-gray-900">
              {order.currency}{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}

        {/* Service Fee */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-700">Service Fee</span>
          <span className="font-medium text-gray-900">
            {order.currency}{order.serviceFee.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-lg font-bold text-green-600">
            {order.currency}{order.totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Location Info */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Station</span>
          <span className="font-medium text-gray-900 text-sm">{order.stationName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Pickup Location</span>
          <span className="font-medium text-gray-900 text-sm">{order.deliveryAddress}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onDownload}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#3AC36C] text-white rounded-full font-semibold hover:bg-[#2ea85a] transition-colors"
        >
          <Download className="w-5 h-5" />
          Download PDF
        </button>
        <button
          onClick={onPrint}
          className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:border-[#3AC36C] hover:text-[#3AC36C] transition-colors"
        >
          <Printer className="w-5 h-5" />
          Print
        </button>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          FuelFriendly - Your trusted fuel delivery service
        </p>
      </div>
    </div>
  );
};

export default Receipt;