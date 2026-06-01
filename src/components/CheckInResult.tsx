'use client';

import type { CheckInResult } from '@/lib/types';

interface CheckInResultDisplayProps {
  result: CheckInResult;
  onDismiss: () => void;
  onForcePaid?: (registrationId: string) => void;
}

export default function CheckInResultDisplay({ result, onDismiss, onForcePaid }: CheckInResultDisplayProps) {
  const statusConfig = {
    success: {
      bg: 'var(--color-success)',
      icon: '✓',
      className: 'flash-success',
    },
    already_checked_in: {
      bg: 'var(--color-warning)',
      icon: '⚠',
      className: 'flash-warning',
    },
    not_found: {
      bg: 'var(--color-error)',
      icon: '✕',
      className: 'flash-error',
    },
    not_paid: {
      bg: 'var(--color-error)',
      icon: '💰',
      className: 'flash-error',
    },
    error: {
      bg: 'var(--color-error)',
      icon: '✕',
      className: 'flash-error',
    },
  };

  const config = statusConfig[result.status] || statusConfig.error;

  // Auto-dismiss after 3 seconds, except for not_paid
  if (result.status !== 'not_paid') {
    setTimeout(onDismiss, 3000);
  }

  const totalGuests = result.registration
    ? (result.registration.count_men || 0) + (result.registration.count_women || 0) + (result.registration.count_kids || 0)
    : 0;

  return (
    <div
      className={`checkin-flash ${config.className}`}
      onClick={result.status !== 'not_paid' ? onDismiss : undefined}
      role="alert"
      style={{ '--flash-bg': config.bg } as React.CSSProperties}
    >
      <div className="flash-content">
        <div className="flash-icon">{config.icon}</div>
        <div className="flash-text">
          {result.registration && (
            <p className="flash-name">{result.registration.lead_name}</p>
          )}
          <p className="flash-message">{result.message}</p>
          {result.registration && result.status === 'success' && (
            <p className="flash-guests">{totalGuests} guest{totalGuests !== 1 ? 's' : ''}</p>
          )}
        </div>
        
        {result.status === 'not_paid' && result.registration && onForcePaid && (
          <div className="flash-actions" style={{ marginTop: '2rem' }}>
            <button 
              className="btn btn-outline" 
              style={{ backgroundColor: 'white', color: 'black', border: 'none', padding: '1rem 2rem', fontSize: '1.2rem', fontWeight: 'bold' }}
              onClick={(e) => {
                e.stopPropagation();
                onForcePaid(result.registration!.id);
              }}
            >
              Mark as Paid & Check In
            </button>
            <button
              className="btn"
              style={{ color: 'white', textDecoration: 'underline', marginTop: '1rem' }}
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      
      {result.status !== 'not_paid' && (
        <p className="flash-dismiss">Tap to dismiss</p>
      )}

      <style>{`
        .checkin-flash {
          position: fixed;
          inset: 0;
          z-index: var(--z-max);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--flash-bg);
          animation: scaleIn 0.3s ease forwards;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .flash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-lg);
          text-align: center;
        }
        .flash-icon {
          font-size: 6rem;
          color: white;
          line-height: 1;
          text-shadow: 0 2px 20px rgba(0,0,0,0.2);
        }
        .flash-text {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
        .flash-name {
          font-size: var(--text-3xl);
          font-weight: var(--font-extrabold);
          color: white;
        }
        .flash-message {
          font-size: var(--text-xl);
          color: rgba(255,255,255,0.9);
        }
        .flash-guests {
          font-size: var(--text-lg);
          color: rgba(255,255,255,0.8);
          font-weight: var(--font-semibold);
        }
        .flash-dismiss {
          position: absolute;
          bottom: var(--space-2xl);
          font-size: var(--text-sm);
          color: rgba(255,255,255,0.5);
        }
        .flash-success { background: var(--color-success) !important; }
        .flash-warning { background: var(--color-warning) !important; }
        .flash-error { background: var(--color-error) !important; }
      `}</style>
    </div>
  );
}
