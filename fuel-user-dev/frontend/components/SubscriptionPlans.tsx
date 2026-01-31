import React from 'react';
import { Check } from 'lucide-react';
import TapEffectButton from './TapEffectButton';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  users: number;
  vehicles: number;
  features: string[];
  popular?: boolean;
}

interface SubscriptionPlansProps {
  selectedPlan?: string;
  onPlanSelect: (plan: SubscriptionPlan) => void;
  currentPlan?: string;
  isNonSubscriber?: boolean;
  subscriptionPlans?: SubscriptionPlan[];
}

// Default plans fallback
const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    duration: 'month',
    users: 1,
    vehicles: 1,
    features: ['Basic fuel delivery', 'Email support']
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 19.99,
    duration: 'month',
    users: 2,
    vehicles: 2,
    features: ['Priority delivery', '24/7 support', 'Fuel tracking'],
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 29.99,
    duration: 'month',
    users: 5,
    vehicles: 5,
    features: ['Express delivery', 'Premium support', 'Advanced analytics', 'Custom scheduling']
  }
];

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  selectedPlan,
  onPlanSelect,
  currentPlan,
  isNonSubscriber = false,
  subscriptionPlans = DEFAULT_PLANS
}) => {
  const plans = subscriptionPlans.length > 0 ? subscriptionPlans : DEFAULT_PLANS;

  return (
    <div className="space-y-4">
      {isNonSubscriber && (
        <div className="bg-[#3AC36C]/10 border border-[#3AC36C]/20 rounded-3xl p-5 mb-6">
          <div className="flex items-start space-x-4">
            <div className="text-[#3AC36C] mt-0.5 flex-shrink-0">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-[#3AC36C] font-semibold text-lg">Save with a subscription!</h4>
              <p className="text-gray-700 text-base mt-2 leading-relaxed">
                As a non-subscriber, you pay an additional $5.00 fee per order.
                Subscribe now and save on every fuel pickup!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isCurrent = currentPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative border rounded-3xl p-5 transition-all duration-200 ${isSelected
                ? 'border-[#3AC36C] bg-[#3AC36C]/5 shadow-md'
                : isCurrent
                  ? 'border-gray-300 bg-gray-50'
                  : 'border-gray-200 hover:border-[#3AC36C]/30 hover:shadow-sm bg-white'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-[#3AC36C] text-white text-xs px-4 py-1.5 rounded-full font-semibold shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{plan.name}</h3>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-500">/{plan.duration}</span>
                  </p>
                </div>
                {isCurrent && (
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                    Current Plan
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-5 h-5 text-[#3AC36C] mr-3 flex-shrink-0" />
                  <span className="font-medium">{plan.users} user{plan.users > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-5 h-5 text-[#3AC36C] mr-3 flex-shrink-0" />
                  <span className="font-medium">{plan.vehicles} vehicle{plan.vehicles > 1 ? 's' : ''} included</span>
                </div>
                {(plan.features || []).map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <Check className="w-5 h-5 text-[#3AC36C] mr-3 flex-shrink-0" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <TapEffectButton
                onClick={() => onPlanSelect(plan)}
                disabled={isCurrent}
                className={`w-full py-4 rounded-full font-semibold transition-all duration-200 transform active:scale-98 ${isSelected
                  ? 'bg-gray-400 text-white cursor-default shadow-none'
                  : isCurrent
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-[#3AC36C] text-white hover:bg-[#2ea85a] shadow-sm hover:shadow-md'
                  }`}
              >
                {isCurrent ? 'Current Plan' : isSelected ? 'Selected' : 'Select Plan'}
              </TapEffectButton>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
