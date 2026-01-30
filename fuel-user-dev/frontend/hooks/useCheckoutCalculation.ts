import { useMemo } from 'react';
import { CheckoutBreakdown, SubscriptionPlan, SERVICE_FEES, VAT_RATE } from '../types/subscription';

interface UseCheckoutCalculationParams {
  fuelCost: number;
  convenienceItemsCost: number;
  vehicleType: 'car' | 'suv';
  subscriptionPlan?: SubscriptionPlan;
  additionalVehicles?: number;
  tip?: number;
  isNonSubscriber: boolean;
}

export const useCheckoutCalculation = ({
  fuelCost,
  convenienceItemsCost,
  vehicleType,
  subscriptionPlan,
  additionalVehicles = 0,
  tip = 0,
  isNonSubscriber
}: UseCheckoutCalculationParams): CheckoutBreakdown => {
  return useMemo(() => {
    const serviceFee = vehicleType === 'car' ? SERVICE_FEES.car : SERVICE_FEES.suv;
    
    // Calculate non-subscriber additional fee
    let nonSubscriberFee = 0;
    if (isNonSubscriber) {
      nonSubscriberFee = SERVICE_FEES.nonSubscriberAdditionalFee;
    }
    
    // Calculate subscription cost
    let subscriptionCost = 0;
    if (subscriptionPlan) {
      subscriptionCost = subscriptionPlan.price;
    }
    
    // Calculate additional vehicle cost
    let additionalVehicleCost = 0;
    if (additionalVehicles > 0 && subscriptionPlan) {
      additionalVehicleCost = additionalVehicles * subscriptionPlan.additionalVehiclePrice;
    }
    
    // VAT only applies to convenience items (10%)
    const vat = convenienceItemsCost * VAT_RATE;
    
    // Calculate total with validation
    const total = 
      fuelCost +
      convenienceItemsCost +
      serviceFee +
      nonSubscriberFee +
      subscriptionCost +
      additionalVehicleCost +
      vat +
      tip;
    
    // Validate total calculation
    if (isNaN(total)) {
      console.error('Total calculation resulted in NaN', { 
        fuelCost, 
        convenienceItemsCost, 
        serviceFee, 
        nonSubscriberFee,
        subscriptionCost,
        additionalVehicleCost,
        vat, 
        tip 
      });
      // Return a safe fallback
      return {
        fuelCost: isNaN(fuelCost) ? 0 : fuelCost,
        convenienceItemsCost: isNaN(convenienceItemsCost) ? 0 : convenienceItemsCost,
        serviceFee: isNaN(serviceFee) ? 0 : serviceFee,
        nonSubscriberFee: isNonSubscriber ? (isNaN(nonSubscriberFee) ? 0 : nonSubscriberFee) : undefined,
        subscriptionPlan,
        additionalVehicles: additionalVehicles > 0 ? additionalVehicles : undefined,
        additionalVehicleCost: additionalVehicleCost > 0 ? (isNaN(additionalVehicleCost) ? 0 : additionalVehicleCost) : undefined,
        vat: isNaN(vat) ? 0 : vat,
        total: 0, // Safe fallback
        tip: tip > 0 ? (isNaN(tip) ? 0 : tip) : undefined
      };
    }
    
    return {
      fuelCost,
      convenienceItemsCost,
      serviceFee,
      nonSubscriberFee: isNonSubscriber ? nonSubscriberFee : undefined,
      subscriptionPlan,
      additionalVehicles: additionalVehicles > 0 ? additionalVehicles : undefined,
      additionalVehicleCost: additionalVehicleCost > 0 ? additionalVehicleCost : undefined,
      vat,
      total,
      tip: tip > 0 ? tip : undefined
    };
  }, [
    fuelCost,
    convenienceItemsCost,
    vehicleType,
    subscriptionPlan,
    additionalVehicles,
    tip,
    isNonSubscriber
  ]);
};
