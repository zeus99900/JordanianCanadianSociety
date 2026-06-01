'use client';

import './ticket-counter.css';

interface TicketCounterProps {
  label: string;
  emoji: string;
  count: number;
  onChange: (count: number) => void;
  pricePerTicket: number; // in cents
  min?: number;
  max?: number;
}

export default function TicketCounter({
  label,
  emoji,
  count,
  onChange,
  pricePerTicket,
  min = 0,
  max = 99,
}: TicketCounterProps) {
  const decrement = () => {
    if (count > min) onChange(count - 1);
  };

  const increment = () => {
    if (count < max) onChange(count + 1);
  };

  const priceDisplay = pricePerTicket === 0
    ? 'Free'
    : `$${(pricePerTicket / 100).toFixed(2)} each`;

  return (
    <div className="ticket-counter" id={`ticket-${label.toLowerCase()}`}>
      <div className="ticket-info">
        <span className="ticket-emoji">{emoji}</span>
        <div className="ticket-labels">
          <span className="ticket-label">{label}</span>
          <span className="ticket-price">{priceDisplay}</span>
        </div>
      </div>

      <div className="ticket-controls">
        <button
          type="button"
          className="ticket-btn ticket-btn-dec"
          onClick={decrement}
          disabled={count <= min}
          aria-label={`Decrease ${label} count`}
        >
          −
        </button>
        <span className="ticket-count" aria-live="polite">{count}</span>
        <button
          type="button"
          className="ticket-btn ticket-btn-inc"
          onClick={increment}
          disabled={count >= max}
          aria-label={`Increase ${label} count`}
        >
          +
        </button>
      </div>
    </div>
  );
}
