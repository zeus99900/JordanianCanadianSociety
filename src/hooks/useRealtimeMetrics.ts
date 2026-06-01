'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { MetricsData, Registration } from '@/lib/types';

export function useRealtimeMetrics(eventId: string | null) {
  const [metrics, setMetrics] = useState<MetricsData>({
    totalRevenue: 0,
    expectedMen: 0,
    expectedWomen: 0,
    expectedKids: 0,
    totalExpected: 0,
    checkedIn: 0,
    totalRegistrations: 0,
    paidCount: 0,
    unpaidCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const calculateMetrics = useCallback((registrations: Registration[]) => {
    const data: MetricsData = {
      totalRevenue: 0,
      expectedMen: 0,
      expectedWomen: 0,
      expectedKids: 0,
      totalExpected: 0,
      checkedIn: 0,
      totalRegistrations: registrations.length,
      paidCount: 0,
      unpaidCount: 0,
    };

    for (const reg of registrations) {
      if (reg.is_paid) {
        data.totalRevenue += reg.amount_paid_cents;
        data.paidCount++;
      } else {
        data.unpaidCount++;
      }
      data.expectedMen += reg.count_men;
      data.expectedWomen += reg.count_women;
      data.expectedKids += reg.count_kids;
      if (reg.is_checked_in) {
        data.checkedIn++;
      }
    }

    data.totalExpected = data.expectedMen + data.expectedWomen + data.expectedKids;
    return data;
  }, []);

  const fetchMetrics = useCallback(async () => {
    if (!eventId) return;

    const { data } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId);

    if (data) {
      setMetrics(calculateMetrics(data as Registration[]));
    }
    setIsLoading(false);
  }, [eventId, calculateMetrics]);

  useEffect(() => {
    fetchMetrics();

    if (!eventId) return;

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`registrations-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_registrations',
          filter: `event_id=eq.${eventId}`,
        },
        () => {
          // Refetch all data on any change for accuracy
          fetchMetrics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, fetchMetrics]);

  return { metrics, isLoading, refetch: fetchMetrics };
}
