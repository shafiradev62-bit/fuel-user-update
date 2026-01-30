import React from 'react';
import { ChevronDown } from 'lucide-react';
import { CheckoutBreakdown, SERVICE_FEES, VAT_RATE } from '../types/subscription';

interface CheckoutBreakdownProps {
  breakdown: CheckoutBreakdown;
  isNonSubscriber: boolean;
  vehicleType: 'car' | 'suv';
}

const CheckoutBreakdownComponent: React.FC<CheckoutBreakdownProps> = ({
  breakdown,
  isNonSubscriber,
  vehicleType
}) => {
  // Safe null checks to prevent errors
  if (!breakdown) {
    return null;
  }

  const serviceFee = vehicleType === 'car' ? SERVICE_FEES.car : SERVICE_FEES.suv;

  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
      <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>

      {/* Fuel Cost */}
      {breakdown.fuelCost !== undefined && breakdown.fuelCost !== null && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Fuel Cost</span>
          <span className="font-medium">${breakdown.fuelCost.toFixed(2)}</span>
        </div>
      )}

      {/* Convenience Items */}
      {breakdown.convenienceItemsCost && breakdown.convenienceItemsCost > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Convenience Items</span>
          <span className="font-medium">${breakdown.convenienceItemsCost.toFixed(2)}</span>
        </div>
      )}

      {/* Service Fee */}
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">
          Service Fee ({vehicleType === 'car' ? 'Car' : 'SUV/Truck'})
        </span>
        <span className="font-medium">${serviceFee.toFixed(2)}</span>
      </div>

      {/* Non-Subscriber Additional Fee */}
      {isNonSubscriber && breakdown.nonSubscriberFee && breakdown.nonSubscriberFee > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Non-Subscriber Fee</span>
          <span className="font-medium text-orange-600">
            +${breakdown.nonSubscriberFee.toFixed(2)}
          </span>
        </div>
      )}

      {/* Subscription Plan */}
      {breakdown.subscriptionPlan && breakdown.subscriptionPlan.price && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {breakdown.subscriptionPlan.name} (Monthly)
          </span>
          <span className="font-medium text-green-600">
            ${breakdown.subscriptionPlan.price.toFixed(2)}
          </span>
        </div>
      )}

      {/* Additional Vehicles */}
      {breakdown.additionalVehicles && breakdown.additionalVehicleCost && breakdown.additionalVehicles > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            Additional Vehicles ({breakdown.additionalVehicles})
          </span>
          <span className="font-medium">
            ${breakdown.additionalVehicleCost.toFixed(2)}
          </span>
        </div>
      )}

      {/* VAT on Convenience Items Only */}
      {breakdown.vat && breakdown.vat > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">VAT (10% on convenience items)</span>
          <span className="font-medium">${breakdown.vat.toFixed(2)}</span>
        </div>
      )}

      {/* Tip */}
      {breakdown.tip && breakdown.tip > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tip for Fuel Friend</span>
          <span className="font-medium">${breakdown.tip.toFixed(2)}</span>
        </div>
      )}

      {/* Savings Notification for Non-Subscribers */}
      {isNonSubscriber && breakdown.nonSubscriberFee && breakdown.nonSubscriberFee > 0 && (
        <div className="border border-gray-200 rounded-2xl p-3 mt-3 bg-white">
          <div className="flex items-start space-x-2">
            <div className="mt-0.5 flex-shrink-0">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-gray-800 font-medium text-sm">Save ${breakdown.nonSubscriberFee.toFixed(2)} on this order</p>
              <p className="text-gray-600 text-xs mt-0.5">Subscribe to remove the non-subscriber fee</p>
            </div>
          </div>
        </div>
      )}

      {/* Service Fee Info */}
      <div className="text-xs text-gray-500 mt-4">
        <p className="mb-1">
          <strong>Service Fees:</strong> ${SERVICE_FEES.car.toFixed(2)} for cars, ${SERVICE_FEES.suv.toFixed(2)} for SUVs/trucks
        </p>
        <p className="mb-1">
          <strong>Payment Processing:</strong> Service fees are held for 12 hours before approval
        </p>
        <p>
          <strong>VAT:</strong> 10% applies to convenience store items only
        </p>
      </div>
    </div>
  );
};

export default CheckoutBreakdownComponent;
