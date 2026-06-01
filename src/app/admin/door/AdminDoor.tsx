'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import QRScanner from '@/components/QRScanner';
import ManualSearch from '@/components/ManualSearch';
import CheckInResultDisplay from '@/components/CheckInResult';
import LiveMetrics from '@/components/LiveMetrics';
import type { Event, CheckInResult } from '@/lib/types';
import './admin-door.css';

type Tab = 'scan' | 'metrics';

export default function AdminDoor() {
  const { isAuthenticated, isLoading: authLoading, error: authError, login, logout } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('scan');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [checkInResult, setCheckInResult] = useState<CheckInResult | null>(null);
  const [scannerActive, setScannerActive] = useState(true);

  // Fetch active events
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchEvents = async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('event_date', { ascending: false });

      if (data && data.length > 0) {
        setEvents(data);
        setSelectedEventId(data[0].id);
      }
    };

    fetchEvents();
  }, [isAuthenticated]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(password);
  };

  const handleQRScan = useCallback(async (decodedText: string) => {
    // Pause scanner during check-in
    setScannerActive(false);

    try {
      const res = await fetch('/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId: decodedText }),
      });

      const data: CheckInResult = await res.json();
      setCheckInResult(data);
    } catch {
      setCheckInResult({
        status: 'error',
        message: 'Check-in failed. Please try again.',
      });
    }
  }, []);

  const handleCheckInResult = useCallback((result: CheckInResult) => {
    setCheckInResult(result);
    setScannerActive(false);
  }, []);

  const dismissResult = useCallback(() => {
    setCheckInResult(null);
    setScannerActive(true);
  }, []);

  const handleForcePaid = useCallback(async (registrationId: string) => {
    try {
      const res = await fetch('/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId, forcePaid: true }),
      });
      const data: CheckInResult = await res.json();
      setCheckInResult(data);
    } catch {
      setCheckInResult({
        status: 'error',
        message: 'Failed to mark as paid. Please try again.',
      });
    }
  }, []);

  // Password gate
  if (!isAuthenticated) {
    return (
      <div className="admin-login" id="admin-login">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <span className="admin-login-icon">🔒</span>
            <h1>Door Check-In</h1>
            <p>Enter the admin password to continue</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="admin-login-form">
            <input
              type="password"
              className="form-input admin-password-input"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              id="admin-password"
            />
            {authError && (
              <p className="form-error">
                <span>⚠️</span> {authError}
              </p>
            )}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={authLoading || !password}
              style={{ width: '100%' }}
              id="admin-login-btn"
            >
              {authLoading ? (
                <>
                  <span className="spinner" />
                  Verifying...
                </>
              ) : (
                'Enter'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-door" id="admin-door">
      {/* Check-In Result Overlay */}
      {checkInResult && (
        <CheckInResultDisplay
          result={checkInResult}
          onDismiss={dismissResult}
          onForcePaid={handleForcePaid}
        />
      )}

      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-info">
          <h1 className="admin-title">🚪 Door Check-In</h1>
          <button onClick={logout} className="btn btn-sm admin-logout" id="admin-logout">
            Logout
          </button>
        </div>

        {/* Event Selector */}
        {events.length > 0 && (
          <select
            className="form-input admin-event-select"
            value={selectedEventId || ''}
            onChange={(e) => setSelectedEventId(e.target.value)}
            id="admin-event-select"
          >
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        )}

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'scan' ? 'active' : ''}`}
            onClick={() => setActiveTab('scan')}
            id="tab-scan"
          >
            📷 Scan & Search
          </button>
          <button
            className={`admin-tab ${activeTab === 'metrics' ? 'active' : ''}`}
            onClick={() => setActiveTab('metrics')}
            id="tab-metrics"
          >
            📊 Live Metrics
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="admin-content">
        {activeTab === 'scan' && selectedEventId && (
          <div className="scan-tab animate-fade-in">
            <div className="scanner-section">
              <h3 className="scan-heading">📷 Scan QR Code</h3>
              <QRScanner onScan={handleQRScan} isActive={scannerActive} />
            </div>

            <div className="search-section">
              <h3 className="scan-heading">🔍 Manual Search</h3>
              <ManualSearch
                eventId={selectedEventId}
                onCheckIn={handleCheckInResult}
              />
            </div>
          </div>
        )}

        {activeTab === 'metrics' && selectedEventId && (
          <div className="metrics-tab animate-fade-in">
            <LiveMetrics eventId={selectedEventId} />
          </div>
        )}

        {!selectedEventId && (
          <div className="admin-no-events">
            <p>No active events found. Create an event in Supabase to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
