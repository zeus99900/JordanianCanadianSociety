'use client';

import { useState, useCallback } from 'react';
import type { AdminAuthResponse } from '@/lib/types';

const SESSION_KEY = 'jcs_admin_auth';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data: AdminAuthResponse = await res.json();

      if (data.success) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      } else {
        setError(data.error || 'Invalid password');
        setIsLoading(false);
        return false;
      }
    } catch {
      setError('Authentication failed. Please try again.');
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, isLoading, error, login, logout };
}
