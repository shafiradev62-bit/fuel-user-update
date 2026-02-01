import { loadStripe } from '@stripe/stripe-js';
import { apiCreatePaymentIntent } from './api';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export interface PaymentData {
  amount: number;
  currency: string;
  orderId: string;
  customerId: string;
  description?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntent?: any;
  error?: string;
}

export const createPaymentIntent = async (paymentData: PaymentData) => {
  try {
    const response = await apiCreatePaymentIntent(
      paymentData.amount,
      paymentData.currency,
      paymentData.orderId
    );
    return response;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create payment intent');
  }
};

export const confirmPayment = async (
  clientSecret: string,
  paymentMethodId?: string
): Promise<PaymentResult> => {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodId || {
        card: {
          // This would be populated by Stripe Elements
        }
      }
    });

    if (result.error) {
      return {
        success: false,
        error: result.error.message
      };
    }

    return {
      success: true,
      paymentIntent: result.paymentIntent
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Payment confirmation failed'
    };
  }
};

export { stripePromise };