'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import type { RegistrationWithEvent } from '@/lib/types';
import './confirmation.css';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get('registrationId');
  const [registration, setRegistration] = useState<RegistrationWithEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!registrationId) {
      setError('No registration ID provided');
      setLoading(false);
      return;
    }

    fetch(`/api/registrations?id=${registrationId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setRegistration(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load registration');
        setLoading(false);
      });
  }, [registrationId]);

  if (loading) {
    return (
      <div className="confirmation-loading">
        <div className="spinner spinner-lg" />
        <p>Loading your registration...</p>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="confirmation-error">
        <div className="error-icon">❌</div>
        <h2>Something went wrong</h2>
        <p>{error || 'Registration not found'}</p>
      </div>
    );
  }

  const totalGuests =
    registration.count_men + registration.count_women + registration.count_kids;
  const eventTitle = registration.events?.title || 'Event';
  const isPaid = registration.is_paid;
  const paymentMethodLabels: Record<string, string> = {
    stripe: 'Credit/Debit Card',
    e_transfer: 'E-Transfer',
    cash_at_door: 'Cash at Door',
  };

  return (
    <div className="confirmation-page page-enter" id="confirmation-page">
      <div className="container confirmation-container">
        {/* Success Header */}
        <div className="confirmation-header animate-scale-in">
          <div className={`confirmation-icon ${isPaid ? 'paid' : 'pending'}`}>
            {isPaid ? '✅' : '⏳'}
          </div>
          <h1 className="confirmation-title">
            {isPaid ? "You're Registered!" : 'Registration Reserved'}
          </h1>
          <p className="confirmation-subtitle">
            {isPaid
              ? `Your spot for ${eventTitle} is confirmed.`
              : `Your spot for ${eventTitle} is reserved. Complete payment to confirm.`}
          </p>
        </div>

        {/* QR Code */}
        <div className="confirmation-qr animate-fade-in-up stagger-1">
          <QRCodeDisplay value={registration.id} size={220} />
        </div>

        {/* Details Card */}
        <div className="confirmation-details card animate-fade-in-up stagger-2">
          <div className="card-body">
            <h3 className="details-title">Registration Details</h3>
            <div className="arabesque-divider" style={{ marginBottom: '1rem' }} />

            <div className="details-grid">
              <div className="detail-row">
                <span className="detail-label">Name</span>
                <span className="detail-value">{registration.lead_name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email</span>
                <span className="detail-value">{registration.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Event</span>
                <span className="detail-value">{eventTitle}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total Guests</span>
                <span className="detail-value">
                  {totalGuests} — {registration.count_men > 0 && `${registration.count_men} men`}
                  {registration.count_women > 0 &&
                    `${registration.count_men > 0 ? ', ' : ''}${registration.count_women} women`}
                  {registration.count_kids > 0 &&
                    `${totalGuests - registration.count_kids > 0 ? ', ' : ''}${registration.count_kids} kids`}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Payment</span>
                <span className="detail-value">
                  {paymentMethodLabels[registration.payment_method] || registration.payment_method}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Amount</span>
                <span className="detail-value detail-amount">
                  ${(registration.amount_paid_cents / 100).toFixed(2)} CAD
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className={`badge ${isPaid ? 'badge-success' : 'badge-warning'}`}>
                  {isPaid ? 'Paid' : 'Payment Pending'}
                </span>
              </div>
            </div>

            {!isPaid && registration.payment_method === 'e_transfer' && (
              <div className="payment-reminder">
                <p>📧 Please send your e-transfer to complete registration.</p>
                <p>Include your name and event title in the message.</p>
              </div>
            )}

            {!isPaid && registration.payment_method === 'cash_at_door' && (
              <div className="payment-reminder">
                <p>💵 Please bring cash to pay at the door on event day.</p>
              </div>
            )}
          </div>
        </div>

        {/* Registration ID */}
        <p className="confirmation-id">
          Registration ID: <code>{registration.id}</code>
        </p>
      </div>
    </div>
  );
}
