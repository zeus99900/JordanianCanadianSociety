'use client';

import { useRealtimeMetrics } from '@/hooks/useRealtimeMetrics';

interface LiveMetricsProps {
  eventId: string;
}

export default function LiveMetrics({ eventId }: LiveMetricsProps) {
  const { metrics, isLoading } = useRealtimeMetrics(eventId);

  if (isLoading) {
    return (
      <div className="metrics-loading">
        <div className="spinner spinner-lg" />
        <p>Loading metrics...</p>
      </div>
    );
  }

  return (
    <div className="live-metrics" id="live-metrics">
      {/* Revenue */}
      <div className="metric-card metric-revenue">
        <span className="metric-icon">💰</span>
        <div className="metric-data">
          <span className="metric-value">
            ${(metrics.totalRevenue / 100).toFixed(2)}
          </span>
          <span className="metric-label">Total Revenue (Paid)</span>
        </div>
      </div>

      {/* Expected Attendance */}
      <div className="metric-card metric-attendance">
        <span className="metric-icon">👥</span>
        <div className="metric-data">
          <span className="metric-value">{metrics.totalExpected}</span>
          <span className="metric-label">Expected Guests</span>
        </div>
        <div className="metric-breakdown">
          <span>👨 {metrics.expectedMen}</span>
          <span>👩 {metrics.expectedWomen}</span>
          <span>👧 {metrics.expectedKids}</span>
        </div>
      </div>

      {/* Checked In */}
      <div className="metric-card metric-checkedin">
        <span className="metric-icon">✅</span>
        <div className="metric-data">
          <span className="metric-value">{metrics.checkedIn}</span>
          <span className="metric-label">
            Checked In / {metrics.totalRegistrations} registrations
          </span>
        </div>
        {metrics.totalRegistrations > 0 && (
          <div className="metric-progress">
            <div
              className="metric-progress-bar"
              style={{
                width: `${(metrics.checkedIn / metrics.totalRegistrations) * 100}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* Paid vs Unpaid */}
      <div className="metric-card metric-payments">
        <span className="metric-icon">📊</span>
        <div className="metric-data">
          <span className="metric-label">Payment Status</span>
        </div>
        <div className="metric-split">
          <div className="split-item split-paid">
            <span className="split-value">{metrics.paidCount}</span>
            <span className="split-label">Paid</span>
          </div>
          <div className="split-item split-unpaid">
            <span className="split-value">{metrics.unpaidCount}</span>
            <span className="split-label">Pending</span>
          </div>
        </div>
      </div>

      <style>{`
        .live-metrics {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-md);
        }
        @media (min-width: 640px) {
          .live-metrics {
            grid-template-columns: 1fr 1fr;
          }
        }
        .metrics-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-3xl);
          color: var(--color-gray-400);
        }
        .metric-card {
          background: var(--color-gray-800);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          border: 1px solid var(--color-gray-700);
        }
        .metric-icon {
          font-size: 1.5rem;
        }
        .metric-data {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .metric-value {
          font-size: var(--text-4xl);
          font-weight: var(--font-extrabold);
          color: var(--color-white);
          line-height: 1;
        }
        .metric-label {
          font-size: var(--text-sm);
          color: var(--color-gray-400);
        }
        .metric-breakdown {
          display: flex;
          gap: var(--space-md);
          font-size: var(--text-sm);
          color: var(--color-gray-300);
        }
        .metric-progress {
          width: 100%;
          height: 8px;
          background: var(--color-gray-700);
          border-radius: 4px;
          overflow: hidden;
        }
        .metric-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--color-olive), var(--color-success));
          border-radius: 4px;
          transition: width var(--transition-normal);
        }
        .metric-split {
          display: flex;
          gap: var(--space-lg);
        }
        .split-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .split-value {
          font-size: var(--text-2xl);
          font-weight: var(--font-bold);
          color: var(--color-white);
        }
        .split-label {
          font-size: var(--text-xs);
          color: var(--color-gray-400);
        }
        .split-paid .split-value { color: var(--color-success); }
        .split-unpaid .split-value { color: var(--color-warning); }
        .metric-revenue .metric-value { color: var(--color-gold); }
        .metric-checkedin .metric-value { color: var(--color-success); }
      `}</style>
    </div>
  );
}
