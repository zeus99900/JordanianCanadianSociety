import Link from 'next/link';
import type { Event } from '@/lib/types';
import './event-card.css';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.event_date);
  const monthShort = eventDate.toLocaleDateString('en-CA', { month: 'short' });
  const day = eventDate.getDate();
  const formattedDate = eventDate.toLocaleDateString('en-CA', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('en-CA', {
    hour: 'numeric',
    minute: '2-digit',
  });
  const priceDisplay = event.price_adult_cents === 0
    ? 'Free'
    : `$${(event.price_adult_cents / 100).toFixed(2)} CAD`;

  return (
    <Link href={`/events/${event.id}`} className="event-card card" id={`event-card-${event.id}`}>
      <div className="event-card-image">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} />
        ) : (
          <div className="event-card-placeholder gradient-heritage">
            <span className="placeholder-icon">✦</span>
          </div>
        )}
        <div className="event-card-date-badge">
          <span className="date-month">{monthShort}</span>
          <span className="date-day">{day}</span>
        </div>
      </div>

      <div className="card-body event-card-body">
        <div className="event-card-header">
          <h3 className="event-card-title">{event.title}</h3>
          {event.title_ar && (
            <p className="event-card-title-ar text-arabic">{event.title_ar}</p>
          )}
        </div>

        <div className="event-card-details">
          <p className="event-card-detail">
            <span className="detail-icon">📅</span>
            {formattedDate} · {formattedTime}
          </p>
          {event.location && (
            <p className="event-card-detail">
              <span className="detail-icon">📍</span>
              {event.location.split(',')[0]}
            </p>
          )}
        </div>

        <div className="event-card-footer">
          <span className="event-card-price">{priceDisplay}</span>
          <span className="event-card-cta btn btn-primary btn-sm">
            Register →
          </span>
        </div>
      </div>
    </Link>
  );
}
