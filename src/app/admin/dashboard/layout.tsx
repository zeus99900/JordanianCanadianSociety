'use client';

import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, login, isLoading, error, logout } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(password);
  };

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-gray-900)' }}>
        <div style={{ background: 'var(--color-gray-800)', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '400px' }}>
          <h1 style={{ color: 'var(--color-gold)', marginBottom: '1.5rem', textAlign: 'center' }}>Admin Dashboard</h1>
          {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>{error}</div>}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-gray-200)' }}>Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', background: 'var(--color-gray-900)', border: '1px solid var(--color-gray-700)', color: 'white', borderRadius: '0.5rem' }}
                required
              />
            </div>
            <button type="submit" disabled={isLoading} style={{ background: 'var(--color-gold)', color: 'var(--color-gray-900)', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
              {isLoading ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-gray-900)' }}>
      <header style={{ background: 'var(--color-gray-800)', borderBottom: '1px solid var(--color-gray-700)', padding: '1rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <h1 style={{ color: 'var(--color-gold)', margin: 0, fontSize: '1.5rem' }}>Nashama Admin</h1>
            <nav style={{ display: 'flex', gap: '1rem' }}>
              <Link href="/admin/dashboard" style={{ color: 'var(--color-gray-300)', textDecoration: 'none' }}>Events</Link>
              <Link href="/admin/door" style={{ color: 'var(--color-gray-300)', textDecoration: 'none' }}>Door Scanner</Link>
            </nav>
          </div>
          <button onClick={logout} style={{ background: 'none', border: '1px solid var(--color-gray-700)', color: 'var(--color-gray-300)', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </header>
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
}
