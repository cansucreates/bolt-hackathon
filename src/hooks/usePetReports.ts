import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PetReport, ReportFilters } from '../types/lostFound';

interface UsePetReportsReturn {
  reports: PetReport[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePetReports = (filters: ReportFilters = {}): UsePetReportsReturn => {
  const [reports, setReports] = useState<PetReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('lost_found_pets')
        .select('*')
        .order('date_reported', { ascending: false });

      // Apply filters
      if (filters.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.searchQuery) {
        query = query.or(`description.ilike.%${filters.searchQuery}%,pet_name.ilike.%${filters.searchQuery}%,location.ilike.%${filters.searchQuery}%`);
      }

      if (filters.dateRange) {
        query = query
          .gte('date_reported', filters.dateRange.start)
          .lte('date_reported', filters.dateRange.end);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching reports:', fetchError);
        setError('Failed to load pet reports. Please try again.');
        return;
      }

      setReports(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred while loading reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filters.type, filters.status, filters.location, filters.searchQuery, filters.dateRange]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('lost_found_pets_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lost_found_pets'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          
          if (payload.eventType === 'INSERT') {
            setReports(prev => [payload.new as PetReport, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setReports(prev => 
              prev.map(report => 
                report.id === payload.new.id ? payload.new as PetReport : report
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setReports(prev => 
              prev.filter(report => report.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    reports,
    loading,
    error,
    refetch: fetchReports
  };
};