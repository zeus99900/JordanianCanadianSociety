'use client';

import Link from 'next/link';
import type { Event } from '@/lib/types';
import './announcement-banner.css';

interface AnnouncementBannerProps {
  event: Event;
}

export default function AnnouncementBanner({ event }: AnnouncementBannerProps) {
  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString('en-CA', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="announcement-banner" id="announcement-banner">
      <div className="announcement-inner">
        <span className="announcement-icon">🎉</span>
        <p className="announcement-text">
          <strong>Next Event:</strong> {event.title} — {formattedDate}
          {event.location && ` at ${event.location.split(',')[0]}`}
        </p>
        <Link
          href={`/events/${event.id}`}
          className="announcement-cta"
          id="announcement-register"
        >
          Register Now →
        </Link>
      </div>
    </div>
  );
}
