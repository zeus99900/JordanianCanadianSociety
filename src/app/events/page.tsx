import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import EventCard from '@/components/EventCard';
import type { Event } from '@/lib/types';
import './events.css';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Browse and register for upcoming Jordanian Canadian Society events, celebrations, and community gatherings.',
};

async function getEvents(): Promise<Event[]> {
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('event_date', { ascending: true });
  return data || [];
}

export default async function EventsPage() {
  const events = await getEvents();
  const upcomingEvents = events.filter(
    (e) => new Date(e.event_date) >= new Date()
  );
  const pastEvents = events.filter(
    (e) => new Date(e.event_date) < new Date()
  );

  return (
    <div className="page-enter">
      {/* Events Hero */}
      <section className="events-hero gradient-heritage" id="events-hero">
        <div className="container events-hero-content">
          <p className="events-hero-arabic text-arabic-display">فعالياتنا</p>
          <h1 className="events-hero-title">Our Events</h1>
          <p className="events-hero-subtitle">
            Join us for cultural celebrations, community dinners, and gatherings
            that bring our community together.
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section" id="upcoming-events">
        <div className="container">
          <h2 className="section-title">Upcoming Events</h2>
          <p className="section-subtitle">Register now to secure your spot</p>

          {upcomingEvents.length > 0 ? (
            <div className="grid-cards" style={{ marginTop: 'var(--space-2xl)' }}>
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="events-empty" id="no-events">
              <div className="empty-icon">📅</div>
              <h3>No Upcoming Events</h3>
              <p>Check back soon — we&apos;re always planning something special!</p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="section past-events-section" id="past-events">
          <div className="container">
            <h2 className="section-title" style={{ opacity: 0.6 }}>Past Events</h2>
            <div className="grid-cards" style={{ marginTop: 'var(--space-2xl)', opacity: 0.6 }}>
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
