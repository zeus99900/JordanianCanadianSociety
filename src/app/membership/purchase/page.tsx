'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import '../membership.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setIsProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message || 'Payment failed');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Confirm with our backend
      try {
        const res = await fetch('/api/memberships/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
        });

        if (res.ok) {
          router.push('/membership');
          router.refresh();
        } else {
          setError('Payment succeeded but membership activation failed. Please contact support.');
          setIsProcessing(false);
        }
      } catch (err) {
        setError('Network error confirming membership.');
        setIsProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: '2rem' }}>
      <PaymentElement />
      {error && <div className="auth-error">{error}</div>}
      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="btn-purchase"
        style={{ marginTop: '2rem' }}
      >
        {isProcessing ? 'Processing...' : 'Pay $50.00 CAD'}
      </button>
    </form>
  );
}

export default function MembershipCheckout() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/memberships/create-intent', {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.error || 'Failed to initialize payment');
        }
      })
      .catch(() => setError('Network error'));
  }, []);

  return (
    <div className="membership-container">
      <div className="membership-card-wrapper">
        <div className="membership-card" style={{ maxWidth: '500px', background: 'var(--color-white)', color: '#333', textAlign: 'left' }}>
          <h2 style={{ color: '#333', marginBottom: '1rem', textAlign: 'center' }}>
            Complete Your Membership
          </h2>
          <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
            You will be charged $50.00 CAD for a 1-year membership.
          </p>

          {error && <div className="auth-error">{error}</div>}
          
          {!clientSecret && !error && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading secure checkout...</div>
          )}

          {clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: { theme: 'stripe' },
              }}
            >
              <CheckoutForm clientSecret={clientSecret} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
