'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Event } from '@/lib/types';
import TicketCounter from './TicketCounter';
import StripePaymentForm from './StripePaymentForm';
import './registration-form.css';

interface RegistrationFormProps {
  event: Event;
}

type PaymentMethod = 'stripe' | 'e_transfer' | 'cash_at_door';

export default function RegistrationForm({ event }: RegistrationFormProps) {
  const router = useRouter();
  const [leadName, setLeadName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countMen, setCountMen] = useState(0);
  const [countWomen, setCountWomen] = useState(0);
  const [countKids, setCountKids] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [totalCents, setTotalCents] = useState(0);

  const totalAdults = countMen + countWomen;
  const totalGuests = totalAdults + countKids;

  useEffect(() => {
    // Pricing logic: Flat rate per registration (individual or family)
    // If they have selected any guests, they pay the flat event price
    if (totalGuests > 0) {
      setTotalCents(event.price_adult_cents);
    } else {
      setTotalCents(0);
    }
  }, [totalGuests, event.price_adult_cents]);

  const totalDisplay = `$${(totalCents / 100).toFixed(2)} CAD`;

  const isFormValid = leadName.trim() !== '' && email.trim() !== '' && totalGuests > 0;

  const handleCreatePaymentIntent = async () => {
    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: event.id,
        countMen,
        countWomen,
        countKids,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create payment');
    return data.clientSecret;
  };

  const handleCreateRegistration = async (stripeIntentId?: string) => {
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: event.id,
        leadName: leadName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        countMen,
        countWomen,
        countKids,
        stripeIntentId,
        paymentMethod,
        amountPaidCents: totalCents,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create registration');
    return data.registrationId;
  };

  const handleStripeSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const secret = await handleCreatePaymentIntent();
      setClientSecret(secret);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  const handleStripeSuccess = async (intentId: string) => {
    try {
      const registrationId = await handleCreateRegistration(intentId);
      router.push(`/events/${event.id}/confirmation?registrationId=${registrationId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed after payment');
      setIsSubmitting(false);
    }
  };

  const handleNonStripeSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const registrationId = await handleCreateRegistration();
      router.push(`/events/${event.id}/confirmation?registrationId=${registrationId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      setIsSubmitting(false);
    }
  };

  const etransferEmail = event.etransfer_email || process.env.NEXT_PUBLIC_ETRANSFER_EMAIL || 'payments@jordaniancanadian.ca';

  return (
    <div className="registration-form" id="registration-form">
      <h2 className="reg-form-title">Register for this Event</h2>
      <p className="reg-form-subtitle">Fill in your details and select your tickets</p>

      <div className="arabesque-divider" style={{ margin: '1.5rem 0' }} />

      {/* Personal Info */}
      <div className="reg-section">
        <h3 className="reg-section-title">Your Information</h3>
        <div className="reg-fields">
          <div className="form-group">
            <label htmlFor="lead-name" className="form-label">Full Name *</label>
            <input
              type="text"
              id="lead-name"
              className="form-input"
              placeholder="e.g. Ahmad Al-Rashed"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address *</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              id="phone"
              className="form-input"
              placeholder="(902) 555-1234"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </div>
        </div>
      </div>

      {/* Attendees */}
      <div className="reg-section">
        <h3 className="reg-section-title">Attendees Breakdown</h3>
        <p className="reg-form-subtitle" style={{marginBottom: '1rem', marginTop: '-0.5rem', color: 'var(--color-gray-500)', fontSize: '0.9rem'}}>
          Please let us know how many people are in your party for headcount purposes.
        </p>
        <div className="ticket-list">
          <TicketCounter
            label="Men"
            emoji="👨"
            count={countMen}
            onChange={setCountMen}
          />
          <TicketCounter
            label="Women"
            emoji="👩"
            count={countWomen}
            onChange={setCountWomen}
          />
          <TicketCounter
            label="Kids"
            emoji="👧"
            count={countKids}
            onChange={setCountKids}
          />
        </div>

        <div className="reg-total">
          <div className="total-breakdown">
            <span>{totalGuests} guest{totalGuests !== 1 ? 's' : ''} total</span>
            <span className="total-detail" style={{color: 'var(--color-gold-dark)', fontWeight: 500}}>
              Registration Fee: {event.price_adult_cents === 0 ? 'Free' : `$${(event.price_adult_cents / 100).toFixed(2)} Flat Rate (Family/Individual)`}
            </span>
          </div>
          <div className="total-amount">{totalDisplay}</div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="reg-section">
        <h3 className="reg-section-title">Payment Method</h3>
        <div className="payment-methods">
          <label className={`payment-option ${paymentMethod === 'stripe' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="payment-method"
              value="stripe"
              checked={paymentMethod === 'stripe'}
              onChange={() => { setPaymentMethod('stripe'); setClientSecret(null); }}
            />
            <span className="payment-option-icon">💳</span>
            <div className="payment-option-text">
              <span className="payment-option-label">Pay Online</span>
              <span className="payment-option-desc">Credit or debit card</span>
            </div>
          </label>

          <label className={`payment-option ${paymentMethod === 'e_transfer' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="payment-method"
              value="e_transfer"
              checked={paymentMethod === 'e_transfer'}
              onChange={() => { setPaymentMethod('e_transfer'); setClientSecret(null); }}
            />
            <span className="payment-option-icon">🏦</span>
            <div className="payment-option-text">
              <span className="payment-option-label">E-Transfer</span>
              <span className="payment-option-desc">Send via Interac</span>
            </div>
          </label>

          <label className={`payment-option ${paymentMethod === 'cash_at_door' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="payment-method"
              value="cash_at_door"
              checked={paymentMethod === 'cash_at_door'}
              onChange={() => { setPaymentMethod('cash_at_door'); setClientSecret(null); }}
            />
            <span className="payment-option-icon">💵</span>
            <div className="payment-option-text">
              <span className="payment-option-label">Pay at Door</span>
              <span className="payment-option-desc">Cash on event day</span>
            </div>
          </label>
        </div>

        {/* E-Transfer Instructions */}
        {paymentMethod === 'e_transfer' && (
          <div className="etransfer-instructions animate-fade-in-up">
            <div className="etransfer-box">
              <h4>📧 E-Transfer Instructions</h4>
              <p>Send <strong>{totalDisplay}</strong> to:</p>
              <p className="etransfer-email">{etransferEmail}</p>
              <p className="etransfer-note">
                Include your <strong>full name</strong> and <strong>&quot;{event.title}&quot;</strong> in the message.
                Your registration will be confirmed once payment is received.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="reg-error animate-fade-in">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Stripe Payment Form */}
      {paymentMethod === 'stripe' && clientSecret && (
        <div className="reg-section animate-fade-in-up">
          <StripePaymentForm
            clientSecret={clientSecret}
            onSuccess={handleStripeSuccess}
            onError={(msg) => { setError(msg); setIsSubmitting(false); }}
            amount={totalCents}
          />
        </div>
      )}

      {/* Submit Buttons */}
      {paymentMethod === 'stripe' && !clientSecret && (
        <button
          type="button"
          className="btn btn-primary btn-lg reg-submit"
          onClick={handleStripeSubmit}
          disabled={!isFormValid || isSubmitting}
          id="btn-pay-register"
        >
          {isSubmitting ? (
            <>
              <span className="spinner" />
              Processing...
            </>
          ) : (
            <>Pay {totalDisplay} & Register</>
          )}
        </button>
      )}

      {paymentMethod === 'e_transfer' && (
        <button
          type="button"
          className="btn btn-secondary btn-lg reg-submit"
          onClick={handleNonStripeSubmit}
          disabled={!isFormValid || isSubmitting}
          id="btn-etransfer-register"
        >
          {isSubmitting ? (
            <>
              <span className="spinner" />
              Registering...
            </>
          ) : (
            <>Reserve Spot — E-Transfer {totalDisplay}</>
          )}
        </button>
      )}

      {paymentMethod === 'cash_at_door' && (
        <button
          type="button"
          className="btn btn-outline btn-lg reg-submit"
          onClick={handleNonStripeSubmit}
          disabled={!isFormValid || isSubmitting}
          id="btn-cash-register"
        >
          {isSubmitting ? (
            <>
              <span className="spinner" />
              Registering...
            </>
          ) : (
            <>Reserve Spot — Pay at Door</>
          )}
        </button>
      )}
    </div>
  );
}
