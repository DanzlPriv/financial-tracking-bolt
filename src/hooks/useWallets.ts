import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Wallet } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function useWallets() {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setWallets([]);
      setLoading(false);
      return;
    }
    fetchWallets();
  }, [user]);

  const fetchWallets = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setWallets(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wallets');
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async (wallet: Omit<Wallet, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: new Error('Not authenticated') };
    try {
      const { data, error } = await supabase
        .from('wallets')
        .insert({
          ...wallet,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  const updateWallet = async (id: string, updates: Partial<Wallet>) => {
    if (!user) return { error: new Error('Not authenticated') };
    try {
      const { data, error } = await supabase
        .from('wallets')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  const deleteWallet = async (id: string) => {
    if (!user) return { error: new Error('Not authenticated') };
    try {
      const { error } = await supabase
        .from('wallets')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return {
    wallets,
    loading,
    error,
    createWallet,
    updateWallet,
    deleteWallet,
    refetch: fetchWallets,
  };
}
