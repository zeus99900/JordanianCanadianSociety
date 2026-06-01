'use client';

import { useState, useCallback } from 'react';
import type { Registration, CheckInResult } from '@/lib/types';

interface ManualSearchProps {
  eventId: string;
  onCheckIn: (result: CheckInResult) => void;
}

export default function ManualSearch({ eventId, onCheckIn }: ManualSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Registration[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [checkingInId, setCheckingInId] = useState<string | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const res = await fetch(
        `/api/registrations?search=${encodeURIComponent(query.trim())}&eventId=${eventId}`
      );
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [eventId]);

  // Debounced search
  const debounceTimerRef = useState<NodeJS.Timeout | null>(null);
  const debouncedSearch = useCallback((query: string) => {
    if (debounceTimerRef[0]) clearTimeout(debounceTimerRef[0]);
    debounceTimerRef[0] = setTimeout(() => handleSearch(query), 300);
    setSearchQuery(query);
  }, [handleSearch, debounceTimerRef]);

  const handleCheckIn = async (registrationId: string) => {
    setCheckingInId(registrationId);

    try {
      const res = await fetch('/api/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId }),
      });

      const data: CheckInResult = await res.json();
      onCheckIn(data);

      // Refresh search results
      if (searchQuery.trim().length >= 2) {
        handleSearch(searchQuery);
      }
    } catch {
      onCheckIn({
        status: 'error',
        message: 'Check-in failed. Please try again.',
      });
    } finally {
      setCheckingInId(null);
    }
  };

  return (
    <div className="manual-search" id="manual-search">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="form-input search-input"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => debouncedSearch(e.target.value)}
          id="search-name-input"
          autoComplete="off"
        />
        {isSearching && <div className="spinner search-spinner" />}
      </div>

      {results.length > 0 && (
        <div className="search-results">
          {results.map((reg) => {
            const totalGuests = reg.count_men + reg.count_women + reg.count_kids;
            return (
              <div key={reg.id} className="search-result-item">
                <div className="result-info">
                  <span className="result-name">{reg.lead_name}</span>
                  <div className="result-meta">
                    <span>{totalGuests} guest{totalGuests !== 1 ? 's' : ''}</span>
                    <span className={`badge ${reg.is_paid ? 'badge-success' : 'badge-warning'}`}>
                      {reg.is_paid ? 'Paid' : 'Unpaid'}
                    </span>
                    {reg.is_checked_in && (
                      <span className="badge badge-info">Checked In</span>
                    )}
                  </div>
                </div>
                <button
                  className={`btn btn-sm ${reg.is_checked_in ? 'btn-outline' : 'btn-secondary'}`}
                  onClick={() => handleCheckIn(reg.id)}
                  disabled={checkingInId === reg.id}
                  id={`checkin-btn-${reg.id}`}
                >
                  {checkingInId === reg.id ? (
                    <span className="spinner" style={{ width: 16, height: 16 }} />
                  ) : reg.is_checked_in ? (
                    '✓ Done'
                  ) : (
                    'Check In'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {searchQuery.trim().length >= 2 && !isSearching && results.length === 0 && (
        <p className="search-empty">No registrations found for &quot;{searchQuery}&quot;</p>
      )}

      <style>{`
        .manual-search {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          font-size: var(--text-lg);
          z-index: 1;
        }
        .search-input {
          padding-left: 44px !important;
          background: var(--color-gray-800) !important;
          border-color: var(--color-gray-700) !important;
          color: var(--color-white) !important;
        }
        .search-input::placeholder {
          color: var(--color-gray-500) !important;
        }
        .search-input:focus {
          border-color: var(--color-gold) !important;
          box-shadow: 0 0 0 3px rgba(200, 169, 81, 0.2) !important;
        }
        .search-spinner {
          position: absolute;
          right: 14px;
          width: 18px !important;
          height: 18px !important;
          border-width: 2px !important;
        }
        .search-results {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          max-height: 400px;
          overflow-y: auto;
        }
        .search-result-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-md);
          background: var(--color-gray-800);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-gray-700);
        }
        .result-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .result-name {
          font-weight: var(--font-semibold);
          color: var(--color-white);
          font-size: var(--text-base);
        }
        .result-meta {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: var(--text-xs);
          color: var(--color-gray-400);
        }
        .search-empty {
          text-align: center;
          padding: var(--space-lg);
          color: var(--color-gray-500);
          font-size: var(--text-sm);
        }
      `}</style>
    </div>
  );
}
