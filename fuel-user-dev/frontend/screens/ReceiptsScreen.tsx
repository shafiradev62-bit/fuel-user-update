import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Printer } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AnimatedPage from '../components/AnimatedPage';
import TapEffectButton from '../components/TapEffectButton';
import Receipt from '../components/Receipt';

const ReceiptsScreen = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [receipts, setReceipts] = useState<any[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    // Load saved receipts from localStorage
    if (user?.id) {
      const savedReceipts = JSON.parse(localStorage.getItem(`userReceipts_${user.id}`) || '[]');
      setReceipts(savedReceipts);
    }
  }, [user?.id]);

  const saveReceipt = (order: any) => {
    if (user?.id) {
      const receiptData = {
        ...order,
        id: `receipt_${Date.now()}`,
        savedAt: new Date().toISOString()
      };
      
      const existingReceipts = JSON.parse(localStorage.getItem(`userReceipts_${user.id}`) || '[]');
      existingReceipts.unshift(receiptData);
      localStorage.setItem(`userReceipts_${user.id}`, JSON.stringify(existingReceipts));
      setReceipts(existingReceipts);
    }
  };

  const handleDownload = (receipt: any) => {
    // Simulate PDF download
    const element = document.createElement('a');
    const file = new Blob([generateReceiptText(receipt)], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `receipt_${receipt.trackingNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = (receipt: any) => {
    const printContent = generateReceiptHTML(receipt);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const generateReceiptText = (receipt: any) => {
    return `
FUELFRIENDLY RECEIPT
====================
Order ID: ${receipt.trackingNumber}
Date: ${new Date(receipt.createdAt).toLocaleString()}
Fuel Friend: ${receipt.driverName}

ORDER DETAILS:
${receipt.fuelType} Fuel (${receipt.fuelQuantity}) - ${receipt.currency}${receipt.fuelCost.toFixed(2)}
${receipt.cartItems?.filter((item: any) => !item.name.toLowerCase().includes('fee'))
    .map((item: any) => `${item.name} (x${item.quantity}) - ${receipt.currency}${(item.price * item.quantity).toFixed(2)}`)
    .join('\n') || ''}

Service Fee: ${receipt.currency}${receipt.serviceFee.toFixed(2)}
TOTAL: ${receipt.currency}${receipt.totalAmount.toFixed(2)}

Station: ${receipt.stationName}
Pickup Location: ${receipt.deliveryAddress}

Thank you for choosing FuelFriendly!
    `;
  };

  const generateReceiptHTML = (receipt: any) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${receipt.trackingNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .info { margin-bottom: 20px; }
          .items { margin-bottom: 20px; }
          .item { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .total { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .location { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>FUELFRIENDLY RECEIPT</h1>
          <p>Thank you for your purchase!</p>
        </div>
        
        <div class="info">
          <p><strong>Order ID:</strong> ${receipt.trackingNumber}</p>
          <p><strong>Date:</strong> ${new Date(receipt.createdAt).toLocaleString()}</p>
          <p><strong>Fuel Friend:</strong> ${receipt.driverName}</p>
        </div>
        
        <div class="items">
          <h3>Order Details</h3>
          <div class="item">
            <span>${receipt.fuelType} Fuel (${receipt.fuelQuantity})</span>
            <span>${receipt.currency}${receipt.fuelCost.toFixed(2)}</span>
          </div>
          ${receipt.cartItems?.filter((item: any) => !item.name.toLowerCase().includes('fee'))
            .map((item: any) => `
              <div class="item">
                <span>${item.name} (x${item.quantity})</span>
                <span>${receipt.currency}${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('') || ''}
          <div class="item">
            <span>Service Fee</span>
            <span>${receipt.currency}${receipt.serviceFee.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="total">
          <div class="item">
            <strong>TOTAL</strong>
            <strong>${receipt.currency}${receipt.totalAmount.toFixed(2)}</strong>
          </div>
        </div>
        
        <div class="location">
          <p><strong>Station:</strong> ${receipt.stationName}</p>
          <p><strong>Pickup Location:</strong> ${receipt.deliveryAddress}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #666;">
          <p>FuelFriendly - Your trusted fuel delivery service</p>
        </div>
      </body>
      </html>
    `;
  };

  if (showReceiptModal && selectedReceipt) {
    return (
      <AnimatedPage>
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="flex items-center mb-6">
            <TapEffectButton 
              onClick={() => {
                setShowReceiptModal(false);
                setSelectedReceipt(null);
              }}
              className="p-2 -ml-2"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </TapEffectButton>
            <h1 className="text-lg font-semibold text-gray-900 flex-1 text-center -ml-10">Receipt Details</h1>
          </div>
          
          <Receipt
            order={selectedReceipt}
            onDownload={() => handleDownload(selectedReceipt)}
            onPrint={() => handlePrint(selectedReceipt)}
          />
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-white">
        <div className="flex items-center p-4 border-b border-gray-200">
          <TapEffectButton 
            onClick={() => navigate('/home')}
            className="p-2 -ml-2"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </TapEffectButton>
          <h1 className="text-lg font-semibold text-gray-900 flex-1 text-center -ml-10">My Receipts</h1>
        </div>

        <div className="p-4">
          {receipts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Receipts Yet</h3>
              <p className="text-gray-600 mb-6">Your receipts will appear here after completing orders.</p>
              <button
                onClick={() => navigate('/home')}
                className="bg-[#3AC36C] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#2ea85a] transition-colors"
              >
                Start Ordering
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {receipts.map((receipt) => (
                <div 
                  key={receipt.id}
                  onClick={() => {
                    setSelectedReceipt(receipt);
                    setShowReceiptModal(true);
                  }}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">Order #{receipt.trackingNumber}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(receipt.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {receipt.currency}{receipt.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{receipt.stationName}</span>
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <Printer className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ReceiptsScreen;