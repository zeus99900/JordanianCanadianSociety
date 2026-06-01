'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './stripe-payment.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormInnerProps {
  clientSecret: string;
  onSuccess: (intentId: string) => void;
  onError: (message: string) => void;
  amount: number;
}

function PaymentFormInner({ clientSecret, onSuccess, onError, amount }: PaymentFormInnerProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onError('Card element not found');
      setIsProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      onError(error.message || 'Payment failed');
      setIsProcessing(false);
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    } else {
      onError('Payment was not completed');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="stripe-card-wrapper">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: '16px',
                fontFamily: 'Inter, sans-serif',
                color: '#1A1A1A',
                '::placeholder': { color: '#9CA3AF' },
              },
              invalid: { color: '#EF4444' },
            },
          }}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary btn-lg stripe-submit"
        disabled={!stripe || isProcessing}
        id="btn-confirm-payment"
      >
        {isProcessing ? (
          <>
            <span className="spinner" />
            Processing Payment...
          </>
        ) : (
          <>🔒 Confirm Payment — ${(amount / 100).toFixed(2)} CAD</>
        )}
      </button>
      <p className="stripe-secure-note">
        🔐 Your payment is secured by Stripe. We never store your card details.
      </p>
    </form>
  );
}

interface StripePaymentFormProps {
  clientSecret: string;
  onSuccess: (intentId: string) => void;
  onError: (message: string) => void;
  amount: number;
}

export default function StripePaymentForm(props: StripePaymentFormProps) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret: props.clientSecret }}>
      <PaymentFormInner {...props} />
    </Elements>
  );
}
