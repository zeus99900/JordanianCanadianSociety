'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  event_date: string;
  location: string;
  is_active: boolean;
}

export default function AdminDashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [priceAdult, setPriceAdult] = useState('25.00');
  const [priceKid, setPriceKid] = useState('0.00');
  const [capacity, setCapacity] = useState('200');
  const [etransferEmail, setEtransferEmail] = useState('');

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/admin/events');
      const data = await res.json();
      if (res.ok) setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, titleAr, description, eventDate, location, priceAdult, priceKid, capacity, etransferEmail
        }),
      });
      if (res.ok) {
        setShowCreateForm(false);
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--color-white)' }}>Events Manager</h2>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{ background: 'var(--color-gold)', color: 'black', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
        >
          {showCreateForm ? 'Cancel' : '+ Create New Event'}
        </button>
      </div>

      {showCreateForm && (
        <div style={{ background: 'var(--color-gray-800)', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem', border: '1px solid var(--color-gray-700)' }}>
          <h3 style={{ color: 'var(--color-white)', marginBottom: '1.5rem' }}>Create New Event</h3>
          <form onSubmit={handleCreateEvent} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label>Event Title (English)</label>
              <input required value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label>Event Title (Arabic)</label>
              <input value={titleAr} onChange={e => setTitleAr(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} rows={3} />
            </div>
            <div>
              <label>Date & Time</label>
              <input required type="datetime-local" value={eventDate} onChange={e => setEventDate(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
            </div>
            <div>
              <label>Location</label>
              <input required value={location} onChange={e => setLocation(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
            </div>
            <div>
              <label>Adult Price ($)</label>
              <input required type="number" step="0.01" value={priceAdult} onChange={e => setPriceAdult(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
            </div>
            <div>
              <label>Kid Price ($)</label>
              <input required type="number" step="0.01" value={priceKid} onChange={e => setPriceKid(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
            </div>
            <div>
              <label>Max Capacity</label>
              <input required type="number" value={capacity} onChange={e => setCapacity(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
            </div>
            <div>
              <label>E-transfer Email</label>
              <input required type="email" value={etransferEmail} onChange={e => setEtransferEmail(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
            </div>
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <button type="submit" style={{ background: 'var(--color-success)', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', width: '100%' }}>
                Save Event
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <p>Loading events...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {events.map((evt) => (
            <Link href={`/admin/dashboard/events/${evt.id}`} key={evt.id} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--color-gray-800)', padding: '1.5rem', borderRadius: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--color-gray-700)', transition: 'transform 0.2s' }}>
                <div>
                  <h3 style={{ color: 'var(--color-gold)', margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{evt.title}</h3>
                  <p style={{ color: 'var(--color-gray-400)', margin: 0 }}>
                    {new Date(evt.event_date).toLocaleString()} • {evt.location}
                  </p>
                </div>
                <div>
                  {evt.is_active ? (
                    <span style={{ background: 'rgba(16,185,129,0.2)', color: 'var(--color-success)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem' }}>Active</span>
                  ) : (
                    <span style={{ background: 'rgba(239,68,68,0.2)', color: 'var(--color-error)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem' }}>Inactive</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
