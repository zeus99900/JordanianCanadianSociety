import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import RegistrationForm from '@/components/RegistrationForm';
import type { Event } from '@/lib/types';
import type { Metadata } from 'next';
import './event-detail.css';

interface PageProps {
  params: Promise<{ eventId: string }>;
}

async function getEvent(eventId: string): Promise<Event | null> {
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .eq('is_active', true)
    .single();
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = await getEvent(eventId);
  if (!event) return { title: 'Event Not Found' };
  return {
    title: event.title,
    description: event.description || `Register for ${event.title}`,
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { eventId } = await params;
  const event = await getEvent(eventId);

  if (!event) notFound();

  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString('en-CA', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = event.title.toLowerCase().includes('80') || event.title.toLowerCase().includes('independence')
    ? "4:30 PM - 8:00 PM"
    : eventDate.toLocaleTimeString('en-CA', {
        hour: 'numeric',
        minute: '2-digit',
      });

  return (
    <div className="page-enter">
      {/* Event Hero */}
      <section className="event-hero" id="event-hero">
        <div className="event-hero-bg gradient-heritage pattern-bg">
          {event.image_url && (
            <img
              src={event.image_url}
              alt={event.title}
              className="event-hero-image"
            />
          )}
        </div>
        <div className="container event-hero-content">
          {event.title_ar && (
            <p className="event-hero-arabic text-arabic-display">{event.title_ar}</p>
          )}
          <h1 className="event-hero-title">{event.title}</h1>
          <div className="event-hero-meta">
            <span className="meta-item">📅 {formattedDate}</span>
            <span className="meta-item">🕐 {formattedTime}</span>
            {event.location && (
              <span className="meta-item">📍 {event.location}</span>
            )}
          </div>
        </div>
      </section>

      {/* Event Content */}
      <section className="section event-content-section">
        <div className="container event-layout">
          {/* Left: Details */}
          <div className="event-details" id="event-details">
            <h2 className="section-title">About This Event</h2>
            <div className="arabesque-divider" style={{ maxWidth: '200px', marginBottom: '1.5rem' }} />
            {event.description && (
              <div className="event-description">
                {event.description.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            )}

            <div className="event-info-grid">
              <div className="event-info-card">
                <span className="event-info-icon">🎟️</span>
                <div>
                  <span className="event-info-label">Registration Fee</span>
                  <span className="event-info-value">
                    {event.price_adult_cents === 0
                      ? 'Free'
                      : `$${(event.price_adult_cents / 100).toFixed(2)} Flat Rate`}
                  </span>
                </div>
              </div>
              {event.max_capacity && (
                <div className="event-info-card">
                  <span className="event-info-icon">🎟️</span>
                  <div>
                    <span className="event-info-label">Capacity</span>
                    <span className="event-info-value">{event.max_capacity} guests</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Registration Form */}
          <div className="event-register" id="event-register">
            <RegistrationForm event={event} />
          </div>
        </div>
      </section>
    </div>
  );
}
