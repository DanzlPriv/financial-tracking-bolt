import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Recurring } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function useRecurring() {
  const { user } = useAuth();
  const [recurring, setRecurring] = useState<Recurring[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setRecurring([]);
      setLoading(false);
      return;
    }
    fetchRecurring();
  }, [user]);

  const fetchRecurring = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('recurring')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('next_due_date', { ascending: true });

      if (error) throw error;
      setRecurring(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recurring');
    } finally {
      setLoading(false);
    }
  };

  return {
    recurring,
    loading,
    error,
    refetch: fetchRecurring,
  };
}
