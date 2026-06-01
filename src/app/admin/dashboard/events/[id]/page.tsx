'use client';

import { useState, useEffect, use } from 'react';
import LiveMetrics from '@/components/LiveMetrics';

export default function EventDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = use(params);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/events/${eventId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRegistrations(data);
        }
        setIsLoading(false);
      });
  }, [eventId]);

  const exportCSV = () => {
    const headers = ['Lead Name', 'Email', 'Phone', 'Men', 'Women', 'Kids', 'Total Paid (Cents)', 'Payment Method', 'Paid', 'Checked In'];
    
    const rows = registrations.map(reg => [
      reg.lead_name,
      reg.email,
      reg.phone || '',
      reg.count_men,
      reg.count_women,
      reg.count_kids,
      reg.amount_paid_cents,
      reg.payment_method,
      reg.is_paid ? 'Yes' : 'No',
      reg.is_checked_in ? 'Yes' : 'No'
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `event_${eventId}_registrations.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (registrationId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this registration?')) {
      return;
    }
    
    try {
      const res = await fetch(`/api/admin/registrations/${registrationId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setRegistrations(registrations.filter(r => r.id !== registrationId));
      } else {
        alert('Failed to delete registration.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while deleting registration.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--color-white)', margin: 0 }}>Event Metrics</h2>
        <button 
          onClick={exportCSV}
          disabled={isLoading || registrations.length === 0}
          style={{ background: 'var(--color-gold)', color: 'black', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
        >
          Download CSV
        </button>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <LiveMetrics eventId={eventId} />
      </div>

      <h3 style={{ fontSize: '1.5rem', color: 'var(--color-white)', marginBottom: '1rem' }}>Registrations</h3>
      
      {isLoading ? (
        <p>Loading table...</p>
      ) : (
        <div style={{ overflowX: 'auto', background: 'var(--color-gray-800)', borderRadius: '1rem', border: '1px solid var(--color-gray-700)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'var(--color-gray-200)' }}>
            <thead>
              <tr style={{ background: 'var(--color-gray-900)', borderBottom: '1px solid var(--color-gray-700)' }}>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Guests</th>
                <th style={{ padding: '1rem' }}>Payment</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>No registrations yet.</td>
                </tr>
              ) : (
                registrations.map(reg => {
                  const guests = reg.count_men + reg.count_women + reg.count_kids;
                  return (
                    <tr key={reg.id} style={{ borderBottom: '1px solid var(--color-gray-700)' }}>
                      <td style={{ padding: '1rem', fontWeight: 'bold', color: 'white' }}>{reg.lead_name}</td>
                      <td style={{ padding: '1rem' }}>{reg.email}<br/><span style={{ fontSize: '0.8rem', color: 'gray' }}>{reg.phone}</span></td>
                      <td style={{ padding: '1rem' }}>{guests} <span style={{ fontSize: '0.8rem', color: 'gray' }}>(M:{reg.count_men} W:{reg.count_women} K:{reg.count_kids})</span></td>
                      <td style={{ padding: '1rem' }}>
                        ${(reg.amount_paid_cents / 100).toFixed(2)}<br/>
                        <span style={{ fontSize: '0.8rem', color: 'gray' }}>{reg.payment_method}</span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                          <span style={{ display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '1rem', fontSize: '0.8rem', background: reg.is_paid ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', color: reg.is_paid ? 'var(--color-success)' : 'var(--color-error)' }}>
                            {reg.is_paid ? 'Paid' : 'Unpaid'}
                          </span>
                          <span style={{ display: 'inline-block', padding: '0.2rem 0.5rem', borderRadius: '1rem', fontSize: '0.8rem', background: reg.is_checked_in ? 'rgba(16,185,129,0.2)' : 'rgba(107,114,128,0.2)', color: reg.is_checked_in ? 'var(--color-success)' : 'var(--color-gray-300)' }}>
                            {reg.is_checked_in ? 'Checked In' : 'Not Checked In'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button
                          onClick={() => handleDelete(reg.id)}
                          style={{
                            background: 'rgba(239,68,68,0.1)',
                            color: 'var(--color-error)',
                            border: '1px solid var(--color-error)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
